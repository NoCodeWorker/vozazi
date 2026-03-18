---
name: rag-system
description: RAG (Retrieval-Augmented Generation) para pedagogía vocal en VOZAZI. Use cuando implemente búsqueda de documentación, retrieval semántico, o grounding para LLM.
---

# RAG System Skill

Esta skill proporciona experiencia en sistemas RAG para recuperar documentación pedagógica relevante y generar feedback contextualizado en VOZAZI.

## Objetivo

Implementar sistema de retrieval híbrido (estructurado + semántico) para conectar errores vocales detectados con documentación pedagógica relevante y generar feedback preciso con LLM.

## Instrucciones

### 1. Estructura de Documentación

```markdown
# docs/techniques/sustain_control.md
---
title: Control de Nota Sostenida
category: techniques
subcategory: pitch
related_techniques:
  - breath_support
  - pitch_stability
related_errors:
  - unstable_pitch
  - pitch_drift
difficulty_level: beginner
risk_level: low
---

## Definición

El control de nota sostenida es la capacidad de mantener una frecuencia estable durante la ejecución de una nota.

## Causas Comunes de Problemas

1. **Apoyo respiratorio débil**: Sin flujo de aire consistente
2. **Tensión laríngea**: Músculos de la garganta tensos
3. **Falta de control del diafragma**: Respiración poco profunda

## Síntomas

- La nota tiembla o varía en frecuencia
- La nota se desvía hacia abajo al final
- Incomodidad o tensión en la garganta

## Ejercicios Correctivos

### Ejercicio 1: Sostén con medidor
- Cantar una nota cómoda por 5 segundos
- Usar feedback visual para monitorear estabilidad
- Repetir 5 veces

### Ejercicio 2: Sostén con respiración
- Inhalar profundamente usando diafragma
- Cantar nota mientras se mantiene flujo de aire constante
- Duración: 8 segundos

## Señales de Mejora

- Menos variación en el pitch
- Mayor duración sin fatiga
- Sensación de control en lugar de tensión

## Señales de Alarma

- Dolor o molestia persistente
- Fatiga vocal después de pocos minutos
- Pérdida progresiva de rango
```

### 2. Parser de Documentación

