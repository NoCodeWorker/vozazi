---
name: vector-databases
description: Bases de datos vectoriales para RAG en VOZAZI. Use cuando implemente almacenamiento de embeddings, búsqueda semántica, o retrieval para pedagogía.
---

# Vector Databases Skill

Esta skill proporciona experiencia en bases de datos vectoriales (pgvector, Pinecone) para almacenar y buscar embeddings de documentación pedagógica en VOZAZI.

## Objetivo

Implementar sistema de almacenamiento y retrieval de embeddings usando pgvector (PostgreSQL) para búsqueda semántica de documentación pedagógica en el sistema RAG de VOZAZI.

## Instrucciones

### 1. pgvector: Configuración Inicial

```python
# apps/audio-engine/infrastructure/vector_store_pgvector.py
import asyncpg
import numpy as np
from typing import List, Dict, Any, Optional
from contextlib import asynccontextmanager

class PGVectorStore:
    """Almacenamiento vectorial con pgvector"""
    
    def __init__(
        self,
        database_url: str,
        embedding_dimension: int = 384,  # all-MiniLM-L6-v2
        table_name: str = 'knowledge_embeddings',
    ):
        self.database_url = database_url
        self.embedding_dimension = embedding_dimension
        self.table_name = table_name
        self.pool: Optional[asyncpg.Pool] = None
    
    async def initialize(self):
        """Inicializar pool y tabla"""
        self.pool = await asyncpg.create_pool(self.database_url)
        
        async with self.pool.acquire() as conn:
            # Habilitar extensión pgvector
            await conn.execute('CREATE EXTENSION IF NOT EXISTS vector')
            
            # Crear tabla
            await conn.execute(f'''
                CREATE TABLE IF NOT EXISTS {self.table_name} (
                    id TEXT PRIMARY KEY,
                    document_slug TEXT NOT NULL,
                    chunk_type TEXT NOT NULL,
                    content TEXT NOT NULL,
                    metadata JSONB,
                    embedding vector({self.embedding_dimension}),
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            ''')
            
            # Crear índices para búsqueda rápida
            # IVFFlat para datasets grandes (>100k vectores)
            await conn.execute(f'''
                CREATE INDEX IF NOT EXISTS idx_{self.table_name}_embedding_ivfflat
                ON {self.table_name}
                USING ivfflat (embedding vector_cosine_ops)
                WITH (lists = 100)
            ''')
            
            # HNSW para mejor precisión (más lento de construir)
            await conn.execute(f'''
                CREATE INDEX IF NOT EXISTS idx_{self.table_name}_embedding_hnsw
                ON {self.table_name}
                USING hnsw (embedding vector_cosine_ops)
            ''')
    
    async def close(self):
        """Cerrar pool"""
        if self.pool:
            await self.pool.close()
    
    @asynccontextmanager
    async def get_connection(self):
        """Obtener conexión del pool"""
        async with self.pool.acquire() as conn:
            yield conn
```

### 2. Inserción de Embeddings

