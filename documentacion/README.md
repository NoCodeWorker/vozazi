# 📚 Documentación de VOZAZI

> Índice centralizado de toda la documentación técnica del proyecto VOZAZI.

---

## 📋 Clasificación de Documentos

### 1. Arquitectura y Contexto

| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [`vozazi_arquitectura_tecnica_completa.md`](../vozazi_arquitectura_tecnica_completa.md) | Documento maestro de arquitectura técnica (5817 líneas) | ✅ Completo |
| [`documento_contexto.md`](./documento_contexto.md) | Contexto del proyecto, visión, problema y solución | ✅ Completo |

---

### 2. Implementación y Desarrollo

| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [`documento_implementacion.md`](./documento_implementacion.md) | Guía técnica completa de implementación | ✅ Completo |
| [`DEPENDENCIAS.md`](./DEPENDENCIAS.md) | Lista completa de dependencias del proyecto | ✅ Completo |
| [`documento_skills.md`](./documento_skills.md) | Skills necesarios para el desarrollo (23/23) | ✅ 100% |
| [`documento_tareas_checklist.md`](./documento_tareas_checklist.md) | Checklist de tareas por fases y sprints | ✅ Completo |
| [`documento_buenas_practicas.md`](./documento_buenas_practicas.md) | Estándares y buenas prácticas de desarrollo | ✅ Completo |

---

### 3. Guías Técnicas

| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [`I18N_GUIDE.md`](../I18N_GUIDE.md) | Guía de internacionalización (6 idiomas) | ✅ Completa |
| [`TESTING_GUIDE.md`](../TESTING_GUIDE.md) | Guía de testing (Vitest, Playwright, pytest) | ✅ Completa |
| [`MCP_INTEGRATION.md`](../MCP_INTEGRATION.md) | Integración con Model Context Protocol | ✅ Completa |

---

### 4. Despliegue y Operaciones

| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [`VERCEL_ENVIRONMENT_VARIABLES.md`](./VERCEL_ENVIRONMENT_VARIABLES.md) | Variables de entorno para Vercel | ✅ Completo |
| [`AUDITORIA_REPOSITORIO.md`](./AUDITORIA_REPOSITORIO.md) | Auditoría técnica completa del repositorio | ✅ Completa |

---

## 📂 Estructura de la Documentación

```
documentacion/
├── README.md                          # Este archivo (índice)
├── documento_contexto.md              # Contexto del proyecto
├── documento_implementacion.md        # Guía de implementación
├── documento_tareas_checklist.md      # Checklist de tareas
├── documento_skills.md                # Skills de desarrollo
├── documento_buenas_practicas.md      # Buenas prácticas
├── DEPENDENCIAS.md                    # Dependencias del proyecto
├── VERCEL_ENVIRONMENT_VARIABLES.md    # Variables para Vercel
└── AUDITORIA_REPOSITORIO.md           # Auditoría técnica
```

**Archivos en la raíz del proyecto:**

```
raíz/
├── README.md                          # README principal (quick start)
├── vozazi_arquitectura_tecnica_completa.md  # Arquitectura completa (5817 líneas)
├── I18N_GUIDE.md                      # Guía de i18n
├── TESTING_GUIDE.md                   # Guía de testing
└── MCP_INTEGRATION.md                 # Integración MCP
```

---

## 🚀 Inicio Rápido

### Para Nuevos Desarrolladores

1. **Leer primero:**
   - [`documento_contexto.md`](./documento_contexto.md) - Entender el proyecto
   - [`documento_skills.md`](./documento_skills.md) - Verificar skills necesarios

2. **Configurar entorno:**
   - [`DEPENDENCIAS.md`](./DEPENDENCIAS.md) - Instalar dependencias
   - [`VERCEL_ENVIRONMENT_VARIABLES.md`](./VERCEL_ENVIRONMENT_VARIABLES.md) - Configurar variables