```python
# apps/audio-engine/domain/knowledge/doc_parser.py
import yaml
import re
from pathlib import Path
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, asdict
from datetime import datetime

@dataclass
class KnowledgeDocument:
    """Documento de conocimiento estructurado"""
    slug: str
    title: str
    category: str
    subcategory: str
    content: str
    related_techniques: List[str]
    related_errors: List[str]
    difficulty_level: str
    risk_level: str
    chunks: List['KnowledgeChunk']
    created_at: datetime
    updated_at: datetime

@dataclass
class KnowledgeChunk:
    """Chunk de documento para retrieval"""
    id: str
    document_slug: str
    chunk_type: str  # definition, causes, symptoms, exercises, warnings
    content: str
    metadata: Dict[str, Any]
    embedding_ref: Optional[str] = None

class KnowledgeDocumentParser:
    """Parser para documentos Markdown con frontmatter"""
    
    CHUNK_TYPES = {
        'definición': ['definición', 'qué es', 'descripcion'],
        'causas': ['causas', 'por qué ocurre', 'origen'],
        'síntomas': ['síntomas', 'señales', 'indicadores'],
        'ejercicios': ['ejercicios', 'práctica', 'corrección'],
        'advertencias': ['señales de alarma', 'riesgos', 'cuándo parar'],
    }
    
    def parse_file(self, file_path: Path) -> KnowledgeDocument:
        """Parsear archivo Markdown"""
        content = file_path.read_text(encoding='utf-8')
        
        # Extraer frontmatter
        frontmatter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
        
        if not frontmatter_match:
            raise ValueError(f"No frontmatter found in {file_path}")
        
        frontmatter = yaml.safe_load(frontmatter_match.group(1))
        body = content[frontmatter_match.end():]
        
        # Crear documento
        doc = KnowledgeDocument(
            slug=file_path.stem,
            title=frontmatter.get('title', file_path.stem),
            category=frontmatter.get('category', 'general'),
            subcategory=frontmatter.get('subcategory', ''),
            content=body.strip(),
            related_techniques=frontmatter.get('related_techniques', []),
            related_errors=frontmatter.get('related_errors', []),
            difficulty_level=frontmatter.get('difficulty_level', 'intermediate'),
            risk_level=frontmatter.get('risk_level', 'low'),
            chunks=[],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        
        # Crear chunks
        doc.chunks = self._create_chunks(doc)
        
        return doc
    
    def _create_chunks(self, doc: KnowledgeDocument) -> List[KnowledgeChunk]:
        """Dividir documento en chunks pedagógicos"""
        chunks = []
        content = doc.content
        
        # Identificar secciones
        sections = self._split_into_sections(content)
        
        for section_title, section_content in sections:
            chunk_type = self._identify_chunk_type(section_title)
            
            if chunk_type:
                chunk = KnowledgeChunk(
                    id=f"{doc.slug}_{chunk_type}",
                    document_slug=doc.slug,
                    chunk_type=chunk_type,
                    content=f"{section_title}\n\n{section_content}".strip(),
                    metadata={
                        'section_title': section_title,
                        'word_count': len(section_content.split()),
                        'category': doc.category,
                        'difficulty': doc.difficulty_level,
                    },
                )
                chunks.append(chunk)
        
        # Si no se encontraron secciones, crear chunk único
        if not chunks:
            chunks.append(KnowledgeChunk(
                id=f"{doc.slug}_full",
                document_slug=doc.slug,
                chunk_type='full',
                content=content,
                metadata={
                    'category': doc.category,
                    'difficulty': doc.difficulty_level,
                },
            ))
        
        return chunks
    
    def _split_into_sections(self, content: str) -> List[tuple]:
        """Dividir contenido en secciones por headers"""
        sections = []
        current_title = ""
        current_content = []
        
        for line in content.split('\n'):
            if line.startswith('## '):
                # Guardar sección anterior
                if current_title and current_content:
                    sections.append((current_title, '\n'.join(current_content)))
                
                # Nueva sección
                current_title = line[3:].strip()
                current_content = []
            elif current_title:
                current_content.append(line)
        
        # Guardar última sección
        if current_title and current_content:
            sections.append((current_title, '\n'.join(current_content)))
        
        return sections
    
    def _identify_chunk_type(self, section_title: str) -> Optional[str]:
        """Identificar tipo de chunk desde título de sección"""
        title_lower = section_title.lower()
        
        for chunk_type, keywords in self.CHUNK_TYPES.items():
            if any(keyword in title_lower for keyword in keywords):
                return chunk_type
        
        return None
    
    def parse_directory(self, dir_path: Path) -> List[KnowledgeDocument]:
        """Parsear todos los documentos en un directorio"""
        documents = []
        
        for md_file in dir_path.rglob('*.md'):
            try:
                doc = self.parse_file(md_file)
                documents.append(doc)
            except Exception as e:
                print(f"Error parsing {md_file}: {e}")
        
        return documents
```

### 3. Sistema de Embeddings

```python
# apps/audio-engine/domain/knowledge/embedding_service.py
import numpy as np
from typing import List, Optional, Dict, Any
from sentence_transformers import SentenceTransformer
import asyncio

class EmbeddingService:
    """Servicio para generar y gestionar embeddings"""
    
    def __init__(
        self,
        model_name: str = 'all-MiniLM-L6-v2',
        device: str = 'cpu',
        cache_dir: Optional[str] = None,
    ):
        self.model_name = model_name
        self.device = device
        self.model = None
        self.cache_dir = cache_dir
    
    def load_model(self):
        """Cargar modelo de embeddings"""
        if self.model is None:
            self.model = SentenceTransformer(
                self.model_name,
                device=self.device,
                cache_folder=self.cache_dir,
            )
    
    async def generate_embedding(self, text: str) -> np.ndarray:
        """Generar embedding para texto"""
        if self.model is None:
            await asyncio.get_event_loop().run_in_executor(
                None,
                self.load_model,
            )
        
        loop = asyncio.get_event_loop()
        embedding = await loop.run_in_executor(
            None,
            lambda: self.model.encode(text, convert_to_numpy=True),
        )
        
        return embedding
    
    async def generate_embeddings_batch(
        self,
        texts: List[str],
        batch_size: int = 32,
    ) -> np.ndarray:
        """Generar embeddings en batch"""
        if self.model is None:
            await asyncio.get_event_loop().run_in_executor(
                None,
                self.load_model,
            )
        
        loop = asyncio.get_event_loop()
        embeddings = await loop.run_in_executor(
            None,
            lambda: self.model.encode(
                texts,
                batch_size=batch_size,
                convert_to_numpy=True,
                show_progress_bar=True,
            ),
        )
        
        return embeddings
    
    def normalize_embeddings(self, embeddings: np.ndarray) -> np.ndarray:
        """Normalizar embeddings para similitud coseno"""
        norm = np.linalg.norm(embeddings, axis=1, keepdims=True)
        return embeddings / norm
    
    def cosine_similarity(
        self,
        embedding1: np.ndarray,
        embedding2: np.ndarray,
    ) -> float:
        """Calcular similitud coseno entre dos embeddings"""
        # Asegurar que son 2D
        if embedding1.ndim == 1:
            embedding1 = embedding1.reshape(1, -1)
        if embedding2.ndim == 1:
            embedding2 = embedding2.reshape(1, -1)
        
        # Normalizar
        emb1_norm = self.normalize_embeddings(embedding1)
        emb2_norm = self.normalize_embeddings(embedding2)
        
        # Calcular similitud
        similarity = np.dot(emb1_norm, emb2_norm.T)
        
        return float(similarity[0][0])
```

