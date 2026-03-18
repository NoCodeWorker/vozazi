import { defineConfig } from 'i18next-cli';

export default defineConfig({
  // Idiomas soportados
  locales: ['es', 'en', 'pt', 'fr', 'de', 'it'],
  
  // Idioma principal (por defecto)
  primaryLanguage: 'es',
  
  // Configuración de extracción
  extract: {
    // Archivos a escanear
    input: [
      'src/**/*.{ts,tsx}',
      'src/**/*.{js,jsx}'
    ],
    
    // Archivos a excluir
    exclude: [
      'src/**/*.test.{ts,tsx}',
      'src/**/*.spec.{ts,tsx}',
      'src/test/**',
      'src/test-utils/**',
      'node_modules',
      'dist',
      '.next'
    ],
    
    // Patrón de salida para archivos de traducción
    output: 'public/locales/{{language}}/{{namespace}}.json',
    
    // Funciones de traducción a detectar
    functions: [
      't',
      '*.t',
      'i18next.t',
      'useTranslation'
    ],
    
    // Componentes Trans a detectar
    transComponents: [
      'Trans',
      'Translation'
    ],
    
    // Namespace por defecto
    defaultNS: 'translation',
    
    // Separador de claves
    keySeparator: '.',
    
    // Separador de namespace
    nsSeparator: ':',
    
    // Formato de salida
    outputFormat: 'json',
    
    // Eliminar claves no usadas
    removeUnusedKeys: true,
    
    // Ordenar claves alfabéticamente
    sort: true,
    
    // Indentación
    indentation: 2,
    
    // Patrones para claves dinámicas
    preservePatterns: [
      // Ejemplo: t(`status.${status}`)
      'status\\..*',
      // Ejemplo: t(`role.${role}`)
      'role\\..*'
    ],
    
    // Contextos soportados
    contexts: [
      'male',
      'female',
      'neutral',
      'plural'
    ],
    
    // Valores por defecto
    defaultValue: function(key, namespace) {
      // Usar la clave como valor por defecto en español
      return key;
    }
  },
  
  // Configuración de tipos TypeScript
  types: {
    // Archivos de entrada para generar tipos
    input: ['public/locales/es/*.json'],
    
    // Archivo de salida para definiciones de tipos
    output: 'src/types/i18next.d.ts',
    
    // Habilitar selector de namespace
    enableSelector: true,
    
    // Prefijo para tipos
    prefix: 'VOZAZI',
    
    // Generar tipos para recursos
    resources: true
  },
  
  // Configuración de linting
  lint: {
    // Patrones a verificar
    patterns: [
      'src/**/*.{ts,tsx}'
    ],
    
    // Excluir del linting
    exclude: [
      'node_modules',
      'dist',
      '.next'
    ],
    
    // Reglas
    rules: {
      // Detectar strings hardcoded
      hardcodedStrings: true,
      
      // Requiere namespace explícito
      requireNamespace: false,
      
      // Claves vacías
      emptyKeys: true,
      
      // Claves duplicadas
      duplicateKeys: true
    }
  },
  
  // Configuración de sincronización
  sync: {
    // Sincronizar idioma principal con secundarios
    syncPrimary: true,
    
    // Rellenar claves faltantes con idioma principal
    fillFromPrimary: true,
    
    // Eliminar claves huérfanas
    removeOrphaned: true
  },
  
  // Plugins (opcional)
  plugins: []
});
