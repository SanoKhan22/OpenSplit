from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import auth, groups, expenses, settlements

app = FastAPI(
    title="OpenSplit API",
    version="0.1.0",
    docs_url="/docs" if settings.app_debug else None,
    redoc_url="/redoc" if settings.app_debug else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(groups.router, prefix="/api/groups", tags=["groups"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["expenses"])
app.include_router(settlements.router, prefix="/api/settlements", tags=["settlements"])


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/debug/cors")
async def debug_cors() -> dict[str, list[str]]:
    return {"allowed_origins": ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"]}
