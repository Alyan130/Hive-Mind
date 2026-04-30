from supabase import create_client, Client
from app.config import settings

# Service client — bypasses RLS, used for all backend operations
supabase: Client = create_client(settings.supabase_url, settings.supabase_service_key)
