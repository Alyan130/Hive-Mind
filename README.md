# Hive Mind

Hive Mind is an AI-powered project management workspace that gives teams a shared project context, persistent AI memory, and specialized agents for analyzing project discussions.

The system combines a project-based collaboration interface with an AI assistant that can remember previous discussions, decisions, and project context. Managers can create projects and manage members, while employees can participate in project conversations and use the AI assistant.

## Overview

Hive Mind is built around the idea that project conversations contain useful information that is often difficult to track manually.

Instead of treating every AI conversation as an isolated interaction, each project has its own persistent memory. Team members can discuss a project with the AI, and the system stores the conversation in Zep so future interactions can use previously extracted context and recent messages.

The platform also provides specialized AI agents that analyze the project's accumulated context to identify:

* Key decisions
* Action items
* Potential risks
* Improvement ideas

## Core Features

### Project-based collaboration

Projects provide an isolated workspace for a team.

Managers can:

* Create projects
* Add members
* Remove members
* Delete projects

Employees can access projects they are members of.

### AI project assistant

Each project has an AI assistant that can:

* Answer questions about the project
* Use previous project context
* Recall earlier discussions and decisions
* Summarize project discussions
* Help with project-related next steps

The assistant receives the current user's name and role so responses can be aware of who is interacting with it.

### Persistent project memory

Zep Cloud provides the memory layer for each project.

Each project gets its own Zep user and thread. Conversations are stored in that thread, allowing the system to retrieve:

* Extracted project context
* Recent conversation history
* Previous decisions and facts

This context is injected into the AI assistant before generating a response.

### Specialized AI agents

Hive Mind includes four specialized agents:

| Agent            | Purpose                                                 |
| ---------------- | ------------------------------------------------------- |
| Decision Tracker | Extracts important decisions from project discussions   |
| Action Items     | Identifies tasks, to-dos, and assignments               |
| Risk Analyzer    | Finds risks, blockers, unresolved debates, and concerns |
| Ideator          | Generates actionable ideas for improving the project    |

These agents analyze the project's Zep context and recent conversation history.

## How It Works

```text
                    ┌─────────────────────┐
                    │     Next.js UI      │
                    │                     │
                    │ Projects / Chat /   │
                    │ Members / Agents    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    FastAPI API      │
                    │                     │
                    │ Auth / Projects /   │
                    │ Chat / Agents       │
                    └───────┬─────┬───────┘
                            │     │
                 ┌──────────┘     └──────────┐
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │    Supabase     │        │    Zep Cloud    │
        │                 │        │                 │
        │ Users           │        │ Project memory  │
        │ Projects        │        │ Context         │
        │ Memberships     │        │ Conversations   │
        │ Auth            │        │                 │
        └─────────────────┘        └────────┬────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │ OpenAI Agents   │
                                   │ SDK             │
                                   │                 │
                                   │ Chat Assistant  │
                                   │ Decision Agent  │
                                   │ Idea Agent      │
                                   │ Action Agent    │
                                   │ Risk Agent      │
                                   └─────────────────┘
```

## AI Architecture

### Project Assistant

When a user sends a message:

1. The API verifies the user's authentication token.
2. The system verifies that the user belongs to the project.
3. The project's Zep thread is retrieved or initialized.
4. Zep provides project context and recent messages.
5. The AI agent receives the project context, recent conversation history, user identity, and new message.
6. The OpenAI Agents SDK runs the project assistant.
7. The user/assistant exchange is saved back to Zep.
8. The generated response is returned to the frontend.

The assistant uses `gpt-4o-mini`.

### Specialized Agents

Specialized agents follow a similar process:

```text
Project
   │
   ▼
Zep Context + Recent Messages
   │
   ▼
Specialized Agent
   │
   ├── Decision Tracker
   ├── Ideator
   ├── Action Items
   └── Risk Analyzer
   │
   ▼
Structured list of results
```

Each specialized agent is instructed to return a JSON array of strings. The backend parses the response and exposes the results through the API.

## Authentication and Authorization

Authentication is handled through Supabase Auth.

The backend validates the Supabase JWT from the `Authorization` header and retrieves the corresponding user profile from the `users` table.

There are two application roles:

* `manager`
* `employee`

Managers have additional permissions for project management operations.

### Manager capabilities

Managers can:

* Create projects
* Add members
* Remove members
* Delete projects

### Employee capabilities

Employees can access projects they belong to and interact with the project AI assistant.

Project membership is checked before accessing project data, chat history, or specialized agents.

## Data Model

The database is implemented with Supabase/PostgreSQL.

The main tables are:

### `users`

Stores application-level user profiles.

```text
id
name
email
role
created_at
```

The `role` field is restricted to:

```text
manager
employee
```

### `projects`

Stores project information.

```text
id
name
description
created_by
created_at
```

### `memberships`

Connects users to projects.

```text
id
project_id
user_id
added_at
```

A unique constraint prevents the same user from being added to a project more than once.

### `zep_sessions`

Stores the relationship between a project and its Zep session.

```text
id
project_id
zep_session_id
created_at
```

Each project has one associated Zep session.

## API

The FastAPI backend exposes the following main API groups.

### Authentication

```text
POST /auth/signup
POST /auth/login
GET  /auth/me
```

### Projects

```text
GET    /projects
POST   /projects
GET    /projects/{project_id}
DELETE /projects/{project_id}
```

