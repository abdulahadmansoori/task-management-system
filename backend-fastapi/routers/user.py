from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from auth import (
    create_access_token,
    authenticate_user,
    get_current_user,
    get_password_hash,
    get_db,
    get_session_local
)
from schemas import UserCreate, User, Token
from models import User as UserModel
from datetime import timedelta
from passlib.context import CryptContext

router = APIRouter()

@router.post("/register", response_model=User)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = UserModel(
        name=user.name, email=user.email, password=hashed_password, role=user.role, hashed_password='null'
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login_for_access_token(
    db: Session = Depends(get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
):
    # print("form_data.username")
    # print(form_data.username)
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role, "id": user.id}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/profile", response_model=User)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/users", response_model=list[User])
def list_users(db: Session = Depends(get_db)):
    return db.query(UserModel).all()

@router.put("/users/{user_id}", response_model=User)
def update_user(
    user_id: int,
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Optional: authorization check
):
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.name = user.name
    db_user.email = user.email
    # Optionally: Update password only if provided
    if user.password:
        db_user.password = get_password_hash(user.password)
    db_user.role = user.role
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/users/{user_id}", response_model=User)
def delete_user(
    user_id: int,
    # db: Session = Depends(get_session_local),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Optional: authorization check
):
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return db_user
