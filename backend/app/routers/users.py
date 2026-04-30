from fastapi import APIRouter, Depends
from app.models.schemas import UserOut
from app.supabase_client import supabase
from app.dependencies import require_manager
from typing import List

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=List[UserOut])
async def list_users(current_user: dict = Depends(require_manager)):
    """
    List all registered users (managers only).
    Used by the manager dashboard to find users to add to projects.
    """
    result = supabase.table("users").select("*").order("created_at").execute()
    return result.data or []
