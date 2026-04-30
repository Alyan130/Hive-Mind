---
name: Project Manager Chatbot - Context
description: Architecture decisions and tech stack for the AI project management chatbot
type: project
---

Project: AI-powered project management chatbot where managers and employees discuss project decisions via a shared chat interface per project.

**Stack:**
- Backend: FastAPI (Python)
- Auth: Supabase Auth (email/password)
- Database: Supabase (supabase-py client, no SQLAlchemy)
- Memory: Zep Cloud (one session per project, shared by all members)
- AI: OpenAI Agents SDK (simple Q&A for now, scalable later)

**Key decisions:**
- No frontend yet — backend first
- No auth initially was considered, but Supabase Auth added for production-readiness
- Default role = employee on signup; manager role set manually in Supabase dashboard
- Users added to projects manually by manager (no self-join)
- One Zep session per project (not per user) — project decisions are shared context
- zep_sessions table maps project_id → zep_session_id

**DB Tables:** users, projects, memberships, zep_sessions

**Why:** Per-project Zep sessions allow all members to share the same AI memory/context for that project's decision
