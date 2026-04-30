from zep_cloud.client import AsyncZep
from zep_cloud import Message
from app.config import settings

zep = AsyncZep(api_key=settings.zep_api_key)


async def ensure_zep_project(project_id: str, project_name: str) -> str:
    """
    Ensures a Zep user and thread exist for the given project.
    Returns the thread_id (which equals project_id).

    Zep model (v3):
      - One Zep "user"   per project  (user_id   = "project-{project_id}")
      - One Zep "thread" per project  (thread_id = "session-{project_id}")
    """
    zep_user_id = f"project-{project_id}"
    zep_thread_id = f"session-{project_id}"

    # Create Zep user (idempotent — ignore if already exists)
    try:
        await zep.user.add(
            user_id=zep_user_id,
            first_name=project_name,
            last_name="Project",
        )
    except Exception:
        pass  # Already exists

    # Create Zep thread (replaces memory.add_session in v3)
    try:
        await zep.thread.create(
            thread_id=zep_thread_id,
            user_id=zep_user_id,
        )
    except Exception:
        pass  # Already exists

    return zep_thread_id


async def add_messages_to_zep(
    session_id: str,
    user_name: str,
    user_role: str,
    user_message: str,
    assistant_reply: str,
) -> None:
    """Saves a user+assistant exchange to Zep (thread_id = session_id)."""
    await zep.thread.add_messages(
        thread_id=session_id,
        messages=[
            Message(
                role="user",
                name=f"{user_name} ({user_role})",
                content=user_message,
            ),
            Message(
                role="assistant",
                name="AI Assistant",
                content=assistant_reply,
            ),
        ],
    )


async def get_zep_context(session_id: str) -> tuple[str, list]:
    """
    Returns (context_string, recent_messages) from Zep.
    context_string — facts/summary Zep has extracted (injected into agent prompt).
    recent_messages — last messages for conversation continuity.
    """
    try:
        context_response = await zep.thread.get_user_context(thread_id=session_id)
        context = context_response.context if hasattr(context_response, "context") else ""
        context = context or ""

        messages_response = await zep.thread.get(thread_id=session_id, lastn=20)
        messages = messages_response.messages if hasattr(messages_response, "messages") else []
        messages = messages or []

        return context, messages
    except Exception:
        # Thread is brand new — no memory yet
        return "", []