### 4. Base de Datos Vectorial (pgvector)

```python
# apps/audio-engine/infrastructure/vector_store.py
import asyncpg
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from .knowledge.embedding_service import EmbeddingService
from .knowledge.doc_parser import KnowledgeChunk

class VectorStore:
    """Almacenamiento vectorial con pgvector"""
    
    def __init__(
        self,
        database_url: str,
        embedding_service: EmbeddingService,
        table_name: str = 'knowledge_chunks',
    ):
        self.database_url = database_url
        self.embedding_service = embedding_service
        self.table_name = table_name
        self.pool: Optional[asyncpg.Pool] = None
    
    async def initialize(self):
        """Inicializar pool de conexiones y tabla"""
        self.pool = await asyncpg.create_pool(self.database_url)
        
        async with self.pool.acquire() as conn:
            # Habilitar pgvector
            await conn.execute('CREATE EXTENSION IF NOT EXISTS vector')
            
            # Crear tabla si no existe
            await conn.execute(f'''
                CREATE TABLE IF NOT EXISTS {self.table_name} (
                    id TEXT PRIMARY KEY,
                    document_slug TEXT NOT NULL,
                    chunk_type TEXT NOT NULL,
                    content TEXT NOT NULL,
                    metadata JSONB,
                    embedding vector(384),
                    created_at TIMESTAMP DEFAULT NOW()
                )
            ''')
            
            # Crear índice para búsqueda rápida
            await conn.execute(f'''
                CREATE INDEX IF NOT EXISTS idx_{self.table_name}_embedding
                ON {self.table_name}
                USING ivfflat (embedding vector_cosine_ops)
                WITH (lists = 100)
            ''')
    
    async def insert_chunk(self, chunk: KnowledgeChunk, embedding: np.ndarray):
        """Insertar chunk con embedding"""
        async with self.pool.acquire() as conn:
            await conn.execute(f'''
                INSERT INTO {self.table_name}
                (id, document_slug, chunk_type, content, metadata, embedding)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (id) DO UPDATE SET
                    content = EXCLUDED.content,
                    metadata = EXCLUDED.metadata,
                    embedding = EXCLUDED.embedding
            ''',
                chunk.id,
                chunk.document_slug,
                chunk.chunk_type,
                chunk.content,
                json.dumps(chunk.metadata),
                embedding.tolist(),
            )
    
    async def insert_chunks_batch(
        self,
        chunks: List[KnowledgeChunk],
        embeddings: np.ndarray,
    ):
        """Insertar múltiples chunks en batch"""
        async with self.pool.acquire() as conn:
            async with conn.transaction():
                for chunk, embedding in zip(chunks, embeddings):
                    await conn.execute(f'''
                        INSERT INTO {self.table_name}
                        (id, document_slug, chunk_type, content, metadata, embedding)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        ON CONFLICT (id) DO NOTHING
                    ''',
                        chunk.id,
                        chunk.document_slug,
                        chunk.chunk_type,
                        chunk.content,
                        json.dumps(chunk.metadata),
                        embedding.tolist(),
                    )
    
    async def search_similar(
        self,
        query_embedding: np.ndarray,
        limit: int = 5,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Buscar chunks similares
        
        Args:
            query_embedding: Embedding de la consulta
            limit: Número de resultados
            filters: Filtros adicionales (category, difficulty, etc.)
        """
        async with self.pool.acquire() as conn:
            # Construir query con filtros
            where_clauses = []
            params = [query_embedding.tolist(), limit]
            param_count = 2
            
            if filters:
                for key, value in filters.items():
                    param_count += 1
                    where_clauses.append(f"metadata->>'{key}' = ${param_count}")
                    params.append(value)
            
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
                    1 - (embedding <=> $1::vector) AS similarity
                FROM {self.table_name}
                {where_sql}
                ORDER BY embedding <=> $1::vector
                LIMIT $2
            '''
            
            rows = await conn.fetch(query, *params)
            
            return [
                {
                    'id': row['id'],
                    'document_slug': row['document_slug'],
                    'chunk_type': row['chunk_type'],
                    'content': row['content'],
                    'metadata': dict(row['metadata']),
                    'similarity': row['similarity'],
                }
                for row in rows
            ]
    
    async def hybrid_search(
        self,
        query_text: str,
        query_embedding: np.ndarray,
        limit: int = 5,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Búsqueda híbrida: semántica + full-text
        
        Combina resultados de búsqueda vectorial con full-text search
        """
        # 1. Búsqueda semántica
        semantic_results = await self.search_similar(
            query_embedding,
            limit=limit * 2,
            filters=filters,
        )
        
        # 2. Búsqueda full-text (implementar si es necesario)
        # Por ahora, solo usamos la semántica
        
        # 3. Re-rank por similitud
        ranked_results = sorted(
            semantic_results,
            key=lambda x: x['similarity'],
            reverse=True,
        )[:limit]
        
        return ranked_results
    
    async def close(self):
        """Cerrar pool de conexiones"""
        if self.pool:
            await self.pool.close()
```

