from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str
    zep_api_key: str
    supabase_url: str
    supabase_anon_key: str
    supabase_service_key: str

    model_config = {"env_file": ".env"}


settings = Settings()
