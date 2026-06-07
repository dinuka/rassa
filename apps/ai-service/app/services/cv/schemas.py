from pydantic import BaseModel

from app.schemas.cv import Education, Experience, PersonalInfo


class CvData(BaseModel):
    personalInfo: PersonalInfo  # noqa: N815
    experience: list[Experience] = []
    education: list[Education] = []
    skills: list[str] = []
