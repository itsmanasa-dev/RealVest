import os
import sys
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
env_path = ROOT_DIR / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
    print(f"Loaded .env from {env_path}")
else:
    print(f"No .env file found at {env_path}")

db_url = os.getenv("DATABASE_URL", "NOT_SET")
# Obfuscate password for display
if "@" in db_url:
    prefix, suffix = db_url.split("@")
    user_part = prefix.split("//")[-1].split(":")[0]
    obfuscated_url = f"mysql+pymysql://{user_part}:****@{suffix}"
else:
    obfuscated_url = db_url

print(f"Target DATABASE_URL: {obfuscated_url}")

try:
    import pymysql
    from sqlalchemy import create_engine, text
    
    if db_url == "NOT_SET":
        raise ValueError("DATABASE_URL is not set in environment or .env file.")
        
    engine = create_engine(db_url, connect_args={"connect_timeout": 5})
    with engine.connect() as conn:
        res = conn.execute(text("SELECT DATABASE(), USER(), VERSION();")).fetchone()
        print(f"SUCCESS! Connected to MySQL:")
        print(f"  Current Database: {res[0]}")
        print(f"  User: {res[1]}")
        print(f"  MySQL Version: {res[2]}")
        
        # Check tables
        tables = conn.execute(text("SHOW TABLES;")).fetchall()
        print(f"  Tables in {res[0]}: {[t[0] for t in tables]}")
        
        if any("properties" in str(t[0]) for t in tables):
            count = conn.execute(text("SELECT COUNT(*) FROM properties;")).scalar()
            print(f"  SELECT COUNT(*) FROM properties -> {count}")
except Exception as e:
    print(f"\n[EXACT MYSQL ERROR]:\n{e}")