### Project Members

```text
GET    /projects/{project_id}/members
POST   /projects/{project_id}/members
DELETE /projects/{project_id}/members/{user_id}
```

### Chat

```text
POST /chat/{project_id}
GET  /chat/{project_id}/history
```

### Specialized Agents

```text
POST /agents/{project_id}/decisions
POST /agents/{project_id}/ideas
POST /agents/{project_id}/actions
POST /agents/{project_id}/risks
```

## Frontend

The frontend is built with Next.js, React, TypeScript, and Zustand.

The main application areas include:

* Login
* Signup
* Dashboard
* Project list
* Project workspace
* Project chat
* Project members
* Specialized AI agent results

The project workspace combines the AI chat with project information and team member management.

### Frontend structure

```text
frontend/
├── api/
│   ├── agents.ts
│   ├── auth.ts
│   ├── chat.ts
│   ├── client.ts
│   ├── projects.ts
│   └── users.ts
│
├── app/
│   ├── dashboard/
│   ├── login/
│   ├── projects/
│   ├── signup/
│   └── page.tsx
│
├── components/
│   ├── agents/
│   ├── auth/
│   ├── chat/
│   ├── layout/
│   ├── members/
│   ├── projects/
│   └── ui/
│
├── store/
│   └── authStore.ts
│
└── types/
    └── index.ts
```

## Backend Structure

```text
backend/
├── app/
│   ├── models/
│   │   └── schemas.py
│   │
│   ├── routers/
│   │   ├── agents.py
│   │   ├── auth.py
│   │   ├── chat.py
│   │   ├── projects.py
│   │   └── users.py
│   │
│   ├── services/
│   │   ├── agent_runners.py
│   │   ├── agent_service.py
│   │   └── zep_service.py
│   │
│   ├── config.py
│   ├── dependencies.py
│   └── supabase_client.py
│
├── main.py
├── requirements.txt
├── schema.sql
├── Dockerfile
└── fly.toml
```

### Service responsibilities

**`agent_service.py`**

Handles the main project AI assistant, including memory retrieval, conversation construction, agent execution, and persistence of new messages.

**`agent_runners.py`**

Contains the specialized Decision, Idea, Action, and Risk agents.

**`zep_service.py`**

Handles Zep users, project threads, conversation storage, context retrieval, and recent message retrieval.

**`dependencies.py`**

Handles authentication and manager-level authorization dependencies.

**`routers/`**

Contains the FastAPI API endpoints for authentication, projects, chat, users, and agents.

## Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Zustand
* Axios
* Tailwind CSS
* Lucide React

### Backend

* Python
* FastAPI
* Uvicorn
* Pydantic Settings
* OpenAI Agents SDK

### AI and Memory

* OpenAI `gpt-4o-mini`
* OpenAI Agents SDK
* Zep Cloud

### Database and Authentication

* Supabase
* PostgreSQL
* Supabase Auth

### Deployment

The repository includes configuration for:

* Docker
* Fly.io

## Environment Variables

The backend provides an `.env.example` containing:

```env
OPENAI_API_KEY=
ZEP_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
```

Create a `.env` file inside `backend/` and provide the required credentials before starting the API.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Alyan130/Hive-Mind.git
cd Hive-Mind
```

### 2. Configure Supabase

Create a Supabase project and configure the required authentication/database services.

Run the SQL in:

```text
backend/schema.sql
```

This creates the application tables and the signup trigger used to create application-level user records.

### 3. Configure the backend

```bash
cd backend
```

Create the environment file:

```bash
cp .env.example .env
```

Fill in the required credentials.

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The API will be available at:

```text
http://localhost:8000
```

### 4. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Next.js application will be available at:

```text
http://localhost:3000
```

## Project Flow

A typical interaction looks like this:

```text
User signs in
     │
     ▼
Dashboard
     │
     ▼
Select Project
     │
     ▼
Project Workspace
     │
     ├───────────────┐
     ▼               ▼
Project Chat     Project Members
     │
     ▼
Zep Memory
     │
     ▼
AI Project Assistant
     │
     ▼
Response stored in Zep
```

For project analysis:

```text
Project Conversation
        │
        ▼
   Zep Context
        │
        ▼
Specialized Agent
        │
   ┌────┼────┬────┐
   ▼    ▼    ▼    ▼
Decisions Ideas Actions Risks
```

## Design Approach

Hive Mind separates the main application responsibilities into distinct layers:

* **Next.js** handles the user interface and client-side state.
* **FastAPI** exposes the application API and authorization logic.
* **Supabase** handles authentication and relational application data.
* **Zep** provides project-level conversational memory.
* **OpenAI Agents SDK** handles AI agent execution.
* **Specialized agents** turn project conversations into structured project insights.

This keeps project data, authentication, memory, and AI orchestration as separate concerns while connecting them through the backend API.

## Current Scope

The current implementation covers:

* User signup and login
* Manager and employee roles
* Project creation and management
* Project membership management
* Project-level AI chat
* Persistent Zep conversation memory
* Project context retrieval
* Decision extraction
* Action-item extraction
* Risk analysis
* Idea generation
* Project dashboard
* Project workspace
* Supabase/PostgreSQL persistence
* Docker and Fly.io configuration

## Author

Built by **Alyan Ali**.

GitHub: [@Alyan130](https://github.com/Alyan130)

## License

No open-source license is currently specified in the repository.
