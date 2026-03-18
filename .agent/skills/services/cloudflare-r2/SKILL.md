---
name: cloudflare-r2
description: Cloudflare R2 para almacenamiento de audio en VOZAZI. Use cuando implemente upload, download, gestión de buckets, o URLs firmadas para archivos de audio.
---

# Cloudflare R2 Skill

Esta skill proporciona experiencia en Cloudflare R2 para almacenar y gestionar archivos de audio en VOZAZI.

## Objetivo

Implementar almacenamiento seguro, escalable y económico de archivos de audio usando Cloudflare R2 con URLs firmadas y políticas de retención.

## Instrucciones

### 1. Configuración Inicial

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

```typescript
// lib/r2/config.ts
import { S3Client } from '@aws-sdk/client-s3';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME || 'vozazi-audio';
```

### 2. Upload de Audio

```typescript
// lib/r2/upload.ts
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET } from './config';
import { v4 as uuidv4 } from 'uuid';

interface UploadAudioOptions {
  userId: string;
  sessionId: string;
  audioBuffer: Buffer;
  mimeType: string;
  duration?: number;
  exerciseType?: string;
}

export async function uploadAudioFile({
  userId,
  sessionId,
  audioBuffer,
  mimeType,
  duration,
  exerciseType,
}: UploadAudioOptions): Promise<{
  storageKey: string;
  url: string;
  size: number;
}> {
  // 1. Validar tipo de archivo
  if (!mimeType.startsWith('audio/')) {
    throw new Error(`Invalid file type: ${mimeType}`);
  }
  
  // 2. Validar tamaño (max 50MB)
  const maxSize = 50 * 1024 * 1024;
  if (audioBuffer.length > maxSize) {
    throw new Error(`File too large: ${audioBuffer.length} bytes`);
  }
  
  // 3. Generar key única y no predecible
  const timestamp = Date.now();
  const uniqueId = uuidv4();
  const extension = mimeType.split('/')[1] || 'wav';
  const storageKey = `audio/${userId}/${sessionId}/${timestamp}_${uniqueId}.${extension}`;
  
  // 4. Upload a R2
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: storageKey,
    Body: audioBuffer,
    ContentType: mimeType,
    Metadata: {
      'user-id': userId,
      'session-id': sessionId,
      'duration': duration?.toString() || '0',
      'exercise-type': exerciseType || 'unknown',
      'uploaded-at': new Date().toISOString(),
    },
  });
  
  await r2Client.send(command);
  
  // 5. Construir URL pública (si el bucket es público) o retornar key
  const url = `https://storage.googleapis.com/${R2_BUCKET}/${storageKey}`;
  
  return {
    storageKey,
    url,
    size: audioBuffer.length,
  };
}
```

### 3. Upload con Multipart para Archivos Grandes

```typescript
// lib/r2/upload-multipart.ts
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET } from './config';

interface MultipartUploadOptions {
  userId: string;
  sessionId: string;
  audioStream: AsyncIterable<Buffer>;
  mimeType: string;
}

