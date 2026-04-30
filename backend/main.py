from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, projects, chat, users, agents

app = FastAPI(
    title="Project Manager AI",
    description="AI-powered project chatbot for managers and employees",
    version="1.0.0",
)

# ─── CORS ────────────────────────────────────────────────────────────────────
# Allow all origins for now — restrict to your frontend domain in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(chat.router)
app.include_router(users.router)
app.include_router(agents.router)


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "Project Manager AI API is running"}
