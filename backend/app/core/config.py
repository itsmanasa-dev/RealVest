import os
from pathlib import Path
from dotenv import load_dotenv

# Automatically load .env from root project directory
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
env_path = ROOT_DIR / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

class Settings:
    PROJECT_NAME: str = "RealVest Decision Engine"
    API_PREFIX: str = "/api"
    
    # Database URL from environment (Hosted MySQL on Render / Local MySQL)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root:password@localhost:3306/realvest"
    )
    
    # Configurable CORS Origins for Vercel and local development
    _default_origins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ]
    
    _extra_origins = [
        origin.strip()
        for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")
        if origin.strip()
    ]
    
    frontend_url = os.getenv("FRONTEND_URL", "").strip()
    if frontend_url and frontend_url not in _extra_origins:
        _extra_origins.append(frontend_url)
        
    CORS_ORIGINS: list = _default_origins + _extra_origins

settings = Settings()