export async function uploadAudioMultipart({
  userId,
  sessionId,
  audioStream,
  mimeType,
}: MultipartUploadOptions): Promise<{
  storageKey: string;
  etag: string;
}> {
  const timestamp = Date.now();
  const storageKey = `audio/${userId}/${sessionId}/${timestamp}_multipart.wav`;
  
  let uploadId: string | undefined;
  
  try {
    // 1. Iniciar multipart upload
    const createCommand = new CreateMultipartUploadCommand({
      Bucket: R2_BUCKET,
      Key: storageKey,
      ContentType: mimeType,
      Metadata: {
        'user-id': userId,
        'session-id': sessionId,
        'upload-type': 'multipart',
      },
    });
    
    const createResponse = await r2Client.send(createCommand);
    uploadId = createResponse.UploadId;
    
    if (!uploadId) {
      throw new Error('Failed to get upload ID');
    }
    
    // 2. Upload de partes
    const parts: { PartNumber: number; ETag: string }[] = [];
    let partNumber = 1;
    const minPartSize = 5 * 1024 * 1024; // 5MB mínimo por parte
    
    let buffer = Buffer.alloc(0);
    
    for await (const chunk of audioStream) {
      buffer = Buffer.concat([buffer, chunk]);
      
      // Cuando tengamos suficiente datos, upload la parte
      if (buffer.length >= minPartSize) {
        const uploadCommand = new UploadPartCommand({
          Bucket: R2_BUCKET,
          Key: storageKey,
          UploadId: uploadId,
          PartNumber: partNumber,
          Body: buffer,
        });
        
        const uploadResponse = await r2Client.send(uploadCommand);
        
        parts.push({
          PartNumber: partNumber,
          ETag: uploadResponse.ETag!,
        });
        
        buffer = Buffer.alloc(0);
        partNumber++;
      }
    }
    
    // 3. Upload de la parte final (si queda data)
    if (buffer.length > 0) {
      const uploadCommand = new UploadPartCommand({
        Bucket: R2_BUCKET,
        Key: storageKey,
        UploadId: uploadId,
        PartNumber: partNumber,
        Body: buffer,
      });
      
      const uploadResponse = await r2Client.send(uploadCommand);
      
      parts.push({
        PartNumber: partNumber,
        ETag: uploadResponse.ETag!,
      });
    }
    
    // 4. Completar multipart upload
    const completeCommand = new CompleteMultipartUploadCommand({
      Bucket: R2_BUCKET,
      Key: storageKey,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    });
    
    const completeResponse = await r2Client.send(completeCommand);
    
    return {
      storageKey,
      etag: completeResponse.ETag!,
    };
    
  } catch (error) {
    // 5. Abortar upload si hay error
    if (uploadId) {
      try {
        const abortCommand = new AbortMultipartUploadCommand({
          Bucket: R2_BUCKET,
          Key: storageKey,
          UploadId: uploadId,
        });
        await r2Client.send(abortCommand);
      } catch (abortError) {
        console.error('Failed to abort multipart upload:', abortError);
      }
    }
    
    throw error;
  }
}
```

### 4. URLs Firmadas (Signed URLs)

```typescript
// lib/r2/signed-url.ts
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, R2_BUCKET } from './config';

interface SignedUrlOptions {
  storageKey: string;
  expiresIn?: number; // segundos
  disposition?: 'inline' | 'attachment';
  filename?: string;
}

export async function generateSignedUrl({
  storageKey,
  expiresIn = 3600, // 1 hora por defecto
  disposition = 'inline',
  filename,
}: SignedUrlOptions): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: storageKey,
    ResponseContentDisposition: disposition === 'attachment' 
      ? `attachment; filename="${filename || 'audio.wav'}"`
      : 'inline',
  });
  
  const signedUrl = await getSignedUrl(r2Client, command, {
    expiresIn,
  });
  
  return signedUrl;
}

// Generar múltiples URLs firmadas
export async function generateSignedUrls(
  storageKeys: string[],
  expiresIn = 3600
): Promise<Record<string, string>> {
  const urls = await Promise.all(
    storageKeys.map(key => generateSignedUrl({ storageKey: key, expiresIn }))
  );
  
  return Object.fromEntries(
    storageKeys.map((key, index) => [key, urls[index]])
  );
}
```

### 5. Download de Audio

```typescript
// lib/r2/download.ts
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET } from './config';

export async function downloadAudioFile(storageKey: string): Promise<{
  buffer: Buffer;
  contentType: string;
  contentLength: number;
  metadata: Record<string, string>;
}> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: storageKey,
  });
  
  const response = await r2Client.send(command);
  
  // Convertir stream a buffer
  const chunks: Uint8Array[] = [];
  for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  
  const buffer = Buffer.concat(chunks);
  
  // Extraer metadata
  const metadata: Record<string, string> = {};
  if (response.Metadata) {
    Object.entries(response.Metadata).forEach(([key, value]) => {
      metadata[key] = value;
    });
  }
  
  return {
    buffer,
    contentType: response.ContentType || 'application/octet-stream',
    contentLength: response.ContentLength || buffer.length,
    metadata,
  };
}

