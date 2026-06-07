export class PersonalInfoDto {
  fullName!: string;
  email!: string;
  phone?: string;
  location?: string;
  title?: string;
  summary?: string;
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

export class ParsedCvDto {
  personalInfo!: PersonalInfoDto;
  experience!: ExperienceDto[];
  education!: EducationDto[];
  skills!: string[];
  fileName!: string;
}
