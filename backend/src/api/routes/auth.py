from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import uuid4

from src.core.database import get_db
from src.core.security import hash_password, verify_password, create_access_token
from src.models.user import User
from src.schemas.user import RegisterInput, LoginInput, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=201)
def register(input: RegisterInput, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == input.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="E-mail já cadastrado",
        )

    user = User(
        id=str(uuid4()),
        email=input.email,
        hashed_password=hash_password(input.password),
        name=input.name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
def login(input: LoginInput, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == input.email).first()

    if not user or not verify_password(input.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
        )

    token = create_access_token(data={"sub": user.id})
    return {"access_token": token, "token_type": "bearer"}
