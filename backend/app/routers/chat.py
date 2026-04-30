from fastapi import APIRouter, HTTPException, status, Depends
from app.models.schemas import ChatRequest, ChatResponse, MessageOut
from app.supabase_client import supabase
from app.dependencies import get_current_user
from app.services.agent_service import run_chat
from app.services.zep_service import get_zep_context, ensure_zep_project
from typing import List

router = APIRouter(prefix="/chat", tags=["Chat"])


def _get_project_and_assert_member(project_id: str, user_id: str) -> dict:
    """Fetches project + validates membership. Returns the project row."""
    project_result = (
        supabase.table("projects")
        .select("*")
        .eq("id", project_id)
        .single()
        .execute()
    )
    if not project_result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    membership = (
        supabase.table("memberships")
        .select("id")
        .eq("project_id", project_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not membership.data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this project",
        )

    return project_result.data


def _get_zep_session_id(project_id: str) -> str:
    """Returns the deterministic Zep thread ID for a project (no DB lookup needed)."""
    return f"session-{project_id}"


@router.post("/{project_id}", response_model=ChatResponse)
async def send_message(
    project_id: str,
    body: ChatRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Send a message in a project chat.
    - Validates membership
    - Fetches Zep context (past decisions, facts)
    - Runs AI agent with context
    - Saves exchange to Zep
    - Returns AI reply
    """
    project = _get_project_and_assert_member(project_id, current_user["id"])
    zep_session_id = await ensure_zep_project(project_id, project["name"])

    reply = await run_chat(
        zep_session_id=zep_session_id,
        project_name=project["name"],
        user_name=current_user.get("name") or current_user.get("email", "Unknown"),
        user_role=current_user.get("role", "employee"),
        message=body.message,
    )

    return ChatResponse(
        reply=reply,
        user_name=current_user.get("name") or current_user.get("email", "Unknown"),
        user_role=current_user.get("role", "employee"),
    )


@router.get("/{project_id}/history", response_model=List[MessageOut])
async def get_history(
    project_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Fetch recent message history for a project chat from Zep.
    Returns the last ~50 messages.
    """
    _get_project_and_assert_member(project_id, current_user["id"])
    zep_session_id = _get_zep_session_id(project_id)

    _, messages = await get_zep_context(zep_session_id)

    result = []
    for msg in messages:
        result.append(
            MessageOut(
                role_type=getattr(msg, "role_type", "user"),
                role=getattr(msg, "role", None),
                content=getattr(msg, "content", ""),
                created_at=getattr(msg, "created_at", None),
            )
        )
    return result
