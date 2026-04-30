-- ============================================================
-- 1. USERS
-- Mirrors auth.users. Auto-populated via trigger on signup.
-- ============================================================
CREATE TABLE public.users (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name        TEXT,
    email       TEXT,
    role        TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('manager', 'employee')),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. TRIGGER — auto-insert into users on Supabase Auth signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. PROJECTS
-- ============================================================
CREATE TABLE public.projects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    description TEXT,
    created_by  UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. MEMBERSHIPS
-- Tracks which users belong to which project.
-- Only managers can add members (enforced at API level).
-- ============================================================
CREATE TABLE public.memberships (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    added_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (project_id, user_id)
);

-- ============================================================
-- 5. ZEP SESSIONS
-- Maps each project to its Zep Cloud session ID.
-- One session per project — shared by all members.
-- ============================================================
CREATE TABLE public.zep_sessions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id     UUID NOT NULL UNIQUE REFERENCES public.projects(id) ON DELETE CASCADE,
    zep_session_id TEXT NOT NULL,
    created_at     TIMESTAMPTZ DEFAULT NOW()
);
