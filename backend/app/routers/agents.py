from fastapi import APIRouter, HTTPException, status, Depends
from app.supabase_client import supabase
from app.dependencies import get_current_user
from app.services.agent_runners import run_agent
from app.services.zep_service import ensure_zep_project
from typing import Literal

router = APIRouter(prefix="/agents", tags=["Agents"])

AgentType = Literal["decisions", "ideas", "actions", "risks"]


def _get_project_and_assert_member(project_id: str, user_id: str) -> dict:
    """Fetches project + validates membership. Returns the project row."""
    try:
        project_result = (
            supabase.table("projects")
            .select("*")
            .eq("id", project_id)
            .single()
            .execute()
        )
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if not project_result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    try:
        membership = (
            supabase.table("memberships")
            .select("id")
            .eq("project_id", project_id)
            .eq("user_id", user_id)
            .single()
            .execute()
        )
    except Exception:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not a member of this project")

    if not membership.data:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not a member of this project")

    return project_result.data


@router.post("/{project_id}/{agent_type}", response_model=dict)
async def run_project_agent(
    project_id: str,
    agent_type: AgentType,
    current_user: dict = Depends(get_current_user),
):
    """
    Run a specialized agent against the project's conversation history.
    Returns { items: list[str] }
    """
    project = _get_project_and_assert_member(project_id, current_user["id"])

    # Ensure Zep thread exists (idempotent)
    zep_session_id = await ensure_zep_project(project_id, project["name"])

    items = await run_agent(
        agent_type=agent_type,
        project_name=project["name"],
        zep_session_id=zep_session_id,
    )

    return {"items": items}
