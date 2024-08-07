from fastapi import FastAPI
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from routers import user, project, task, comment
from models import User as UserModel
from auth import get_db, get_password_hash

app = FastAPI()

# Create all tables
Base.metadata.create_all(bind=engine)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, you can specify specific origins here
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# # Define default users
DEFAULT_USERS = [
    {"name": "Admin", "email": "admin@example.com", "password": "Admin$100", "role": "admin"},
    {"name": "User", "email": "user@example.com", "password": "User$100", "role": "user"}
]

@app.on_event("startup")
async def create_default_users():
    db: Session = next(get_db())  # Use the dependency function to get the database session

    # Check if any users exist
    existing_users = db.query(UserModel).all()
    if not existing_users:
        for user_data in DEFAULT_USERS:
            hashed_password = get_password_hash(user_data["password"])
            user = UserModel(
                name=user_data["name"],
                email=user_data["email"],
                password=hashed_password,
                role=user_data["role"],
                hashed_password="null"
            )
            db.add(user)
        db.commit()
        print("Default users created.")
    else:
        print("Users already exist. No default users created.")

# Include routers
app.include_router(user.router, prefix="/v1")
app.include_router(project.router, prefix="/v1")
app.include_router(task.router, prefix="/v1")
app.include_router(comment.router, prefix="/v1")


# alembic revision --autogenerate -m "Update models"
# alembic upgrade head

# uvicorn main:app --reload