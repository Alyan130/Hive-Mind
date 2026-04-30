import os
from agents import Agent, Runner
from app.config import settings
from app.services.zep_service import get_zep_context

os.environ["OPENAI_API_KEY"] = settings.openai_api_key

AGENT_PROMPTS = {
    "decisions": {
        "name": "Decision Tracker",
        "instructions": (
            "You are a Decision Tracker agent for a project management system.\n"
            "Given the project context and conversation history below, extract all key decisions "
            "that have been made. Each decision should be a clear, concise sentence.\n"
            "Return ONLY a JSON array of strings, no markdown, no explanation.\n"
            'Example: ["Team decided to use PostgreSQL for the database.", "Launch date set to Q2 2025."]\n'
            "If no decisions are found, return an empty array: []"
        ),
    },
    "ideas": {
        "name": "Ideator",
        "instructions": (
            "You are an Ideator agent for a project management system.\n"
            "Given the project context and conversation history below, generate actionable improvement "
            "ideas to make this project better. Be creative but grounded in what's been discussed.\n"
            "Return ONLY a JSON array of strings, no markdown, no explanation.\n"
            'Example: ["Add automated testing to reduce manual QA time.", "Consider a caching layer for API responses."]\n'
            "Provide 3–6 ideas. If context is insufficient, return general best practices for the project type."
        ),
    },
    "actions": {
        "name": "Action Items",
        "instructions": (
            "You are an Action Items agent for a project management system.\n"
            "Given the project context and conversation history below, extract all tasks, "
            "to-dos, and assignments mentioned. Each item should be a clear action statement.\n"
            "Return ONLY a JSON array of strings, no markdown, no explanation.\n"
            'Example: ["Set up CI/CD pipeline (assigned to DevOps team).", "Write API documentation by Friday."]\n'
            "If no action items are found, return an empty array: []"
        ),
    },
    "risks": {
        "name": "Risk Analyzer",
        "instructions": (
            "You are a Risk Analyzer agent for a project management system.\n"
            "Given the project context and conversation history below, identify potential risks, "
            "blockers, unresolved debates, and concerns that were raised.\n"
            "Return ONLY a JSON array of strings, no markdown, no explanation.\n"
            'Example: ["Deadline may be too tight given current team capacity.", "No consensus on authentication approach yet."]\n'
            "If no risks are found, return an empty array: []"
        ),
    },
}


async def run_agent(agent_type: str, project_name: str, zep_session_id: str) -> list[str]:
    """
    Runs a specialized analysis agent against the project's Zep conversation context.
    Returns a list of string items (decisions / ideas / actions / risks).
    """
    config = AGENT_PROMPTS.get(agent_type)
    if not config:
        return []

    # Fetch Zep context (facts + recent messages)
    context, recent_messages = await get_zep_context(zep_session_id)

    context_section = (
        f"Project context and extracted facts:\n{context}"
        if context
        else "No prior context extracted yet."
    )

    # Build recent message history as plain text for analysis
    message_history = ""
    for msg in recent_messages[-50:]:
        role_label = getattr(msg, "name", None) or getattr(msg, "role", "unknown")
        content = getattr(msg, "content", "")
        message_history += f"{role_label}: {content}\n"

    prompt = (
        f"Project name: {project_name}\n\n"
        f"{context_section}\n\n"
        f"Recent conversation:\n{message_history or 'No messages yet.'}"
    )

    agent = Agent(
        name=config["name"],
        instructions=config["instructions"],
        model="gpt-4o-mini",
    )

    result = await Runner.run(agent, prompt)
    raw = result.final_output.strip()

    # Parse JSON array from response
    import json
    try:
        # Strip markdown code fences if model adds them
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        items = json.loads(raw)
        return [str(i) for i in items] if isinstance(items, list) else []
    except (json.JSONDecodeError, Exception):
        # Fallback: split by newlines if not valid JSON
        lines = [l.strip().lstrip("-•* ") for l in raw.split("\n") if l.strip()]
        return lines
