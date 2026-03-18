const eslint = require('@eslint/js')
const tseslint = require('@typescript-eslint/eslint-plugin')
const tseslintParser = require('@typescript-eslint/parser')

module.exports = [
  eslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...tseslint.configs.recommended.rules
    }
  }
]
