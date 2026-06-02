from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DATABASE_URL: str = "sqlite+aiosqlite:///./business_builder.db"
    OPENAI_API_KEY: str = "mock"
    OPENAI_MODEL: str = "gpt-4o-mini"
    APP_ENV: str = "development"
    FRONTEND_URL: str = "http://localhost:3000"

    @property
    def use_mock(self) -> bool:
        return self.OPENAI_API_KEY in ("mock", "", "your-key-here")

    @property
    def is_sqlite(self) -> bool:
        return self.DATABASE_URL.startswith("sqlite")


settings = Settings()
