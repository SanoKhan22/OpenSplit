# GitHub Copilot Instructions — OpenSplit

## Project Overview
OpenSplit is a bill-splitting app. Backend: FastAPI + SQLAlchemy + PostgreSQL (Supabase). Frontend: Next.js 14 App Router + TypeScript + Tailwind. AI agents for receipt scanning and RAG-based expense retrieval.

**📐 UI/UX Design System:** See [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) for complete design reference with all 20 Stitch screens, component specs, and frontend implementation guide.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, SQLAlchemy 2.0, Alembic, Pydantic v2 |
| Database | PostgreSQL via Supabase |
| Auth | JWT (`python-jose`) + Supabase Auth |
| Cache / Queue | Redis + Celery |
| AI / Agents | OpenAI GPT-4o, LlamaIndex RAG |
| Frontend | Next.js 14 App Router, TypeScript strict, Tailwind CSS |
| Testing | pytest + pytest-asyncio (backend), ESLint + tsc (frontend) |

---

## Architecture Rules

### Backend
- **Routes → Services → DB** — no business logic in routes, no direct DB calls in routes
- All agent/LLM logic lives in `backend/app/agents/`
- All LLM calls go through `backend/app/agents/llm_client.py` only — never instantiate LLM clients directly elsewhere
- Background jobs go in `backend/app/tasks/` via Celery
- Standard response format for every route:
  ```python
  {"data": {}, "message": "success", "error": None}
  ```

### Database / Models
- Every table has: `id (UUID)`, `created_at`, `updated_at`, `deleted_at` (soft delete — never hard delete)
- Use `deleted_at.is_(None)` in all queries to filter soft-deleted records
- **Money is ALWAYS integers in cents** — never floats, never Decimal for storage
  ```python
  # ✅ correct
  amount_cents: int = 1250  # $12.50
  # ❌ wrong
  amount: float = 12.50
  ```
- Currency stored as original 3-letter ISO code. FX conversion at display time only, rates cached 1hr in Redis

### Naming — Python
- Files and functions: `snake_case`
- Classes: `PascalCase`
- DB models: `UserModel`, `GroupModel` (suffix `Model`)
- Pydantic schemas: `UserCreateSchema`, `UserSchema` (suffix `Schema`)

### Naming — TypeScript
- Components: `PascalCase`
- Hooks: `useHookName`
- Files: `kebab-case.tsx`
- No `any` type — ever
- No inline styles — use Tailwind classes only

---

## Critical Constraints

### Money
```python
# Always store in cents (integer)
amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)
share_cents: Mapped[int] = mapped_column(Integer, nullable=False)

# Display using formatCents() in frontend — never on backend
formatCents(1250, "USD")  // "$12.50"
```

### API calls
- Frontend NEVER calls external APIs directly — always goes through the backend
- All fetch calls use `src/lib/api.ts` helpers (`apiGet`, `apiPost`, `apiPatch`, `apiDelete`)

### Auth
- JWT token stored in `localStorage` under key `os_access_token`
- Guest sessions use `is_guest: true` JWT claim
- Protected routes use `Depends(get_current_user)` on the backend

### Secrets
- No secrets in code — `.env` files only
- Backend config via `app/config.py` using `pydantic-settings`

### UI
- Mobile-first, 360px minimum width
- Minimum 48px touch targets: `min-h-[48px] min-w-[48px]`
- Dark mode is default (`class="dark"` on `<html>`)
- Brand colors: teal `#13ecda`, purple `#7c3bed`
### GIT  COMMIT
- Use present tense: "Add user model", not "Added" or "Adds"

---

## File Structure

```
backend/
  app/
    agents/          # LLM agents — all LLM calls via llm_client.py
      rag/           # LlamaIndex RAG indexer + retriever
      llm_client.py  # SINGLE entry point for all LLM calls
      receipt_agent.py
    models/          # SQLAlchemy ORM models (*Model suffix)
    schemas/         # Pydantic schemas (*Schema suffix)
    routes/          # FastAPI routers — thin, delegates to services
    services/        # Business logic
    tasks/           # Celery async tasks
    config.py        # Settings via pydantic-settings
    dependencies.py  # FastAPI Depends (auth, db)
    main.py
  alembic/           # Migrations — never edit existing migrations

frontend/
  src/
    app/
      (auth)/        # Login, signup pages
      (dashboard)/   # Protected app pages
    lib/
      api.ts         # All HTTP calls — never fetch directly in components
      auth.ts        # Token management
    types/
      index.ts       # Shared TypeScript types + formatCents()
    components/ui/   # Reusable UI components
    hooks/           # Custom React hooks
```

---

## Common Patterns

### Adding a new backend feature
```python
# 1. Model (backend/app/models/feature.py)
class FeatureModel(Base, TimestampMixin):
    __tablename__ = "features"
    ...

# 2. Schema (backend/app/schemas/feature.py)
class FeatureCreateSchema(BaseModel): ...
class FeatureSchema(BaseModel):
    model_config = {"from_attributes": True}

# 3. Service (backend/app/services/feature_service.py)
class FeatureService:
    def __init__(self, db: Session) -> None:
        self.db = db

# 4. Route (backend/app/routes/feature.py) — thin wrapper
@router.post("", response_model=dict)
async def create(...) -> dict[str, Any]:
    service = FeatureService(db)
    result = service.create(payload, current_user)
    return {"data": result, "message": "success", "error": None}

# 5. Add migration: alembic revision --autogenerate -m "add features table"
```

### Adding a new frontend page
```tsx
// src/app/(dashboard)/feature/page.tsx
"use client";
import useSWR from "swr";
import { apiGet } from "@/lib/api";
// min-h-[48px] on all interactive elements
// No inline styles, no `any`
```

### Async background job
```python
# Queue the job (returns immediately)
task = process_something.delay(data)
return {"data": {"job_id": task.id}, "message": "queued", "error": None}

# Poll status
GET /api/expenses/jobs/{job_id}
```