```python
# apps/audio-engine/infrastructure/vector_store_pgvector.py (continuación)
class PGVectorStore:
    # ... código anterior ...
    
    async def insert_embedding(
        self,
        id: str,
        document_slug: str,
        chunk_type: str,
        content: str,
        embedding: np.ndarray,
        metadata: Optional[Dict[str, Any]] = None,
    ):
        """Insertar embedding individual"""
        async with self.get_connection() as conn:
            await conn.execute(f'''
                INSERT INTO {self.table_name}
                (id, document_slug, chunk_type, content, metadata, embedding)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (id) DO UPDATE SET
                    content = EXCLUDED.content,
                    metadata = EXCLUDED.metadata,
                    embedding = EXCLUDED.embedding,
                    updated_at = NOW()
            ''',
                id,
                document_slug,
                chunk_type,
                content,
                json.dumps(metadata) if metadata else None,
                embedding.tolist(),
            )
    
    async def insert_embeddings_batch(
        self,
        embeddings_data: List[Dict[str, Any]],
        batch_size: int = 100,
    ):
        """
        Insertar múltiples embeddings en batch
        
        Args:
            embeddings_data: Lista de dicts con id, document_slug, chunk_type, content, embedding, metadata
            batch_size: Tamaño del batch
        """
        async with self.get_connection() as conn:
            async with conn.transaction():
                for i in range(0, len(embeddings_data), batch_size):
                    batch = embeddings_data[i:i + batch_size]
                    
                    for item in batch:
                        await conn.execute(f'''
                            INSERT INTO {self.table_name}
                            (id, document_slug, chunk_type, content, metadata, embedding)
                            VALUES ($1, $2, $3, $4, $5, $6)
                            ON CONFLICT (id) DO NOTHING
                        ''',
                            item['id'],
                            item['document_slug'],
                            item['chunk_type'],
                            item['content'],
                            json.dumps(item.get('metadata')),
                            item['embedding'].tolist(),
                        )
    
    async def delete_embedding(self, id: str):
        """Eliminar embedding por ID"""
        async with self.get_connection() as conn:
            await conn.execute(f'''
                DELETE FROM {self.table_name}
                WHERE id = $1
            ''', id)
    
    async def delete_by_document(self, document_slug: str):
        """Eliminar todos los embeddings de un documento"""
        async with self.get_connection() as conn:
            await conn.execute(f'''
                DELETE FROM {self.table_name}
                WHERE document_slug = $1
            ''', document_slug)
```

### 3. Búsqueda Semántica

```python
# apps/audio-engine/infrastructure/vector_store_pgvector.py (continuación)
class PGVectorStore:
    # ... código anterior ...
    
    async def search_similar(
        self,
        query_embedding: np.ndarray,
        limit: int = 5,
        filters: Optional[Dict[str, Any]] = None,
        min_similarity: float = 0.3,
    ) -> List[Dict[str, Any]]:
        """
        Buscar embeddings similares
        
        Args:
            query_embedding: Embedding de la consulta
            limit: Número de resultados
            filters: Filtros adicionales (category, difficulty, etc.)
            min_similarity: Similitud mínima (0-1)
            
        Returns:
            Lista de resultados con contenido y metadata
        """
        async with self.get_connection() as conn:
            # Construir WHERE clause con filtros
            where_clauses = []
            params = [query_embedding.tolist()]
            param_count = 1
            
            if filters:
                for key, value in filters.items():
                    param_count += 1
                    where_clauses.append(f"metadata->>'{key}' = ${param_count}")
                    params.append(value)
            
            # Añadir filtro de similitud mínima
            param_count += 1
            where_clauses.append(f"1 - (embedding <=> ${param_count}::vector) >= ${param_count + 1}")
            params.append(query_embedding.tolist())
            params.append(min_similarity)
            
            where_sql = ""
            if where_clauses:
                where_sql = "WHERE " + " AND ".join(where_clauses)
            
            query = f'''
                SELECT
                    id,
                    document_slug,
                    chunk_type,
                    content,
                    metadata,
                    1 - (embedding <=> ${1}::vector) AS similarity
                FROM {self.table_name}
                {where_sql}
                ORDER BY embedding <=> ${1}::vector
                LIMIT ${2}
            '''
            
            rows = await conn.fetch(query, *params, limit)
            
            return [
                {
                    'id': row['id'],
                    'document_slug': row['document_slug'],
                    'chunk_type': row['chunk_type'],
                    'content': row['content'],
                    'metadata': dict(row['metadata']),
                    'similarity': float(row['similarity']),
                }
                for row in rows
            ]
    
    async def search_with_hybrid_ranking(
        self,
        query_text: str,
        query_embedding: np.ndarray,
        limit: int = 5,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Búsqueda híbrida: semántica + full-text search
        
        Combina resultados de búsqueda vectorial con PostgreSQL full-text search
        """
        async with self.get_connection() as conn:
            # 1. Búsqueda semántica
            semantic_results = await self.search_similar(
                query_embedding,
                limit=limit * 2,
                filters=filters,
            )
            
            # 2. Búsqueda full-text
            ft_query = " & ".join(query_text.split())  # Simple tokenization
            fulltext_query = f'''
                SELECT
                    id,
                    document_slug,
                    chunk_type,
                    content,
                    metadata,
                    ts_rank(to_tsvector('spanish', content), plainto_tsquery('spanish', $1)) AS ft_rank
                FROM {self.table_name}
                WHERE to_tsvector('spanish', content) @@ plainto_tsquery('spanish', $1)
                LIMIT $2
            '''
            
            ft_rows = await conn.fetch(fulltext_query, ft_query, limit * 2)
            
            # 3. Combinar resultados con recíprocal rank fusion
            combined = {}
            
            # Añadir resultados semánticos
            for i, result in enumerate(semantic_results):
                combined[result['id']] = {
                    **result,
                    'semantic_rank': i + 1,
                    'ft_rank': None,
                }
            
            # Añadir resultados full-text
            for i, row in enumerate(ft_rows):
                row_dict = {
                    'id': row['id'],
                    'document_slug': row['document_slug'],
                    'chunk_type': row['chunk_type'],
                    'content': row['content'],
                    'metadata': dict(row['metadata']),
                    'similarity': 0.0,
                    'semantic_rank': None,
                    'ft_rank': i + 1,
                }
                
                if row['id'] in combined:
                    combined[row['id']]['ft_rank'] = i + 1
                else:
                    combined[row['id']] = row_dict
            
            # 4. Calcular reciprocal rank fusion score
            for result in combined.values():
                semantic_score = 1 / (result['semantic_rank'] or 1000)
                ft_score = 1 / (result['ft_rank'] or 1000)
                result['combined_score'] = semantic_score + ft_score
            
            # 5. Ordenar por combined_score y retornar top N
            sorted_results = sorted(
                combined.values(),
                key=lambda x: x['combined_score'],
                reverse=True,
            )[:limit]
            
            return sorted_results
```

