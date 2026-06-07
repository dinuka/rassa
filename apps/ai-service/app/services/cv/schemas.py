from pydantic import BaseModel

from app.schemas.cv import Certification, Education, Experience, PersonalInfo, Project


class CvData(BaseModel):
    personalInfo: PersonalInfo  # noqa: N815
    experience: list[Experience] = []
    education: list[Education] = []
    skills: list[str] = []
    projects: list[Project] = []
    certifications: list[Certification] = []
    extraCurricular: list[str] = []  # noqa: N815
