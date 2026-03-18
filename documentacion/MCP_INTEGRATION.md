# VOZAZI — Integración MCP (Model Context Protocol)

> Guía completa para integrar VOZAZI con GitHub MCP Server y Vercel MCP.

---

## 📋 Resumen Ejecutivo

VOZAZI implementa MCP en dos niveles:

1. **MCP Interno**: Clientes para servicios internos (PostgreSQL, Redis, R2, OpenAI, Anthropic, Clerk, Stripe)
2. **MCP Externo**: Integración con GitHub MCP Server y Vercel MCP para AI agents

---

## 🔧 GitHub MCP Server

### ¿Qué es?

El **GitHub MCP Server** es el servidor oficial de GitHub que permite a los AI agents interactuar con GitHub mediante lenguaje natural.

### Configuración en VOZAZI

#### 1. Crear GitHub Personal Access Token

```bash
# Scopes requeridos:
- repo (Full control of private repositories)
- read:org (Read org membership)
- read:packages (Read packages)
- workflow (Update GitHub Action workflows)
```

#### 2. Configurar en VS Code (`.vscode/mcp.json`)

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${input:github_mcp_pat}"
      }
    }
  },
  "inputs": [
    {
      "type": "promptString",
      "id": "github_mcp_pat",
      "description": "GitHub Personal Access Token",
      "password": true
    }
  ]
}
```

#### 3. Configuración alternativa con Docker

```json
{
  "servers": {
    "github": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_token}"
      }
    }
  }
}
```

#### 4. Variables de Entorno (.env)

```env
# GitHub MCP
GITHUB_MCP_ENABLED=true
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...
GITHUB_HOST=https://github.com
GITHUB_TOOLSETS=repos,issues,pull_requests,actions,code_security
```

### Casos de Uso en VOZAZI

```
# Gestión de Issues
"Create an issue for the audio processing bug we found"
"List all open issues labeled as 'bug' in the vozazi repo"

# Pull Requests
"Create a PR that fixes the transcription latency issue"
"Review the latest PR in the audio-engine branch"

# CI/CD
"Check the status of the latest GitHub Actions workflow"
"Trigger the deployment workflow for production"

# Code Security
"Show me the latest Dependabot alerts"
"List all code scanning alerts in the main branch"
```

---

## 🚀 Vercel MCP

### ¿Qué es?

**Vercel MCP** permite desplegar servidores MCP en la plataforma de Vercel y conectarlos con AI hosts.

### Arquitectura VOZAZI + Vercel MCP

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   AI Host       │────▶│   Vercel MCP    │────▶│   VOZAZI        │
│   (Cursor,      │     │   Client        │     │   MCP Server    │
│   Copilot)      │     │                 │     │   (Audio API)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 1. Crear MCP Server para VOZAZI

El audio-engine de VOZAZI ya expone endpoints compatibles con MCP:

```python
# apps/audio-engine/app/mcp/server.py
from mcp.server.fastmcp import FastMCP
from app.mcp.manager import mcp_manager

mcp = FastMCP("VOZAZI Audio Engine")

@mcp.tool()
async def transcribe_audio(audio_file_id: str) -> dict:
    """Transcribe an audio file to text."""
    # Implementation using OpenAI MCP
    pass

@mcp.tool()
async def analyze_audio(audio_file_id: str, features: list) -> dict:
    """Analyze audio for emotions, sentiment, speakers, etc."""
    # Implementation using Anthropic MCP
    pass

@mcp.tool()
async def get_audio_status(audio_file_id: str) -> str:
    """Get the processing status of an audio file."""
    pass
```

### 2. Desplegar en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar MCP server
vercel mcp deploy --project vozazi-audio-engine
```

### 3. Configurar en AI Host

**VS Code Configuration:**

```json
{
  "servers": {
    "vozazi": {
      "type": "http",
      "url": "https://vozazi-audio-engine.vercel.app/mcp",
      "headers": {
        "Authorization": "Bearer ${input:vozazi_api_key}"
      }
    }
  },
  "inputs": [
    {
      "type": "promptString",
      "id": "vozazi_api_key",
      "description": "VOZAZI API Key",
      "password": true
    }
  ]
}
```

### 4. Variables de Entorno en Vercel

```env
# Vercel MCP Configuration
MCP_SERVER_ENABLED=true
MCP_SERVER_NAME=vozazi-audio-engine
MCP_API_KEY=vozazi_mcp_...

# Audio Engine
NEXT_PUBLIC_AUDIO_ENGINE_URL=https://vozazi-audio-engine.vercel.app
```

---

## 📦 MCP Servers de VOZAZI

### Audio Engine MCP (`apps/audio-engine/app/mcp/server.py`)

