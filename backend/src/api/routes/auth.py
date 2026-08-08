import os
from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from src.core.config import settings
from src.core.database import get_db
from src.core.dependencies import get_current_user
from src.core.security import (
    create_access_token,
    generate_refresh_token,
    hash_password,
    hash_refresh_token,
    refresh_token_expires_at,
    verify_password,
)
from src.models.refresh_token import RefreshToken
from src.models.user import User
from src.schemas.user import LoginInput, RegisterInput, UpdateUserInput, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


def _is_production() -> bool:
    return os.getenv("ENVIRONMENT") == "production"


def _set_access_cookie(response: Response, token: str) -> None:
    prod = _is_production()
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=prod,
        samesite="none" if prod else "lax",
        max_age=settings.access_token_expire_minutes * 60,
    )


def _set_refresh_cookie(response: Response, token: str) -> None:
    prod = _is_production()
    response.set_cookie(
        key="refresh_token",
        value=token,
        httponly=True,
        secure=prod,
        samesite="none" if prod else "lax",
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
        path="/auth/refresh",
    )


def _clear_cookies(response: Response) -> None:
    prod = _is_production()
    for key, path in [("access_token", "/"), ("refresh_token", "/auth/refresh")]:
        response.delete_cookie(
            key=key,
            httponly=True,
            secure=prod,
            samesite="none" if prod else "lax",
            path=path,
        )


def _create_refresh_token_record(db: Session, user_id: str, raw_token: str) -> None:
    """Invalida tokens anteriores e salva o novo hash no banco."""
    db.query(RefreshToken).filter(RefreshToken.user_id == user_id).delete()
    db.add(RefreshToken(
        id=str(uuid4()),
        user_id=user_id,
        token_hash=hash_refresh_token(raw_token),
        expires_at=refresh_token_expires_at(),
    ))


@router.post("/register", response_model=UserResponse, status_code=201)
def register(input: RegisterInput, response: Response, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == input.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="E-mail já cadastrado")

    user = User(
        id=str(uuid4()),
        email=input.email,
        hashed_password=hash_password(input.password),
        name=input.name,
    )
    db.add(user)

    raw_refresh = generate_refresh_token()
    _create_refresh_token_record(db, user.id, raw_refresh)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": user.id})
    _set_access_cookie(response, access_token)
    _set_refresh_cookie(response, raw_refresh)

    return user


@router.post("/login", response_model=UserResponse)
def login(input: LoginInput, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == input.email).first()
    if not user or not verify_password(input.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="E-mail ou senha incorretos")

    raw_refresh = generate_refresh_token()
    _create_refresh_token_record(db, user.id, raw_refresh)
    db.commit()

    access_token = create_access_token(data={"sub": user.id})
    _set_access_cookie(response, access_token)
    _set_refresh_cookie(response, raw_refresh)

    return user


@router.post("/refresh", response_model=UserResponse)
def refresh_token(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    """Emite novo access token + rotaciona refresh token."""
    raw_token = request.cookies.get("refresh_token")
    if not raw_token:
        raise HTTPException(
            status_code=401, detail="Refresh token não encontrado")

    token_hash = hash_refresh_token(raw_token)
    record = db.query(RefreshToken).filter(
        RefreshToken.token_hash == token_hash
    ).first()

    if not record or record.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=401, detail="Refresh token inválido ou expirado")

    user = db.query(User).filter(User.id == record.user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")

    # Rotaciona o refresh token — invalida o anterior e emite um novo
    new_raw_refresh = generate_refresh_token()
    _create_refresh_token_record(db, user.id, new_raw_refresh)
    db.commit()

    new_access = create_access_token(data={"sub": user.id})
    _set_access_cookie(response, new_access)
    _set_refresh_cookie(response, new_raw_refresh)

    return user


@router.post("/logout")
def logout(
    response: Response,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(RefreshToken).filter(
        RefreshToken.user_id == current_user.id).delete()
    db.commit()
    _clear_cookies(response)
    return {"message": "Logout realizado com sucesso"}


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(
    input: UpdateUserInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if input.name:
        current_user.name = input.name

    if input.email:
        existing = db.query(User).filter(
            User.email == input.email,
            User.id != current_user.id,
        ).first()
        if existing:
            raise HTTPException(status_code=409, detail="E-mail já cadastrado")
        current_user.email = input.email

    if input.new_password:
        if not input.current_password:
            raise HTTPException(
                status_code=400, detail="Senha atual obrigatória")
        if not verify_password(input.current_password, current_user.hashed_password):
            raise HTTPException(
                status_code=400, detail="Senha atual incorreta")
        current_user.hashed_password = hash_password(input.new_password)

    if input.avatar_url is not None:
        current_user.avatar_url = input.avatar_url

    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/me", status_code=204)
def delete_my_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    response: Response = None,
):
    """Deleta a conta do usuário e todos os dados vinculados em cascata."""
    db.query(RefreshToken).filter(
        RefreshToken.user_id == current_user.id).delete()
    db.delete(current_user)
    db.commit()
    _clear_cookies(response)
