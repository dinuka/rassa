import logging
import os

from fastapi import FastAPI

from app.api.v1 import cv, evaluation, generation, interview, matching

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
)

_log_level = logging.DEBUG if os.getenv("LOG_LEVEL", "debug").lower() == "debug" else logging.INFO
logging.getLogger("app").setLevel(_log_level)

app = FastAPI(title="AI Service", version="0.1.0")

app.include_router(cv.router, prefix="/api/cv", tags=["cv"])
app.include_router(matching.router, prefix="/api/job", tags=["matching"])
app.include_router(generation.router, prefix="/api/generate", tags=["generation"])
app.include_router(interview.router, prefix="/api/interview", tags=["interview"])
app.include_router(evaluation.router, prefix="/api/application", tags=["evaluation"])


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