// Download directo a stream (para archivos grandes)
export async function streamAudioFile(
  storageKey: string,
  onChunk: (chunk: Buffer) => void | Promise<void>
): Promise<void> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: storageKey,
  });
  
  const response = await r2Client.send(command);
  
  for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
    await onChunk(Buffer.from(chunk));
  }
}
```

### 6. Listar y Eliminar Archivos

```typescript
// lib/r2/manage.ts
import {
  ListObjectsV2Command,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET } from './config';

interface ListOptions {
  userId?: string;
  sessionId?: string;
  prefix?: string;
  maxKeys?: number;
  continuationToken?: string;
}

export async function listAudioFiles({
  userId,
  sessionId,
  prefix = '',
  maxKeys = 100,
  continuationToken,
}: ListOptions = {}) {
  // Construir prefix
  let fullPrefix = prefix;
  if (userId) {
    fullPrefix = `audio/${userId}/${fullPrefix}`;
  }
  if (sessionId) {
    fullPrefix = `${fullPrefix}${sessionId}/`;
  }
  
  const command = new ListObjectsV2Command({
    Bucket: R2_BUCKET,
    Prefix: fullPrefix,
    MaxKeys: maxKeys,
    ContinuationToken: continuationToken,
  });
  
  const response = await r2Client.send(command);
  
  return {
    files: response.Contents?.map(obj => ({
      key: obj.Key!,
      size: obj.Size!,
      lastModified: obj.LastModified!,
      etag: obj.ETag,
    })) || [],
    isTruncated: response.IsTruncated,
    continuationToken: response.NextContinuationToken,
    totalSize: response.Contents?.reduce((sum, obj) => sum + (obj.Size || 0), 0) || 0,
  };
}

export async function deleteAudioFile(storageKey: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET,
    Key: storageKey,
  });
  
  await r2Client.send(command);
}

// Eliminar múltiples archivos (ej: cuando se borra un usuario)
export async function deleteAudioFiles(storageKeys: string[]): Promise<void> {
  if (storageKeys.length === 0) return;
  
  // R2 permite hasta 1000 objetos por request
  const batchSize = 1000;
  
  for (let i = 0; i < storageKeys.length; i += batchSize) {
    const batch = storageKeys.slice(i, i + batchSize);
    
    const command = new DeleteObjectsCommand({
      Bucket: R2_BUCKET,
      Delete: {
        Objects: batch.map(key => ({ Key: key })),
        Quiet: false,
      },
    });
    
    const response = await r2Client.send(command);
    
    if (response.Errors?.length) {
      console.error('Failed to delete:', response.Errors);
    }
  }
}

// Eliminar todos los archivos de un usuario
export async function deleteUserAudioFiles(userId: string): Promise<void> {
  let continuationToken: string | undefined;
  const keysToDelete: string[] = [];
  
  // Listar todos los archivos
  do {
    const result = await listAudioFiles({
      userId,
      continuationToken,
      maxKeys: 1000,
    });
    
    keysToDelete.push(...result.files.map(f => f.key));
    continuationToken = result.continuationToken;
  } while (continuationToken);
  
  // Eliminar en batches
  await deleteAudioFiles(keysToDelete);
}
```

### 7. Lifecycle Policies

```typescript
// lib/r2/lifecycle.ts
// Configurar desde AWS CLI o Cloudflare Dashboard

/*
Reglas recomendadas para R2:

1. Archivos temporales (7 días)
   - Prefix: audio/*/
   - Suffix: _temp.wav
   - Expiration: 7 días

