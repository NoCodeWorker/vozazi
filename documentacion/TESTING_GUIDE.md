# VOZAZI — Testing & Code Quality Guide

> Comprehensive guide for testing, linting, and maintaining code quality in VOZAZI.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Frontend Testing](#frontend-testing)
3. [Backend Testing](#backend-testing)
4. [E2E Testing](#e2e-testing)
5. [Code Quality](#code-quality)
6. [Security](#security)
7. [Pre-commit Hooks](#pre-commit-hooks)
8. [CI/CD Integration](#cicd-integration)

---

## 🎯 Overview

### Testing Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Unit Tests** | Vitest (Frontend), pytest (Backend) | Test individual functions/components |
| **Integration Tests** | Testing Library, httpx | Test component/API interactions |
| **E2E Tests** | Playwright | Test full user flows |
| **Visual Tests** | Playwright Screenshots | Visual regression testing |

### Code Quality Stack

| Tool | Language | Purpose |
|------|---------|---------|
| **ESLint** | TypeScript/JavaScript | Linting |
| **Prettier** | TypeScript/JavaScript | Formatting |
| **TypeScript** | TypeScript | Type checking |
| **Ruff** | Python | Linting |
| **Black** | Python | Formatting |
| **mypy** | Python | Type checking |

---

## 🧪 Frontend Testing

### Running Tests

```bash
# All tests
npm run test

# Unit tests only
npm run test:unit

# Tests with coverage
npm run test:coverage

# Interactive UI
npm run test:ui

# Type checking
npm run typecheck
```

### Writing Unit Tests

```typescript
// src/components/__tests__/button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@vozazi/ui'

describe('Button', () => {
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Writing API Tests

```typescript
// src/app/api/health/__tests__/route.test.ts
import { describe, it, expect, vi } from 'vitest'
import { GET } from '../route'

vi.mock('@/lib/clerk-mcp')

describe('Health API', () => {
  it('returns healthy status', async () => {
    const response = await GET()
    expect(response.status).toBe(200)
  })
})
```

### Test File Naming Convention

```
src/
├── components/
│   └── __tests__/
│       ├── button.test.tsx
│       └── input.test.tsx
├── lib/
│   └── __tests__/
│       └── utils.test.ts
└── app/
    └── api/
        └── health/
            └── __tests__/
                └── route.test.ts
```

---

## 🐍 Backend Testing

### Running Tests

```bash
cd apps/audio-engine

# All tests
pytest

# With coverage
pytest --cov=app

# Specific test file
pytest tests/test_health.py

# Specific test function
pytest tests/test_health.py::test_health_check

# With verbose output
pytest -v

# Parallel execution
pytest -n auto
```

### Writing Tests

```python
# tests/test_health.py
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac

class TestHealthEndpoints:
    @pytest.mark.asyncio
    async def test_health_check(self, client: AsyncClient):
        response = await client.get("/health/")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
```

### Using Fixtures

```python
# tests/conftest.py
@pytest.fixture
async def db_session():
    from app.mcp.database import db_mcp
    await db_mcp.connect()
    session = await db_mcp.get_session().__aenter__()
    yield session
    await session.close()
    await db_mcp.disconnect()

# tests/test_audio.py
@pytest.mark.asyncio
async def test_audio_processing(db_session, r2_storage, openai_client):
    # Test with mocked dependencies
    pass
```

### Test Markers

```python
@pytest.mark.unit
async def test_unit_function():
    pass

@pytest.mark.integration
@pytest.mark.requires_db
async def test_integration_with_db():
    pass

@pytest.mark.slow
async def test_slow_operation():
    pass

# Run specific markers
pytest -m "unit"
pytest -m "not slow"
pytest -m "integration and requires_db"
```

---

## 🌐 E2E Testing

### Running E2E Tests

```bash
cd apps/web

# All E2E tests
npm run test:e2e

# Specific file
npx playwright test e2e/home.spec.ts

# With UI
npx playwright test --ui

# Specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug
```

### Writing E2E Tests

```typescript
// e2e/home.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/VOZAZI/)
  })

  test('displays main heading', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /vozazi/i })).toBeVisible()
  })
})
```

### Visual Regression Testing

```typescript
test('has correct screenshot', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveScreenshot('home-page.png')
})
```

---

## 📏 Code Quality

### Frontend Linting

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run typecheck
```

### Backend Linting

```bash
cd apps/audio-engine

# Ruff linting
ruff check app

# Ruff auto-fix
ruff check app --fix

# Black formatting
black app

# Black check
black app --check

# mypy type checking
mypy app
```

### Pre-commit Hooks

```bash
# Install hooks
npm run prepare

# Run manually
npx lint-staged

# Check commit message
npx commitlint --edit
```

---

## 🔒 Security

### Dependency Auditing

```bash
# Frontend
npm audit
npm audit fix

# Backend
cd apps/audio-engine
pip-audit
safety check
bandit -r app/
```

### Security Scanning in CI

```yaml
# .github/workflows/security.yml
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: npm audit
        run: npm audit --audit-level=high
      
      - name: pip-audit
        run: pip-audit
      
      - name: bandit
        run: bandit -r app/ -ll
```

---

## 🪝 Pre-commit Hooks

### Configuration

```json
// .lintstagedrc.json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.py": ["ruff check --fix", "black"],
  "*.{json,md}": ["prettier --write"]
}
```

### Commit Message Format

```bash
# Conventional Commits
feat: add audio transcription feature
fix: resolve memory leak in audio processing
docs: update API documentation
style: format code
refactor: extract audio processing logic
perf: improve transcription speed
test: add unit tests for audio API
build: update dependencies
ci: configure GitHub Actions
chore: update .gitignore
revert: revert previous commit
```

---

## 🚀 CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run typecheck
      
      - name: Test frontend
        run: npm run test:coverage
      
      - name: Test backend
        run: |
          cd apps/audio-engine
          pip install -r requirements.txt
          pytest --cov=app
      
      - name: E2E tests
        run: npx playwright install && npm run test:e2e
```

---

## 📊 Coverage Requirements

### Frontend Coverage

```typescript
// vitest.config.ts
coverage: {
  thresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}
```

### Backend Coverage

```ini
# pyproject.toml
[tool.coverage.report]
fail_under = 80
```

---

## 🧩 Test Utilities

### Frontend Test Utilities

```typescript
// src/test-utils/index.tsx
import { render } from '@testing-library/react'

export const createMockUser = (overrides?) => ({
  id: 'user_test_123',
  email: 'test@example.com',
  ...overrides
})

export const createMockAudioFile = (overrides?) => ({
  id: 'audio_test_123',
  filename: 'test.wav',
  ...overrides
})
```

### Backend Test Fixtures

```python
# tests/conftest.py
class AudioFileFactory(factory.Factory):
    class Meta:
        model = dict
    
    id = factory.LazyFunction(lambda: fake.uuid4())
    filename = factory.LazyFunction(lambda: f"{fake.slug()}.wav")
    status = factory.LazyFunction(lambda: fake.random_element(["pending", "processing", "completed"]))
```

---

## 📚 Resources

- [Vitest Documentation](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- [Playwright](https://playwright.dev)
- [pytest](https://docs.pytest.org)
- [Ruff](https://docs.astral.sh/ruff)
- [Black](https://black.readthedocs.io)

---

*Last updated: 2026-03-18*
*VOZAZI Testing & Code Quality Guide*
