from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ─── Auth ────────────────────────────────────────────────────────────────────

class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


# ─── Users ───────────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    id: str
    name: Optional[str]
    email: Optional[str]
    role: str
    created_at: Optional[datetime]


# ─── Projects ────────────────────────────────────────────────────────────────

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectOut(BaseModel):
    id: str
    name: str
    description: Optional[str]
    created_by: Optional[str]
    created_at: Optional[datetime]


# ─── Memberships ─────────────────────────────────────────────────────────────

class AddMemberRequest(BaseModel):
    user_id: str


class MemberOut(BaseModel):
    user_id: str
    name: Optional[str]
    email: Optional[str]
    role: str
    added_at: Optional[datetime]


# ─── Chat ─────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    user_name: str
    user_role: str


class MessageOut(BaseModel):
    role_type: str        # "user" or "assistant"
    role: Optional[str]   # display name
    content: str
    created_at: Optional[datetime]