2. Audio procesado (90 días)
   - Prefix: audio/*/processed/
   - Expiration: 90 días

3. Audio bruto premium (1 año)
   - Prefix: audio/*/raw/
   - Tag: plan=premium
   - Expiration: 365 días

4. Audio bruto free (30 días)
   - Prefix: audio/*/raw/
   - Tag: plan=free
   - Expiration: 30 días

Ejemplo de configuración JSON:
{
  "Rules": [
    {
      "ID": "DeleteTempFiles",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "audio/",
        "Tag": {
          "Key": "type",
          "Value": "temp"
        }
      },
      "Expiration": {
        "Days": 7
      }
    },
    {
      "ID": "ArchiveProcessedAudio",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "audio/processed/"
      },
      "Expiration": {
        "Days": 90
      }
    }
  ]
}
*/
```

### 8. Server Actions para Upload

```typescript
// server/actions/audio-upload.ts
'use server';

import { requireUser } from '@/lib/auth/require-user';
import { uploadAudioFile } from '@/lib/r2/upload';
import { generateSignedUrl } from '@/lib/r2/signed-url';
import { db } from '@/db';
import { sessionAudioAssets } from '@/db/schema';

export async function uploadSessionAudio(formData: FormData) {
  const user = await requireUser();
  
  const audioFile = formData.get('audio') as File;
  const sessionId = formData.get('sessionId') as string;
  
  if (!audioFile || !sessionId) {
    return { success: false, error: 'Missing required fields' };
  }
  
  try {
    // 1. Leer archivo
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);
    
    // 2. Upload a R2
    const { storageKey, url, size } = await uploadAudioFile({
      userId: user.id,
      sessionId,
      audioBuffer,
      mimeType: audioFile.type,
    });
    
    // 3. Guardar referencia en BD
    const [asset] = await db.insert(sessionAudioAssets).values({
      sessionId,
      assetType: 'raw_audio',
      storageProvider: 'r2',
      storageKey,
      mimeType: audioFile.type,
      fileSizeBytes: size,
      createdAt: new Date(),
    }).returning();
    
    // 4. Generar URL firmada para acceso
    const signedUrl = await generateSignedUrl({
      storageKey,
      expiresIn: 3600, // 1 hora
    });
    
    return {
      success: true,
      assetId: asset.id,
      url: signedUrl,
      size,
    };
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error: 'Upload failed' };
  }
}
```

## Restricciones

- NO exponer credenciales de R2 en el cliente
- NO permitir upload sin autenticación
- NO usar keys predecibles para archivos
- NO olvidar validar tipo y tamaño de archivo
- Siempre usar HTTPS para transferencias
- Siempre generar URLs firmadas con expiración
- Siempre implementar lifecycle policies para limpiar archivos viejos

## Ejemplos

### Bueno: Componente de Upload con Progreso
```typescript
// components/audio/audio-upload.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface AudioUploadProps {
  sessionId: string;
  onUploadComplete: (assetId: string, url: string) => void;
  onError: (error: string) => void;
}

export function AudioUpload({ sessionId, onUploadComplete, onError }: AudioUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validar tipo
    if (!file.type.startsWith('audio/')) {
      onError('Please select an audio file');
      return;
    }
    
    // Validar tamaño (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      onError('File too large (max 50MB)');
      return;
    }
    
    setIsUploading(true);
    setProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('sessionId', sessionId);
      
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setProgress(percent);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          onUploadComplete(result.assetId, result.url);
        } else {
          onError('Upload failed');
        }
        setIsUploading(false);
      });
      
      xhr.addEventListener('error', () => {
        onError('Upload failed');
        setIsUploading(false);
      });
      
      xhr.open('POST', '/api/audio/upload');
      xhr.send(formData);
      
    } catch (error) {
      onError('Upload failed');
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />
      
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload Audio'}
      </Button>
      
      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">{progress}%</p>
        </div>
      )}
    </div>
  );
}
```
