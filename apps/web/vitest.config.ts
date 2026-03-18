import { defineConfig } from 'vitest/config'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['src/**/*.e2e.test.ts', 'src/**/*.e2e.test.tsx', 'node_modules'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/test/**',
        'src/test-utils/**',
        'src/**/*.stories.{ts,tsx}',
        'src/middleware.ts',
        'src/app/layout.tsx'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },
    pool: 'forks',
    poolOptions: {
      forks: {
        maxForks: 4,
        minForks: 1
      }
    },
    server: {
      deps: {
        inline: ['@vozazi/ui']
      }
    },
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
    unstubGlobals: true,
    unstubEnvs: true,
    includeSource: ['src/**/*.{ts,tsx}'],
    deps: {
      optimizer: {
        web: {
          include: ['vitest-canvas-mock']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@vozazi/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@vozazi/db': path.resolve(__dirname, '../../packages/db/src'),
      '@vozazi/shared-types': path.resolve(__dirname, '../../packages/shared-types/src')
    }
  }
})
