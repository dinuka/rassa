import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from "class-validator";

export class SaveLinkDto {
  @IsString()
  name!: string;

  @IsUrl()
  href!: string;
}

export class SavePersonalInfoDto {
  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveLinkDto)
  links?: SaveLinkDto[];
}

export class SaveExperienceDto {
  @IsString()
  id!: string;

  @IsString()
  company!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  startDate!: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  current?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];
}

export class SaveEducationDto {
  @IsString()
  id!: string;

  @IsString()
  institution!: string;

  @IsString()
  degree!: string;

  @IsString()
  field!: string;

  @IsString()
  startDate!: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  gpa?: string;
}

export class SaveProjectDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  current?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];
}

export class SaveCertificationDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsString()
  date?: string;
}

export class SaveProfileDto {
  @ValidateNested()
  @Type(() => SavePersonalInfoDto)
  personalInfo!: SavePersonalInfoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveExperienceDto)
  experience!: SaveExperienceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveEducationDto)
  education!: SaveEducationDto[];

  @IsArray()
  @IsString({ each: true })
  skills!: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveProjectDto)
  projects?: SaveProjectDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveCertificationDto)
  certifications?: SaveCertificationDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  extraCurricular?: string[];
}