### 5. Retrieval Service

```python
# apps/audio-engine/services/retrieval_service.py
from typing import List, Dict, Any, Optional
import numpy as np
from ..domain.knowledge.embedding_service import EmbeddingService
from ..infrastructure.vector_store import VectorStore

class RetrievalService:
    """Servicio para retrieval de documentación pedagógica"""
    
    def __init__(
        self,
        embedding_service: EmbeddingService,
        vector_store: VectorStore,
    ):
        self.embedding_service = embedding_service
        self.vector_store = vector_store
    
    async def retrieve_for_error(
        self,
        error_type: str,
        user_level: str = 'beginner',
        limit: int = 3,
    ) -> List[Dict[str, Any]]:
        """
        Recuperar documentación relevante para un error
        
        Args:
            error_type: Tipo de error (ej: 'unstable_pitch')
            user_level: Nivel del usuario
            limit: Número de resultados
        """
        # 1. Crear query de búsqueda
        query_text = self._build_error_query(error_type, user_level)
        
        # 2. Generar embedding
        query_embedding = await self.embedding_service.generate_embedding(query_text)
        
        # 3. Buscar con filtros
        filters = {
            'difficulty': user_level,
        }
        
        results = await self.vector_store.hybrid_search(
            query_text=query_text,
            query_embedding=query_embedding,
            limit=limit,
            filters=filters,
        )
        
        # 4. Si no hay suficientes resultados, relajar filtros
        if len(results) < limit:
            relaxed_results = await self.vector_store.hybrid_search(
                query_text=query_text,
                query_embedding=query_embedding,
                limit=limit - len(results),
                filters={},  # Sin filtros
            )
            results.extend(relaxed_results)
        
        return results
    
    async def retrieve_for_exercise(
        self,
        exercise_type: str,
        technique: str,
        limit: int = 2,
    ) -> List[Dict[str, Any]]:
        """Recuperar documentación para un ejercicio"""
        
        query_text = f"ejercicio {exercise_type} para técnica {technique}"
        query_embedding = await self.embedding_service.generate_embedding(query_text)
        
        results = await self.vector_store.hybrid_search(
            query_text=query_text,
            query_embedding=query_embedding,
            limit=limit,
        )
        
        return results
    
    def _build_error_query(self, error_type: str, user_level: str) -> str:
        """Construir query de búsqueda para error"""
        
        error_descriptions = {
            'unstable_pitch': 'nota inestable que tiembla o varía en frecuencia',
            'flat_entry': 'nota que comienza más baja de lo debido',
            'sharp_entry': 'nota que comienza más alta de lo debido',
            'pitch_drift': 'nota que se desafina progresivamente',
            'breath_leak': 'fuga de aire que debilita el sonido',
            'throat_tension': 'tensión en la garganta al cantar',
            'nasal_resonance': 'resonancia nasal excesiva',
        }
        
        description = error_descriptions.get(error_type, error_type)
        
        return f"problema vocal: {description} nivel {user_level}"
```

### 6. Pedagogical Context Builder