```python
from mcp.server.fastmcp import FastMCP
from app.mcp.openai_client import openai_mcp
from app.mcp.anthropic_client import anthropic_mcp
from app.mcp.storage import r2_storage_mcp
from app.mcp.database import db_mcp

mcp = FastMCP("VOZAZI Audio Engine")

# Audio Processing Tools
@mcp.tool()
async def transcribe_audio(audio_file_id: str, language: str = "es") -> str:
    """
    Transcribe an audio file to text using Whisper.
    
    Args:
        audio_file_id: The ID of the audio file
        language: Language code (default: 'es' for Spanish)
    
    Returns:
        The transcribed text
    """
    # Download audio from R2
    audio_bytes = await r2_storage_mcp.download_file(f"audio/{audio_file_id}")
    
    # Transcribe with OpenAI
    result = await openai_mcp.transcribe_audio_bytes(audio_bytes)
    return result["text"] if result else ""

@mcp.tool()
async def analyze_sentiment(audio_file_id: str) -> dict:
    """
    Analyze the sentiment of an audio file.
    
    Args:
        audio_file_id: The ID of the audio file
    
    Returns:
        Sentiment analysis result
    """
    # Transcribe first
    transcript = await transcribe_audio(audio_file_id)
    
    # Analyze with Anthropic
    analysis = await anthropic_mcp.analyze_text(transcript, "detect_sentiment")
    return {"sentiment": analysis}

@mcp.tool()
async def get_audio_metadata(audio_file_id: str) -> dict:
    """
    Get metadata for an audio file.
    
    Args:
        audio_file_id: The ID of the audio file
    
    Returns:
        Audio metadata including duration, size, format
    """
    metadata = await r2_storage_mcp.get_file_metadata(f"audio/{audio_file_id}")
    return metadata

@mcp.tool()
async def list_user_audios(user_id: str) -> list:
    """
    List all audio files for a user.
    
    Args:
        user_id: The user's ID
    
    Returns:
        List of audio file metadata
    """
    async with db_mcp.get_session() as session:
        # Query database for user's audio files
        pass
```

### Database MCP (`packages/db/mcp/server.py`)

```python
from mcp.server.fastmcp import FastMCP
from drizzle.orm import select

mcp = FastMCP("VOZAZI Database")

@mcp.tool()
async def get_user_usage(user_id: str) -> dict:
    """Get usage statistics for a user."""
    pass

@mcp.tool()
async def get_subscription_status(user_id: str) -> str:
    """Get the subscription status for a user."""
    pass
```

---

## 🔐 Seguridad MCP

### Authentication

```python
# Middleware de autenticación para MCP
from fastapi import Request, HTTPException
from jose import jwt

async def verify_mcp_auth(request: Request):
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization")
    
    token = auth_header.split(" ")[1]
    
    try:
        payload = jwt.decode(token, settings.MCP_API_KEY, algorithms=["HS256"])
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Rate Limiting

```python
# Rate limiting para MCP endpoints
from app.mcp.redis_client import redis_mcp

async def mcp_rate_limit(identifier: str) -> bool:
    allowed, remaining = await redis_mcp.rate_limit(
        identifier,
        max_requests=60,
        window_seconds=60
    )
    return allowed
```

---

## 🧪 Testing MCP

### Test MCP Tools

```python
# tests/test_mcp.py
import pytest
from app.mcp.server import mcp

@pytest.mark.asyncio
async def test_transcribe_audio_tool():
    result = await mcp.call_tool(
        "transcribe_audio",
        arguments={"audio_file_id": "test-123", "language": "es"}
    )
    assert result is not None

@pytest.mark.asyncio
async def test_analyze_sentiment_tool():
    result = await mcp.call_tool(
        "analyze_sentiment",
        arguments={"audio_file_id": "test-123"}
    )
    assert "sentiment" in result
```

---

## 📊 MCP Health Endpoints

### Verificar Estado de MCPs

```bash
# Audio Engine MCP Health
curl https://audio.vozazi.com/mcp/health

# Individual MCP Health
curl https://audio.vozazi.com/mcp/health/database
curl https://audio.vozazi.com/mcp/health/redis
curl https://audio.vozazi.com/mcp/health/storage
curl https://audio.vozazi.com/mcp/health/openai
curl https://audio.vozazi.com/mcp/health/anthropic

# Web App MCP Health
curl https://vozazi.com/api/health
curl https://vozazi.com/api/health/variables
```

---

## 🎯 Ejemplos de Uso con AI Agents

### Cursor / Copilot Chat

```
# Transcribir audio
@vozazi Transcribe el audio con ID 'abc123' al español

# Analizar sentimiento
@vozazi ¿Cuál es el sentimiento predominante en la reunión grabada?

# Buscar audios
@vozazi Lista todos mis audios procesados esta semana

# GitHub Integration
@github Crea un issue para el bug de transcripción encontrado
@github Revisa los últimos PRs del repositorio vozazi
```

---

## 📁 Archivos de Configuración

### `.vscode/mcp.json` (Workspace)

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${input:github_mcp_pat}"
      }
    },
    "vozazi": {
      "type": "http",
      "url": "http://localhost:8000/mcp",
      "headers": {
        "Authorization": "Bearer ${input:vozazi_mcp_key}"
      }
    }
  },
  "inputs": [
    {
      "type": "promptString",
      "id": "github_mcp_pat",
      "description": "GitHub Personal Access Token",
      "password": true
    },
    {
      "type": "promptString",
      "id": "vozazi_mcp_key",
      "description": "VOZAZI MCP API Key",
      "password": true
    }
  ]
}
```

### `.env.local` (Desarrollo)

```env
# MCP Configuration
MCP_SERVER_ENABLED=true
MCP_API_KEY=vozazi_dev_key_123456

# GitHub MCP
GITHUB_MCP_ENABLED=true
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...

# Vercel MCP
VERCEL_MCP_ENABLED=true
VERCEL_PROJECT_ID=vozazi-audio-engine
```

---

## 🔗 Recursos

- [GitHub MCP Server](https://github.com/github/github-mcp-server)
- [Vercel MCP Documentation](https://vercel.com/docs/mcp)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Vercel AI SDK](https://sdk.vercel.ai)

---

*Documento actualizado: 2026-03-18*
*VOZAZI - Integración MCP*
