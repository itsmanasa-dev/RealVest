import os
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

def get_engine():
    db_url = settings.DATABASE_URL
    if not db_url.startswith("mysql"):
        raise ValueError(f"DATABASE_URL must be a MySQL connection string (e.g. mysql+pymysql://root:password@localhost:3306/realvest). Received: {db_url}")
    
    # Strictly connect to MySQL without SQLite fallback
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        pool_recycle=3600,
        connect_args={"connect_timeout": 5}
    )
    
    # Test connection immediately
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    
    logger.info("Successfully connected to MySQL database: %s", db_url.split("@")[-1])
    return engine

try:
    engine = get_engine()
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    engine = None
    SessionLocal = None
    _init_error = e

def get_db():
    if engine is None or SessionLocal is None:
        raise RuntimeError(f"MySQL connection is not established: {_init_error}")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