### 4. Pinecone (Alternativa Cloud)

```python
# apps/audio-engine/infrastructure/vector_store_pinecone.py
from pinecone import Pinecone, ServerlessSpec
from typing import List, Dict, Any, Optional

class PineconeVectorStore:
    """Almacenamiento vectorial con Pinecone"""
    
    def __init__(
        self,
        api_key: str,
        index_name: str = 'vozazi-knowledge',
        dimension: int = 384,
        metric: str = 'cosine',
        cloud: str = 'aws',
        region: str = 'us-east-1',
    ):
        self.api_key = api_key
        self.index_name = index_name
        self.dimension = dimension
        self.metric = metric
        
        # Inicializar cliente
        self.pc = Pinecone(api_key=api_key)
        
        # Crear o conectar al índice
        self._initialize_index(cloud, region)
    
    def _initialize_index(self, cloud: str, region: str):
        """Crear índice si no existe"""
        if self.index_name not in self.pc.list_indexes().names():
            self.pc.create_index(
                name=self.index_name,
                dimension=self.dimension,
                metric=self.metric,
                spec=ServerlessSpec(
                    cloud=cloud,
                    region=region,
                ),
            )
        
        self.index = self.pc.Index(self.index_name)
    
    def upsert_embedding(
        self,
        id: str,
        embedding: np.ndarray,
        metadata: Dict[str, Any],
    ):
        """Insertar o actualizar embedding"""
        self.index.upsert(
            vectors=[
                (id, embedding.tolist(), metadata)
            ],
        )
    
    def upsert_batch(
        self,
        embeddings: List[tuple],
        batch_size: int = 100,
    ):
        """
        Insertar batch de embeddings
        
        Args:
            embeddings: Lista de (id, embedding, metadata)
        """
        for i in range(0, len(embeddings), batch_size):
            batch = embeddings[i:i + batch_size]
            self.index.upsert(vectors=batch)
    
    def search_similar(
        self,
        query_embedding: np.ndarray,
        limit: int = 5,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """Buscar embeddings similares"""
        response = self.index.query(
            vector=query_embedding.tolist(),
            top_k=limit,
            include_metadata=True,
            include_values=False,
            filter=filters,
        )
        
        return [
            {
                'id': match.id,
                'score': match.score,
                'metadata': match.metadata,
            }
            for match in response.matches
        ]
    
    def delete_by_id(self, id: str):
        """Eliminar embedding por ID"""
        self.index.delete(ids=[id])
    
    def delete_by_filter(self, filter_condition: Dict[str, Any]):
        """Eliminar embeddings por filtro"""
        self.index.delete(filter=filter_condition)
    
    def get_stats(self) -> Dict[str, Any]:
        """Obtener estadísticas del índice"""
        stats = self.index.describe_index_stats()
        return {
            'dimension': stats.dimension,
            'index_fullness': stats.index_fullness,
            'total_vector_count': stats.total_vector_count,
        }
```

