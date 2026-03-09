# OpenSplit Rules

## Stack
- Backend: FastAPI + SQLAlchemy + PostgreSQL (Supabase). No Flask, no Django, no MongoDB.
- Frontend: Next.js 14 App Router + TypeScript + Tailwind. No Pages Router.
- Auth: JWT + Supabase Auth. Guest sessions use `is_guest: true` JWT claim.

## Architecture
- Routes → Services → DB. No business logic in routes. No direct DB calls in routes.
- Agent logic in `backend/agents/`. All LLM calls via `backend/agents/llm_client.py` only.
- Background jobs in `backend/tasks/` via Celery.

## Naming
- Python: `snake_case` files/functions, `PascalCase` classes, `UserModel` for DB models, `UserCreateSchema` for Pydantic.
- TypeScript: `PascalCase` components, `useHookName` hooks, `kebab-case.tsx` component files.

## Critical Rules
- **Money = integers only** (store in cents/smallest unit). Never floats.
- Currency stored as original. FX conversion at display time only. Rates cached 1hr in Redis.
- Every table: `id (UUID)`, `created_at`, `updated_at`, `deleted_at` (soft delete).
- All routes return: `{ "data": {}, "message": "success", "error": null }`
- Mobile-first. 360px min width. 48px min touch targets. Dark mode default.
- No `any` in TypeScript. No inline styles.
- Never call external APIs from frontend — always go through backend.
- No secrets in code. Use `.env` only.
- All DB migrations via Alembic. Never edit existing migrations.
