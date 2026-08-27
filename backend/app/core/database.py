import os
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

_engine = None
_SessionLocal = None
_init_error = None

def get_engine():
    global _engine, _SessionLocal, _init_error
    if _engine is not None:
        return _engine

    db_url = settings.DATABASE_URL
    try:
        if not db_url.startswith("mysql"):
            raise ValueError(f"DATABASE_URL must be a MySQL connection string (e.g. mysql+pymysql://root:password@localhost:3306/realvest). Received: {db_url}")
        
        # Connect to MySQL
        _engine = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_recycle=3600,
            connect_args={"connect_timeout": 5}
        )
        
        with _engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        
        logger.info("Successfully connected to MySQL database: %s", db_url.split("@")[-1])
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
        return _engine
    except Exception as e:
        _init_error = e
        logger.error("MySQL connection error: %s", str(e))
        return None

# Attempt initial connection
engine = get_engine()
SessionLocal = _SessionLocal

def get_db():
    global engine, SessionLocal
    if engine is None:
        engine = get_engine()
        SessionLocal = _SessionLocal

    if engine is None or SessionLocal is None:
        raise RuntimeError(f"MySQL connection is not established: {_init_error}")
    
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