### 5. Servicio de Retrieval con Vector Store

```python
# apps/audio-engine/services/retrieval_service.py
from typing import List, Dict, Any, Optional
import numpy as np
from ..infrastructure.vector_store_pgvector import PGVectorStore
from ..domain.knowledge.embedding_service import EmbeddingService

class RetrievalService:
    """Servicio para retrieval de documentación"""
    
    def __init__(
        self,
        vector_store: PGVectorStore,
        embedding_service: EmbeddingService,
    ):
        self.vector_store = vector_store
        self.embedding_service = embedding_service
    
    async def retrieve_for_error(
        self,
        error_type: str,
        user_level: str = 'beginner',
        limit: int = 3,
    ) -> List[Dict[str, Any]]:
        """Recuperar documentación para un error vocal"""
        
        # 1. Construir query
        query_text = self._build_error_query(error_type, user_level)
        
        # 2. Generar embedding
        query_embedding = await self.embedding_service.generate_embedding(query_text)
        
        # 3. Buscar con filtros
        filters = {
            'difficulty': user_level,
        }
        
        results = await self.vector_store.search_similar(
            query_embedding,
            limit=limit,
            filters=filters,
            min_similarity=0.4,
        )
        
        # 4. Si no hay suficientes, relajar filtros
        if len(results) < limit:
            additional = await self.vector_store.search_similar(
                query_embedding,
                limit=limit - len(results),
                filters={},
            )
            results.extend(additional)
        
        return results[:limit]
    
    async def retrieve_for_technique(
        self,
        technique: str,
        limit: int = 3,
    ) -> List[Dict[str, Any]]:
        """Recuperar documentación para una técnica"""
        
        query_text = f"técnica vocal: {technique} ejercicios práctica"
        query_embedding = await self.embedding_service.generate_embedding(query_text)
        
        results = await self.vector_store.search_similar(
            query_embedding,
            limit=limit,
            filters={},
        )
        
        return results
    
    async def retrieve_hybrid(
        self,
        query_text: str,
        filters: Optional[Dict[str, Any]] = None,
        limit: int = 5,
    ) -> List[Dict[str, Any]]:
        """Búsqueda híbrida semántica + full-text"""
        
        query_embedding = await self.embedding_service.generate_embedding(query_text)
        
        results = await self.vector_store.search_with_hybrid_ranking(
            query_text=query_text,
            query_embedding=query_embedding,
            limit=limit,
            filters=filters,
        )
        
        return results
    
    def _build_error_query(self, error_type: str, user_level: str) -> str:
        """Construir query para error"""
        
        error_descriptions = {
            'unstable_pitch': 'nota inestable que tiembla o varía en frecuencia',
            'flat_entry': 'nota que comienza más baja de lo debido',
            'sharp_entry': 'nota que comienza más alta de lo debido',
            'pitch_drift': 'nota que se desafina progresivamente',
            'breath_leak': 'fuga de aire que debilita el sonido',
            'throat_tension': 'tensión en la garganta al cantar',
        }
        
        description = error_descriptions.get(error_type, error_type)
        
        return f"problema vocal: {description} nivel {user_level} ejercicio corrección"
```

