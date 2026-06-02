import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import create_tables
from app.routers import projects, results, agents

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("Starting Autonomous Business Builder API...")
    await create_tables()
    logger.info("Database tables ready.")
    logger.info(f"OpenAI mode: {'MOCK' if settings.use_mock else 'LIVE'}")
    yield
    logger.info("Shutting down...")


app = FastAPI(
    title="Autonomous Business Builder API",
    description="Transform a business idea into a complete business package using AI agents.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(projects.router)
app.include_router(results.router)
app.include_router(agents.router)


@app.get("/", tags=["health"])
async def root():
    return {
        "name": "Autonomous Business Builder API",
        "version": "1.0.0",
        "status": "running",
        "mode": "mock" if settings.use_mock else "live",
        "docs": "/docs",
    }


@app.get("/health", tags=["health"])
async def health():
    return {"status": "healthy"}
