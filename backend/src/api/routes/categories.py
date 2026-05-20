from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import uuid4

from src.core.database import get_db
from src.core.dependencies import get_current_user
from src.models.category import Category as CategoryModel
from src.models.user import User
from src.schemas.category import Category, CreateCategoryInput, UpdateCategoryInput

router = APIRouter(prefix="/categories", tags=["categories"])

# Categorias pré-definidas do sistema (user_id = None)
SYSTEM_CATEGORIES = [
    # Despesas — Essenciais
    {"name": "Alimentação",     "icon": "utensils",
        "color": "#f97316", "type": "expense"},
    {"name": "Moradia",         "icon": "home",
        "color": "#8b5cf6", "type": "expense"},
    {"name": "Transporte",      "icon": "car",
        "color": "#3b82f6", "type": "expense"},
    {"name": "Saúde",           "icon": "heart-pulse",
        "color": "#ef4444", "type": "expense"},
    {"name": "Educação",        "icon": "book-open",
        "color": "#06b6d4", "type": "expense"},
    # Despesas — Qualidade de vida
    {"name": "Lazer",           "icon": "gamepad-2",
        "color": "#ec4899", "type": "expense"},
    {"name": "Vestuário",       "icon": "shirt",
        "color": "#a855f7", "type": "expense"},
    {"name": "Assinaturas",     "icon": "tv-2",
        "color": "#64748b", "type": "expense"},
    {"name": "Restaurantes",    "icon": "chef-hat",
        "color": "#f59e0b", "type": "expense"},
    # Despesas — Diversos
    {"name": "Pets",            "icon": "paw-print",
        "color": "#84cc16", "type": "expense"},
    {"name": "Presentes",       "icon": "gift",
        "color": "#f43f5e", "type": "expense"},
    {"name": "Outros",          "icon": "circle-ellipsis",
        "color": "#94a3b8", "type": "expense"},
    # Receitas
    {"name": "Salário",         "icon": "briefcase",
        "color": "#10b981", "type": "income"},
    {"name": "Freelance",       "icon": "laptop",
        "color": "#34d399", "type": "income"},
    {"name": "Investimentos",   "icon": "trending-up",
        "color": "#059669", "type": "income"},
    {"name": "Presente recebido", "icon": "package",
        "color": "#6ee7b7", "type": "income"},
    {"name": "Outras receitas", "icon": "plus-circle",
        "color": "#a7f3d0", "type": "income"},
]


def seed_system_categories(db: Session) -> None:
    """Insere categorias do sistema se ainda não existirem."""
    for cat in SYSTEM_CATEGORIES:
        exists = db.query(CategoryModel).filter(
            CategoryModel.name == cat["name"],
            CategoryModel.user_id == None,  # noqa: E711
        ).first()
        if not exists:
            db.add(CategoryModel(id=str(uuid4()), user_id=None, **cat))
    db.commit()


@router.get("/", response_model=list[Category])
def list_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retorna categorias do sistema + categorias criadas pelo usuário."""
    seed_system_categories(db)
    return (
        db.query(CategoryModel)
        .filter(
            (CategoryModel.user_id == None) |  # noqa: E711
            (CategoryModel.user_id == current_user.id)
        )
        .all()
    )


@router.post("/", response_model=Category, status_code=201)
def create_category(
    input: CreateCategoryInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    category = CategoryModel(
        id=str(uuid4()),
        user_id=current_user.id,
        **input.model_dump(),
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.put("/{category_id}", response_model=Category)
def update_category(
    category_id: str,
    input: UpdateCategoryInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    category = db.query(CategoryModel).filter(
        CategoryModel.id == category_id,
        CategoryModel.user_id == current_user.id,  # só categorias do próprio usuário
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")

    for field, value in input.model_dump(exclude_none=True).items():
        setattr(category, field, value)

    db.commit()
    db.refresh(category)
    return category


@router.delete("/{category_id}", status_code=204)
def delete_category(
    category_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    category = db.query(CategoryModel).filter(
        CategoryModel.id == category_id,
        CategoryModel.user_id == current_user.id,
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")

    db.delete(category)
    db.commit()