### 6. Indexación de Documentación

```python
# scripts/index_knowledge_docs.py
import asyncio
from pathlib import Path
from apps.audio-engine.domain.knowledge.doc_parser import KnowledgeDocumentParser
from apps.audio-engine.domain.knowledge.embedding_service import EmbeddingService
from apps.audio-engine.infrastructure.vector_store_pgvector import PGVectorStore

async def index_all_documents():
    """Indexar todos los documentos de conocimiento"""
    
    # 1. Inicializar servicios
    parser = KnowledgeDocumentParser()
    embedding_service = EmbeddingService()
    vector_store = PGVectorStore(database_url='postgresql://...')
    
    await vector_store.initialize()
    await embedding_service.load_model()
    
    # 2. Parsear documentos
    docs_dir = Path('docs')
    documents = parser.parse_directory(docs_dir)
    
    print(f"Found {len(documents)} documents")
    
    # 3. Generar embeddings y guardar
    all_embeddings = []
    
    for doc in documents:
        print(f"Processing: {doc.slug}")
        
        for chunk in doc.chunks:
            # Generar embedding
            embedding = await embedding_service.generate_embedding(chunk.content)
            
            # Preparar datos
            embedding_data = {
                'id': chunk.id,
                'document_slug': doc.slug,
                'chunk_type': chunk.chunk_type,
                'content': chunk.content,
                'embedding': embedding,
                'metadata': {
                    **chunk.metadata,
                    'title': doc.title,
                    'category': doc.category,
                    'related_techniques': doc.related_techniques,
                    'related_errors': doc.related_errors,
                },
            }
            
            all_embeddings.append(embedding_data)
    
    # 4. Insertar en batch
    print(f"Inserting {len(all_embeddings)} embeddings...")
    await vector_store.insert_embeddings_batch(all_embeddings, batch_size=100)
    
    print("Indexing complete!")
    
    # 5. Cerrar conexiones
    await vector_store.close()

if __name__ == '__main__':
    asyncio.run(index_all_documents())
```

## Restricciones

- NO usar pgvector sin instalar la extensión primero
- NO olvidar normalizar embeddings para similitud coseno
- NO hacer búsqueda sin índices para datasets grandes
- NO insertar embeddings uno por uno (usar batch)
- Siempre validar dimensión de embeddings (debe coincidir con el modelo)
- Siempre limpiar embeddings de documentos eliminados
- Siempre monitorear tamaño del índice y performance

## Ejemplos

### Bueno: Migración de Embeddings
```python
# scripts/migrate_embeddings.py
async def migrate_embeddings():
    """Migrar embeddings de Pinecone a pgvector"""
    
    # Conectar a ambos stores
    pinecone_store = PineconeVectorStore(api_key='...')
    pg_store = PGVectorStore(database_url='...')
    
    await pg_store.initialize()
    
    # Exportar desde Pinecone
    all_vectors = []
    pagination_token = None
    
    while True:
        response = pinecone_store.index.query(
            vector=[0] * 384,  # Dummy query
            top_k=10000,
            include_metadata=True,
            include_values=True,
            pagination_token=pagination_token,
        )
        
        for match in response.matches:
            all_vectors.append({
                'id': match.id,
                'document_slug': match.metadata.get('document_slug'),
                'chunk_type': match.metadata.get('chunk_type'),
                'content': match.metadata.get('content'),
                'embedding': np.array(match.values),
                'metadata': match.metadata,
            })
        
        if not response.matches or len(response.matches) < 10000:
            break
        
        pagination_token = response.pagination_token
    
    # Importar a pgvector
    await pg_store.insert_embeddings_batch(all_vectors)
    
    print(f"Migrated {len(all_vectors)} embeddings")
```
