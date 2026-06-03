from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongodb_uri: str = Field(..., validation_alias="MONGODB_URI")
    qdrant_host: str = Field("localhost", validation_alias="QDRANT_HOST")
    qdrant_port: int = Field(6333, validation_alias="QDRANT_PORT")
    anthropic_api_key: str | None = Field(None, validation_alias="ANTHROPIC_API_KEY")
    openai_api_key: str | None = Field(None, validation_alias="OPENAI_API_KEY")
    gemini_api_key: str | None = Field(None, validation_alias="GEMINI_API_KEY")
    ollama_base_url: str = Field("http://localhost:11434/v1", validation_alias="OLLAMA_BASE_URL")
    port: int = Field(8000, validation_alias="PORT")

    model_config = {"env_file": "../../.env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()
