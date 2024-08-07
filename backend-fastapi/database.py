# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# DATABASE_URL = "postgresql://postgres:postgres@localhost/test"

user_name = 'postgres'
password = 'postgres'
server = 'localhost'
db_name = 'TMA'

DATABASE_URL = f"postgresql://{user_name}:{password}@{server}/{db_name}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_session_local():
    yield SessionLocal()