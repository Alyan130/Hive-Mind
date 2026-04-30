// ─── Auth ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'employee';
  created_at?: string;
  initials?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ─── Projects ────────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
}

export interface ProjectCreate {
  name: string;
  description?: string;
}

// ─── Members ─────────────────────────────────────────────────────────────────
export interface Member {
  user_id: string;
  name: string;
  email: string;
  role: 'manager' | 'employee';
  added_at?: string;
  initials?: string;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  id?: string;
  role_type: 'user' | 'assistant';
  role?: string;
  content: string;
  created_at?: string;
  // local-only fields for display
  senderName?: string;
  ts?: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
  user_name: string;
  user_role: string;
}

// ─── Agents ───────────────────────────────────────────────────────────────────
export type AgentType = 'decisions' | 'ideas' | 'actions' | 'risks';

export interface AgentResult {
  items: string[];
  generatedAt: string; // ISO timestamp
}
