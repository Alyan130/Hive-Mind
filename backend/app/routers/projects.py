from fastapi import APIRouter, HTTPException, status, Depends
from app.models.schemas import ProjectCreate, ProjectOut, AddMemberRequest, MemberOut
from app.supabase_client import supabase
from app.dependencies import get_current_user, require_manager
from app.services.zep_service import ensure_zep_project
from typing import List

router = APIRouter(prefix="/projects", tags=["Projects"])


# ─── Helper ──────────────────────────────────────────────────────────────────

def _assert_member(project_id: str, user_id: str):
    """Raises 403 if the user is not a member of the project."""
    result = (
        supabase.table("memberships")
        .select("id")
        .eq("project_id", project_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this project",
        )


# ─── Endpoints ───────────────────────────────────────────────────────────────

@router.get("", response_model=List[ProjectOut])
async def list_projects(current_user: dict = Depends(get_current_user)):
    """Returns all projects the current user is a member of."""
    memberships = (
        supabase.table("memberships")
        .select("project_id")
        .eq("user_id", current_user["id"])
        .execute()
    )
    project_ids = [m["project_id"] for m in (memberships.data or [])]

    if not project_ids:
        return []

    projects = (
        supabase.table("projects")
        .select("*")
        .in_("id", project_ids)
        .execute()
    )
    return projects.data or []


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
async def create_project(
    body: ProjectCreate,
    current_user: dict = Depends(require_manager),
):
    """
    Create a new project (managers only).
    - Inserts into projects table
    - Adds creator as first member
    - Creates Zep session for the project
    - Stores zep_session_id in zep_sessions table
    """
    # 1. Create project
    project_result = (
        supabase.table("projects")
        .insert({
            "name": body.name,
            "description": body.description,
            "created_by": current_user["id"],
        })
        .execute()
    )
    project = project_result.data[0]

    # 2. Add creator as member
    supabase.table("memberships").insert({
        "project_id": project["id"],
        "user_id": current_user["id"],
    }).execute()

    # 3. Create Zep session
    zep_session_id = await ensure_zep_project(project["id"], project["name"])

    # 4. Store mapping
    supabase.table("zep_sessions").insert({
        "project_id": project["id"],
        "zep_session_id": zep_session_id,
    }).execute()

    return project


@router.get("/{project_id}", response_model=ProjectOut)
async def get_project(
    project_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Get project details. User must be a member."""
    _assert_member(project_id, current_user["id"])

    result = (
        supabase.table("projects")
        .select("*")
        .eq("id", project_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    return result.data


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    current_user: dict = Depends(require_manager),
):
    """Delete a project (managers only). Cascades memberships and zep_sessions."""
    result = (
        supabase.table("projects")
        .select("id")
        .eq("id", project_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    supabase.table("projects").delete().eq("id", project_id).execute()


# ─── Members ─────────────────────────────────────────────────────────────────

@router.get("/{project_id}/members", response_model=List[MemberOut])
async def list_members(
    project_id: str,
    current_user: dict = Depends(get_current_user),
):
    """List all members of a project. User must be a member."""
    _assert_member(project_id, current_user["id"])

    result = (
        supabase.table("memberships")
        .select("user_id, added_at, users(name, email, role)")
        .eq("project_id", project_id)
        .execute()
    )

    members = []
    for row in result.data or []:
        user = row.get("users") or {}
        members.append({
            "user_id": row["user_id"],
            "name": user.get("name"),
            "email": user.get("email"),
            "role": user.get("role", "employee"),
            "added_at": row.get("added_at"),
        })
    return members


@router.post("/{project_id}/members", status_code=status.HTTP_201_CREATED)
async def add_member(
    project_id: str,
    body: AddMemberRequest,
    current_user: dict = Depends(require_manager),
):
    """Add a user to a project (managers only)."""
    # Check project exists
    project = (
        supabase.table("projects")
        .select("id")
        .eq("id", project_id)
        .single()
        .execute()
    )
    if not project.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # Check user exists
    user = (
        supabase.table("users")
        .select("id")
        .eq("id", body.user_id)
        .single()
        .execute()
    )
    if not user.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Add membership (unique constraint handles duplicates)
    try:
        supabase.table("memberships").insert({
            "project_id": project_id,
            "user_id": body.user_id,
        }).execute()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User is already a member of this project",
        )

    return {"detail": "Member added successfully"}


@router.delete("/{project_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_member(
    project_id: str,
    user_id: str,
    current_user: dict = Depends(require_manager),
):
    """Remove a user from a project (managers only)."""
    supabase.table("memberships").delete().eq("project_id", project_id).eq("user_id", user_id).execute()
