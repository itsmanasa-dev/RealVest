import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.database import engine, Base, SessionLocal
from backend.app.models.property import PropertyModel
from backend.app.models.comparison import ComparisonModel
from backend.app.services.property_service import property_service
from backend.app.services.prediction_service import prediction_service
from backend.app.schemas.property import AnalyzeRequest, AnalyzeResponse
from backend.app.api.properties import router as properties_router
from backend.app.api.comparisons import router as comparisons_router
from backend.app.api.advisor import router as advisor_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("realvest")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    if engine is not None:
        logger.info("Initializing RealVest database tables...")
        Base.metadata.create_all(bind=engine)
        
        # Seed initial real properties if needed
        db = SessionLocal()
        try:
            property_service.ensure_seeded(db)
        finally:
            db.close()
        logger.info("RealVest backend initialized successfully.")
    else:
        logger.warning("Database engine is not ready during lifespan.")
    yield

app = FastAPI(
    title="RealVest Decision Engine API",
    description="Backend for RealVest: Bengaluru property datasets, ML valuations, comparisons, and persistent decision analytics.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
app.include_router(properties_router, prefix=settings.API_PREFIX)
app.include_router(comparisons_router, prefix=settings.API_PREFIX)
app.include_router(advisor_router, prefix=settings.API_PREFIX)

@app.post("/api/analyze", response_model=AnalyzeResponse, tags=["Analytics"])
def analyze_property(req: AnalyzeRequest):
    """
    Direct endpoint to run ML valuation and investment analysis for custom properties.
    """
    return prediction_service.analyze_property(req)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "RealVest Decision Engine API",
        "docs": "/docs"
    }

@app.get("/health")
def health():
    return {"status": "ok"}
