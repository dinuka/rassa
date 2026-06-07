import logging

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openrouter import ChatOpenRouter

from app.core.config import settings
from app.schemas.cv import ParsedCvResponse

from .prompts import CV_PARSER_SYSTEM_PROMPT
from .schemas import CvData

logger = logging.getLogger(__name__)

_MAX_CHARS = 12000


async def parse_cv(text: str, file_name: str = "") -> ParsedCvResponse:
    truncated_len = min(len(text), _MAX_CHARS)
    logger.debug(
        "Sending CV text to LLM: filename=%s chars=%d (truncated from %d)", file_name, truncated_len, len(text)
    )

    llm = ChatOpenRouter(  # type: ignore[call-arg]
        model=settings.cv_parser_model,
        api_key=settings.openrouter_api_key,
        temperature=0,
        max_tokens=4096,
    )
    structured = llm.with_structured_output(CvData, method="json_mode")

    result = await structured.ainvoke([
        SystemMessage(content=CV_PARSER_SYSTEM_PROMPT),
        HumanMessage(content=f"Parse this CV:\n\n{text[:_MAX_CHARS]}"),
    ])

    assert isinstance(result, CvData)
    logger.debug(
        "CV parsed: filename=%s skills=%d experience=%d", file_name, len(result.skills), len(result.experience)
    )

    return ParsedCvResponse(**result.model_dump(), fileName=file_name)
