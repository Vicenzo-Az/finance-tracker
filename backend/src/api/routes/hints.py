from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import uuid4

from src.core.database import get_db
from src.core.dependencies import get_current_user
from src.models.description_hint import DescriptionHint
from src.models.user import User

router = APIRouter(prefix="/hints", tags=["hints"])


@router.get("/")
def get_hint(
    description: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retorna a categoria sugerida para uma descrição."""
    hint = db.query(DescriptionHint).filter(
        DescriptionHint.user_id == current_user.id,
        DescriptionHint.description == description.strip().lower(),
    ).first()

    if not hint:
        return {"category_id": None}

    return {"category_id": hint.category_id}


@router.post("/")
def save_hint(
    description: str,
    category_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Salva ou atualiza o par descrição → categoria."""
    description = description.strip().lower()

    hint = db.query(DescriptionHint).filter(
        DescriptionHint.user_id == current_user.id,
        DescriptionHint.description == description,
    ).first()

    if hint:
        hint.category_id = category_id
    else:
        hint = DescriptionHint(
            id=str(uuid4()),
            description=description,
            category_id=category_id,
            user_id=current_user.id,
        )
        db.add(hint)

    db.commit()
    return {"ok": True}