3. **Comenzar a desarrollar:**
   - [`documento_tareas_checklist.md`](./documento_tareas_checklist.md) - Ver tareas pendientes
   - [`documento_buenas_practicas.md`](./documento_buenas_practicas.md) - Seguir estándares

### Para Despliegue

1. **Preparar despliegue:**
   - [`documento_implementacion.md`](./documento_implementacion.md) - Revisar arquitectura
   - [`VERCEL_ENVIRONMENT_VARIABLES.md`](./VERCEL_ENVIRONMENT_VARIABLES.md) - Configurar Vercel

2. **Verificar:**
   - [`AUDITORIA_REPOSITORIO.md`](./AUDITORIA_REPOSITORIO.md) - Revisar hallazgos de auditoría
   - [`TESTING_GUIDE.md`](../TESTING_GUIDE.md) - Ejecutar tests

---

## 🔗 Recursos Adicionales

### Antigravity Skills

Todos los skills están disponibles en:

```
.agent/skills/
├── frontend/         (7 skills)
├── backend/          (1 skill)
├── audio-engine/     (5 skills)
├── pedagogy/         (3 skills)
├── services/         (5 skills)
├── architecture/     (2 skills)
├── devops/           (4 skills)
├── testing/          (3 skills)
└── security/         (2 skills)
```

**Total:** 23 skills completados ✅

### Archivos de Configuración

```
raíz/
├── .env.example                 # Template de variables de entorno
├── .gitignore                   # Archivos ignorados por Git
├── package.json                 # Dependencias del monorepo
├── turbo.json                   # Configuración de Turbo
├── tsconfig.json                # Configuración de TypeScript
├── docker-compose.yml           # Servicios locales (PostgreSQL, Redis)
├── eslint.config.js             # Configuración de ESLint
├── .prettierrc                  # Configuración de Prettier
└── commitlint.config.js         # Configuración de Commitlint
```

---

## 📝 Convenciones de Documentación

### Nomenclatura de Archivos

- ✅ `documento_nombre.md` - minúsculas con guiones bajos
- ✅ `README.md` - mayúsculas para README
- ✅ `NOMBRE_GUIDE.md` - mayúsculas para guías técnicas
- ❌ `DocumentoNombre.md` - No usar CamelCase
- ❌ `documento nombre.md` - No usar espacios

### Estructura de Documentos

Cada documento debe incluir:

1. **Título claro** - Descripción del propósito
2. **Tabla de contenidos** - Para documentos largos
3. **Secciones numeradas** - Fácil referencia
4. **Ejemplos de código** - Cuando aplique
5. **Fecha de actualización** - Mantener actualizado

---

## 🔄 Actualización de Documentación

### Cuándo Actualizar

- ✅ Al añadir nuevas dependencias
- ✅ Al cambiar variables de entorno
- ✅ Al modificar arquitectura
- ✅ Al completar nuevas tareas
- ✅ Al descubrir mejores prácticas

### Cómo Actualizar

1. Editar el documento correspondiente
2. Actualizar fecha de última actualización
3. Commit con mensaje descriptivo
4. Notificar al equipo si hay cambios importantes

---

## 📊 Estado de la Documentación

| Categoría | Documentos | Estado |
|-----------|------------|--------|
| Arquitectura | 2 | ✅ Completos |
| Implementación | 5 | ✅ Completos |
| Guías Técnicas | 3 | ✅ Completas |
| Despliegue | 2 | ✅ Completos |
| **TOTAL** | **12** | **✅ 100%** |

---

## 📞 Contacto y Soporte

Para preguntas sobre la documentación:

- **Revisar primero:** El índice y las secciones relevantes
- **Issues:** Crear issue en el repositorio si hay errores
- **Actualizaciones:** PR con las correcciones necesarias

---

*Última actualización: 2026-03-18*  
*VOZAZI - Documentación Técnica Completa*
