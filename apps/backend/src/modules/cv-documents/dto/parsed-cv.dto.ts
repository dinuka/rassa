export class LinkDto {
  name!: string;
  href!: string;
}

export class PersonalInfoDto {
  fullName!: string;
  email!: string;
  phone?: string;
  location?: string;
  title?: string;
  summary?: string;
  links?: LinkDto[];
}

export class ExperienceDto {
  id!: string;
  company!: string;
  title!: string;
  location?: string;
  startDate!: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  highlights!: string[];
}

export class EducationDto {
  id!: string;
  institution!: string;
  degree!: string;
  field!: string;
  startDate!: string;
  endDate?: string;
  gpa?: string;
}

export class ProjectDto {
  id!: string;
  name!: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  technologies?: string[];
}

export class CertificationDto {
  id!: string;
  name!: string;
  issuer?: string;
  date?: string;
}

export class ParsedCvDto {
  personalInfo!: PersonalInfoDto;
  experience!: ExperienceDto[];
  education!: EducationDto[];
  skills!: string[];
  projects?: ProjectDto[];
  certifications?: CertificationDto[];
  extraCurricular?: string[];
  fileName!: string;
}
