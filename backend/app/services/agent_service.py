import os
from agents import Agent, Runner
from app.config import settings
from app.services.zep_service import get_zep_context, add_messages_to_zep

# Set OpenAI key for the Agents SDK
os.environ["OPENAI_API_KEY"] = settings.openai_api_key


async def run_chat(
    zep_session_id: str,
    project_name: str,
    user_name: str,
    user_role: str,
    message: str,
) -> str:
    """
    Core chat function:
      1. Fetch Zep context (facts + recent history)
      2. Build agent with project context in system prompt
      3. Run agent with recent message history + new user message
      4. Save exchange to Zep
      5. Return AI reply
    """

    # 1. Get memory context from Zep
    context, recent_messages = await get_zep_context(zep_session_id)

    # 2. Build system instructions
    context_section = (
        f"Relevant project context and past decisions:\n{context}"
        if context
        else "No prior context yet — this is the start of the project discussion."
    )

    instructions = f"""You are an AI assistant for the project: "{project_name}".

{context_section}

Your responsibilities:
- Help team members discuss project decisions and next steps
- Answer questions about what was previously decided in this project
- Summarize discussions when asked
- Be concise and professional

The current user is: {user_name} ({user_role})
"""

    # 3. Build message history for conversation continuity (last 10 messages)
    history = []
    for msg in recent_messages[-10:]:
        role = "user" if getattr(msg, "role_type", "") == "user" else "assistant"
        display = getattr(msg, "role", "") or ""
        content = getattr(msg, "content", "")
        # Prefix user messages with their display name
        history.append({
            "role": role,
            "content": f"{display}: {content}" if role == "user" and display else content,
        })

    # Append the current message
    history.append({"role": "user", "content": f"{user_name} ({user_role}): {message}"})

    # 4. Create and run agent
    agent = Agent(
        name="Project Assistant",
        instructions=instructions,
        model="gpt-4o-mini",
    )

    result = await Runner.run(agent, history)
    reply = result.final_output

    # 5. Persist exchange to Zep
    await add_messages_to_zep(
        session_id=zep_session_id,
        user_name=user_name,
        user_role=user_role,
        user_message=message,
        assistant_reply=reply,
    )

    return reply
