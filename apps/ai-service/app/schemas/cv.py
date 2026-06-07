from uuid import uuid4

from pydantic import BaseModel, ConfigDict, Field


class Link(BaseModel):
    name: str
    href: str


class PersonalInfo(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    fullName: str = ""  # noqa: N815
    email: str = ""
    phone: str | None = None
    location: str | None = None
    title: str | None = None
    summary: str | None = None
    links: list[Link] = []


class Experience(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(default_factory=lambda: str(uuid4()))
    company: str
    title: str
    location: str | None = None
    startDate: str | None = None  # noqa: N815
    endDate: str | None = None  # noqa: N815
    current: bool | None = None
    description: str | None = None
    highlights: list[str] = []


class Education(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(default_factory=lambda: str(uuid4()))
    institution: str
    degree: str
    field: str
    startDate: str | None = None  # noqa: N815
    endDate: str | None = None  # noqa: N815
    gpa: str | None = None


class Project(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    role: str | None = None
    startDate: str | None = None  # noqa: N815
    endDate: str | None = None  # noqa: N815
    current: bool | None = None
    description: str | None = None
    technologies: list[str] = []


class Certification(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    issuer: str | None = None
    date: str | None = None


class ParsedCvResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    personalInfo: PersonalInfo  # noqa: N815
    experience: list[Experience] = []
    education: list[Education] = []
    skills: list[str] = []
    projects: list[Project] = []
    certifications: list[Certification] = []
    extraCurricular: list[str] = []  # noqa: N815
    fileName: str = ""  # noqa: N815
