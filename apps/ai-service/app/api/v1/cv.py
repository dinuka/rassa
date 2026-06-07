import logging

from fastapi import APIRouter, HTTPException, UploadFile

from app.document_processing.cv_extractor import extract_text
from app.schemas.cv import ParsedCvResponse
from app.services.cv import parse_cv

router = APIRouter()
logger = logging.getLogger(__name__)

_ALLOWED_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
}


@router.post("/analyze", response_model=ParsedCvResponse)
async def analyze_cv(file: UploadFile) -> ParsedCvResponse:
    if file.content_type not in _ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    file_bytes = await file.read()
    logger.debug(
        "CV analyze request received: filename=%s content_type=%s size=%dB",
        file.filename, file.content_type, len(file_bytes),
    )

    if len(file_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File exceeds 10 MB limit")

    try:
        text = extract_text(file_bytes, file.content_type or "")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

    logger.debug("Text extracted: filename=%s chars=%d", file.filename, len(text))

    if not text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from the file")

    result = await parse_cv(text, file.filename or "")
    logger.debug(
        "CV parse complete: filename=%s skills=%d experience=%d",
        file.filename, len(result.skills), len(result.experience),
    )
    return result
