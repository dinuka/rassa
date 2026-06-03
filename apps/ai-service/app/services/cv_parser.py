import json
import logging
import re

from openai import AsyncOpenAI

from app.core.config import settings
from app.schemas.cv import Education, Experience, ParsedCvResponse, PersonalInfo

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = """\
You are a CV parser. Extract information from the CV text and return ONLY valid JSON.
No markdown, no explanation — just the JSON object.

Schema:
{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string or null",
    "location": "string or null",
    "title": "string or null",
    "summary": "string or null"
  },
  "experience": [
    {
      "company": "string",
      "title": "string",
      "location": "string or null",
      "startDate": "YYYY-MM or YYYY",
      "endDate": "YYYY-MM or YYYY or null",
      "current": true or false,
      "description": "string or null",
      "highlights": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "YYYY-MM or YYYY",
      "endDate": "YYYY-MM or YYYY or null",
      "gpa": "string or null"
    }
  ],
  "skills": ["string"]
}

Rules:
- Return ONLY the JSON object.
- Use null for unknown fields.
- skills is a flat list of skill strings.
- Dates in YYYY-MM format when possible.\
"""


async def parse_cv(text: str, file_name: str = "") -> ParsedCvResponse:
    client = AsyncOpenAI(base_url=settings.ollama_base_url, api_key="ollama")

    truncated_len = min(len(text), 12000)
    logger.debug("Sending CV text to LLM: filename=%s chars=%d (truncated from %d)", file_name, truncated_len, len(text))

    response = await client.chat.completions.create(
        model="llama3.2",
        messages=[
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": f"Parse this CV:\n\n{text[:12000]}"},
        ],
        temperature=0,
        max_tokens=4096,
    )

    choice = response.choices[0]
    raw = choice.message.content or ""
    logger.debug(
        "LLM response received: filename=%s response_chars=%d finish_reason=%s",
        file_name, len(raw), choice.finish_reason,
    )
    if choice.finish_reason == "length":
        logger.warning("LLM hit token limit before finishing JSON output: filename=%s", file_name)

    data = _parse_json(raw)
    logger.debug("JSON parsed from LLM response: filename=%s keys=%s", file_name, list(data.keys()))

    return ParsedCvResponse(
        personalInfo=PersonalInfo(**data.get("personalInfo", {})),
        experience=[Experience(**e) for e in data.get("experience", [])],
        education=[Education(**ed) for ed in data.get("education", [])],
        skills=data.get("skills", []),
        fileName=file_name,
    )


def _parse_json(raw: str) -> dict:  # type: ignore[type-arg]
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            logger.warning("Could not parse JSON from LLM response (possibly truncated): raw_chars=%d", len(raw))
    return {}
