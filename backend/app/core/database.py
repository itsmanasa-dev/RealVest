import os
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

_engine = None
_SessionLocal = None

def ensure_tables_created(target_engine=None):
    if target_engine is None:
        target_engine = get_engine()
    if target_engine is not None:
        try:
            from backend.app.models.property import PropertyModel
            from backend.app.models.comparison import ComparisonModel
            Base.metadata.create_all(bind=target_engine)
        except Exception as err:
            logger.warning("Could not auto-create tables: %s", str(err))

def init_db_engine():
    global _engine, _SessionLocal
    if _engine is not None:
        return _engine, _SessionLocal

    db_url = settings.DATABASE_URL
    try:
        if db_url and db_url.startswith("mysql"):
            # Attempt connection to MySQL
            test_engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_recycle=3600,
                connect_args={"connect_timeout": 4}
            )
            with test_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("Successfully connected to MySQL database: %s", db_url.split("@")[-1])
            _engine = test_engine
            _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
            ensure_tables_created(_engine)
            return _engine, _SessionLocal
        elif db_url and db_url.startswith("sqlite"):
            _engine = create_engine(db_url, connect_args={"check_same_thread": False})
            _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
            ensure_tables_created(_engine)
            return _engine, _SessionLocal
    except Exception as e:
        logger.warning("Primary database connection (%s) failed: %s. Initializing fallback persistent database.", db_url.split("@")[-1] if "@" in db_url else db_url, str(e))

    # Resilient fallback database for cloud container deployments where local MySQL is absent
    fallback_url = "sqlite:///./realvest.db"
    _engine = create_engine(fallback_url, connect_args={"check_same_thread": False})
    _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
    ensure_tables_created(_engine)
    logger.info("Initialized persistent fallback database (SQLite).")
    return _engine, _SessionLocal

engine, SessionLocal = init_db_engine()

def get_engine():
    global engine, SessionLocal
    if engine is None:
        engine, SessionLocal = init_db_engine()
    return engine

def get_session():
    global engine, SessionLocal
    if SessionLocal is None:
        engine, SessionLocal = init_db_engine()
    return SessionLocal()

def get_db():
    global engine, SessionLocal
    if SessionLocal is None:
        engine, SessionLocal = init_db_engine()
    
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