```python
# apps/audio-engine/services/pedagogical_context.py
from typing import Dict, Any, List, Optional
from dataclasses import dataclass

@dataclass
class PedagogicalContext:
    """Contexto completo para generar feedback pedagógico"""
    
    # Datos del usuario
    user_id: str
    user_level: str
    user_history: Dict[str, Any]
    
    # Datos de la sesión
    session_id: str
    exercise_type: str
    target_note: Optional[str]
    
    # Métricas
    metrics: Dict[str, float]
    score: int
    
    # Evaluación
    dominant_weakness: str
    secondary_weakness: Optional[str]
    
    # Documentación relevante
    relevant_docs: List[Dict[str, Any]]
    
    # Historial reciente
    recent_errors: List[str]
    improvement_areas: List[str]
    
    def to_llm_prompt(self) -> str:
        """Convertir contexto a prompt para LLM"""
        
        prompt = f"""
# Contexto del Usuario
- Nivel: {self.user_level}
- Sesiones anteriores: {self.user_history.get('total_sessions', 0)}
- Puntuación promedio: {self.user_history.get('avg_score', 0)}

# Sesión Actual
- Ejercicio: {self.exercise_type}
- Nota objetivo: {self.target_note or 'N/A'}
- Puntuación: {self.score}/100

# Métricas Principales
"""
        
        for metric, value in self.metrics.items():
            if isinstance(value, float):
                prompt += f"- {metric}: {value:.2f}\n"
        
        prompt += f"""
# Áreas a Mejorar
- Principal: {self.dominant_weakness}
"""
        
        if self.secondary_weakness:
            prompt += f"- Secundaria: {self.secondary_weakness}\n"
        
        prompt += f"""
# Documentación Relevante
"""
        
        for i, doc in enumerate(self.relevant_docs[:3], 1):
            prompt += f"""
## Recurso {i}
Tipo: {doc.get('chunk_type', 'general')}
Contenido: {doc.get('content', '')[:200]}...
"""
        
        prompt += """
# Instrucciones para el Feedback

Genera un feedback pedagógico que:
1. Explique el error principal en lenguaje simple
2. Proporcione 1-2 ejercicios concretos para mejorar
3. Sea alentador pero honesto
4. Enlace a documentación relevante
5. Sugiera el siguiente paso

El feedback debe ser apropiado para el nivel del usuario.
"""
        
        return prompt
```

## Restricciones

- NO usar embeddings sin normalizar para similitud coseno
- NO olvidar manejar documentos sin frontmatter
- NO hacer búsqueda semántica sin filtros de nivel
- NO generar embeddings en el request principal (usar background)
- Siempre validar que los chunks tengan contenido útil
- Siempre incluir metadata de dificultad en los resultados
- Siempre tener fallback si no hay documentos relevantes

## Ejemplos

### Bueno: Flujo Completo de RAG
```python
# apps/audio-engine/pipelines/pedagogical_feedback.py
class PedagogicalFeedbackPipeline:
    """Pipeline para generar feedback pedagógico con RAG"""
    
    def __init__(
        self,
        retrieval_service: RetrievalService,
        llm_service: LLMService,
    ):
        self.retrieval = retrieval_service
        self.llm = llm_service
    
    async def generate_feedback(
        self,
        session_data: Dict[str, Any],
        evaluation: Dict[str, Any],
        user_profile: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Generar feedback completo"""
        
        # 1. Recuperar documentación relevante
        relevant_docs = await self.retrieval.retrieve_for_error(
            error_type=evaluation['dominant_weakness'],
            user_level=user_profile['level'],
            limit=3,
        )
        
        # 2. Construir contexto pedagógico
        context = PedagogicalContext(
            user_id=user_profile['id'],
            user_level=user_profile['level'],
            user_history=user_profile.get('history', {}),
            session_id=session_data['id'],
            exercise_type=session_data['exercise_type'],
            target_note=session_data.get('target_note'),
            metrics=evaluation['metrics'],
            score=evaluation['score'],
            dominant_weakness=evaluation['dominant_weakness'],
            secondary_weakness=evaluation.get('secondary_weakness'),
            relevant_docs=relevant_docs,
            recent_errors=user_profile.get('recent_errors', []),
            improvement_areas=user_profile.get('improvements', []),
        )
        
        # 3. Generar feedback con LLM
        feedback = await self.llm.generate_feedback(
            prompt=context.to_llm_prompt(),
            temperature=0.7,
            max_tokens=500,
        )
        
        # 4. Estructurar respuesta
        return {
            'session_id': session_data['id'],
            'feedback_summary': self._extract_summary(feedback),
            'feedback_explanation': feedback,
            'recommended_exercises': self._extract_exercises(feedback, relevant_docs),
            'linked_docs': [
                {
                    'slug': doc['document_slug'],
                    'title': doc.get('metadata', {}).get('title', ''),
                    'relevance': doc['similarity'],
                }
                for doc in relevant_docs
            ],
        }
```
