"use client";

import { useImperativeHandle, useRef, useState } from "react";

import { Award, Briefcase, GraduationCap, Plus, Rocket, Star, User, Wrench, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import type { CV, Certification, Education, Experience, Project } from "@repo/shared-types";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from "@repo/ui";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const selectClass =
  "border-input bg-background text-foreground focus-visible:ring-ring h-9 w-full rounded-lg border px-3 py-1 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

const MonthYearPicker = ({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) => {
  const [savedYear, savedMonth] = value ? value.split("-") : ["", ""];
  const [year, setYear] = useState(savedYear);
  const [month, setMonth] = useState(savedMonth);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const handleMonthChange = (m: string) => {
    setMonth(m);
    if (year && m) onChange(`${year}-${m}`);
  };

  const handleYearChange = (y: string) => {
    setYear(y);
    if (y && month) onChange(`${y}-${month}`);
  };

  return (
    <div className="flex gap-2">
      <select
        className={selectClass}
        value={month}
        disabled={disabled}
        onChange={(e) => handleMonthChange(e.target.value)}
      >
        <option value="">Month</option>
        {MONTHS.map((name, i) => {
          const val = String(i + 1).padStart(2, "0");
          return (
            <option key={val} value={val}>
              {name}
            </option>
          );
        })}
      </select>
      <select
        className={selectClass}
        value={year}
        disabled={disabled}
        onChange={(e) => handleYearChange(e.target.value)}
      >
        <option value="">Year</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
};

export interface CVFormStepHandle {
  validate: () => boolean;
}

interface CVFormStepProps {
  ref?: React.Ref<CVFormStepHandle>;
  initialData: Partial<CV> | undefined;
  onUpdate: (data: Partial<CV>) => void;
  onNext: () => void;
  user: {
    name?: string;
    email?: string;
  };
}

const validateRequired = (v: string, label: string) =>
  v.trim() ? undefined : `${label} is required`;

const validateEmail = (v: string) => {
  if (!v.trim()) return "Email is required";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? undefined : "Must be a valid email address";
};

const validatePhone = (v: string) => {
  if (!v) return undefined;
  const digits = v.replace(/[\s\-().]/g, "");
  return /^\+?[1-9]\d{6,14}$/.test(digits) ? undefined : "Must be a valid phone number";
};

const validateUrl = (v: string) => {
  if (!v.trim()) return "URL is required";
  try {
    new URL(v.trim());
    return undefined;
  } catch {
    return "Must be a valid URL (include https://)";
  }
};

type PersonalInfoErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
  links?: Record<number, { name?: string; href?: string }>;
  linkInput?: { name?: string; href?: string };
};

const PersonalInfoForm = ({
  data,
  onChange,
  errors,
  onErrorsChange,
  linkInput,
  onLinkInputChange,
}: {
  data?: CV["personalInfo"];
  onChange: (data: CV["personalInfo"]) => void;
  errors: PersonalInfoErrors;
  onErrorsChange: (errors: PersonalInfoErrors) => void;
  linkInput: { name: string; href: string };
  onLinkInputChange: (v: { name: string; href: string }) => void;
}) => {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value } as CV["personalInfo"]);
  };

  const links = data?.links ?? [];

  const setLinkError = (patch: { name?: string; href?: string } | undefined) => {
    onErrorsChange({ ...errors, linkInput: patch });
  };

  const addLink = () => {
    const nameErr = validateRequired(linkInput.name, "Label");
    const hrefErr = validateUrl(linkInput.href);
    if (nameErr || hrefErr) {
      setLinkError({ name: nameErr, href: hrefErr });
      return;
    }
    setLinkError(undefined);
    onChange({
      ...data,
      links: [...links, { name: linkInput.name.trim(), href: linkInput.href.trim() }],
    } as CV["personalInfo"]);
    onLinkInputChange({ name: "", href: "" });
  };

  const removeLink = (index: number) => {
    const updatedLinkErrors = { ...errors.links };
    delete updatedLinkErrors[index];
    onChange({ ...data, links: links.filter((_, i) => i !== index) } as CV["personalInfo"]);
    onErrorsChange({ ...errors, links: updatedLinkErrors });
  };

  const updateSavedLink = (index: number, field: "name" | "href", value: string) => {
    const updated = links.map((l, i) => (i === index ? { ...l, [field]: value } : l));
    onChange({ ...data, links: updated } as CV["personalInfo"]);
  };

  const validateSavedLink = (index: number, field: "name" | "href", value: string) => {
    const err = field === "name" ? validateRequired(value, "Label") : validateUrl(value);
    const linkErrors = { ...errors.links, [index]: { ...errors.links?.[index], [field]: err } };
    onErrorsChange({ ...errors, links: linkErrors });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-foreground text-sm font-medium">
            Full Name <span className="text-destructive">*</span>
          </label>
          <Input
            value={data?.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            onBlur={(e) =>
              onErrorsChange({ ...errors, fullName: validateRequired(e.target.value, "Full Name") })
            }
            placeholder="John Doe"
          />
          {errors.fullName && <p className="text-destructive mt-1 text-xs">{errors.fullName}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-foreground text-sm font-medium">Professional Title</label>
          <Input
            value={data?.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Senior Software Engineer"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-foreground text-sm font-medium">
            Email <span className="text-destructive">*</span>
          </label>
          <Input
            type="email"
            value={data?.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={(e) => onErrorsChange({ ...errors, email: validateEmail(e.target.value) })}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-destructive mt-1 text-xs">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-foreground text-sm font-medium">Phone</label>
          <Input
            value={data?.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            onBlur={(e) => onErrorsChange({ ...errors, phone: validatePhone(e.target.value) })}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && <p className="text-destructive mt-1 text-xs">{errors.phone}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-foreground text-sm font-medium">Location</label>
        <Input
          value={data?.location || ""}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="San Francisco, CA"
        />
      </div>

      <div className="space-y-2">
        <label className="text-foreground text-sm font-medium">Professional Summary</label>
        <textarea
          value={data?.summary || ""}
          onChange={(e) => handleChange("summary", e.target.value)}
          placeholder="Brief summary of your professional background and career objectives..."
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[120px] w-full resize-none rounded-lg border px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-foreground text-sm font-medium">Links</label>
        {links.map((link, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-32 shrink-0">
                <Input
                  value={link.name}
                  onChange={(e) => updateSavedLink(index, "name", e.target.value)}
                  onBlur={(e) => validateSavedLink(index, "name", e.target.value)}
                  placeholder="LinkedIn"
                />
                {errors.links?.[index]?.name && (
                  <p className="text-destructive mt-1 text-xs">{errors.links[index].name}</p>
                )}
              </div>
              <div className="flex-1">
                <Input
                  value={link.href}
                  onChange={(e) => updateSavedLink(index, "href", e.target.value)}
                  onBlur={(e) => validateSavedLink(index, "href", e.target.value)}
                  placeholder="https://..."
                />
                {errors.links?.[index]?.href && (
                  <p className="text-destructive mt-1 text-xs">{errors.links[index].href}</p>
                )}
              </div>
              <button
                onClick={() => removeLink(index)}
                className="text-muted-foreground hover:text-destructive shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        <div className="space-y-1">
          <div className="flex gap-2">
            <div className="w-32 shrink-0">
              <Input
                value={linkInput.name}
                onChange={(e) => {
                  onLinkInputChange({ ...linkInput, name: e.target.value });
                  if (errors.linkInput?.name)
                    setLinkError({ ...errors.linkInput, name: undefined });
                }}
                placeholder="LinkedIn"
              />
              {errors.linkInput?.name && (
                <p className="text-destructive mt-1 text-xs">{errors.linkInput.name}</p>
              )}
            </div>
            <div className="flex-1">
              <Input
                value={linkInput.href}
                onChange={(e) => {
                  onLinkInputChange({ ...linkInput, href: e.target.value });
                  if (errors.linkInput?.href)
                    setLinkError({ ...errors.linkInput, href: undefined });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addLink();
                  }
                }}
                placeholder="https://linkedin.com/in/..."
              />
              {errors.linkInput?.href && (
                <p className="text-destructive mt-1 text-xs">{errors.linkInput.href}</p>
              )}
            </div>
            <Button variant="outline" size="icon" onClick={addLink} className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExperienceForm = ({
  data,
  onChange,
}: {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}) => {
  const addExperience = () => {
    onChange([
      ...data,
      {
        id: uuidv4(),
        company: "",
        title: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        highlights: [],
      },
    ]);
  };

  const updateExperience = (index: number, updates: Partial<Experience>) => {
    const newData = [...data];
    newData[index] = { ...newData[index], ...updates };
    onChange(newData);
  };

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const addHighlight = (expIndex: number) => {
    const existing = data[expIndex].highlights ?? [];
    if (existing.some((h) => !h.trim())) return;
    updateExperience(expIndex, { highlights: [...existing, ""] });
  };

  const updateHighlight = (expIndex: number, hIndex: number, value: string) => {
    const highlights = [...(data[expIndex].highlights ?? [])];
    highlights[hIndex] = value;
    updateExperience(expIndex, { highlights });
  };

  const removeHighlight = (expIndex: number, hIndex: number) => {
    const highlights = (data[expIndex].highlights ?? []).filter((_, i) => i !== hIndex);
    updateExperience(expIndex, { highlights });
  };

  const lastExp = data.length > 0 ? data[data.length - 1] : null;
  const canAddExperience =
    !lastExp ||
    (lastExp.company.trim() !== "" &&
      lastExp.title.trim() !== "" &&
      lastExp.startDate.trim() !== "");

  return (
    <div className="space-y-6">
      {data.map((exp, index) => (
        <div key={exp.id} className="border-border relative space-y-4 rounded-lg border p-4">
          <button
            onClick={() => removeExperience(index)}
            className="text-muted-foreground hover:text-destructive absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">
                Company <span className="text-destructive">*</span>
              </label>
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(index, { company: e.target.value })}
                placeholder="Company Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">
                Job Title <span className="text-destructive">*</span>
              </label>
              <Input
                value={exp.title}
                onChange={(e) => updateExperience(index, { title: e.target.value })}
                placeholder="Software Engineer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Location</label>
            <Input
              value={exp.location || ""}
              onChange={(e) => updateExperience(index, { location: e.target.value })}
              placeholder="e.g. London, UK"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">
                Start Date <span className="text-destructive">*</span>
              </label>
              <MonthYearPicker
                value={exp.startDate || ""}
                onChange={(v) => updateExperience(index, { startDate: v })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">End Date</label>
              <MonthYearPicker
                value={exp.endDate || ""}
                onChange={(v) => updateExperience(index, { endDate: v })}
                disabled={exp.current}
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) =>
                    updateExperience(index, { current: e.target.checked, endDate: "" })
                  }
                  className="border-input rounded"
                />
                <span className="text-foreground text-sm">Current</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Description</label>
            <textarea
              value={exp.description || ""}
              onChange={(e) => updateExperience(index, { description: e.target.value })}
              placeholder="Describe your responsibilities and achievements..."
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full resize-none rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Key Highlights</label>
            {exp.highlights?.map((highlight, hIndex) => (
              <div key={hIndex} className="flex items-center gap-2">
                <span className="text-primary text-sm">•</span>
                <Input
                  value={highlight}
                  onChange={(e) => updateHighlight(index, hIndex, e.target.value)}
                  placeholder="e.g. Reduced deployment time by 40%"
                />
                <button
                  onClick={() => removeHighlight(index, hIndex)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addHighlight(index)}
              disabled={(exp.highlights ?? []).some((h) => !h.trim())}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Highlight
            </Button>
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={addExperience}
        disabled={!canAddExperience}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Experience
      </Button>
    </div>
  );
};

const EducationForm = ({
  data,
  onChange,
}: {
  data: Education[];
  onChange: (data: Education[]) => void;
}) => {
  const addEducation = () => {
    onChange([
      ...data,
      {
        id: uuidv4(),
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        gpa: "",
      },
    ]);
  };

  const updateEducation = (index: number, updates: Partial<Education>) => {
    const newData = [...data];
    newData[index] = { ...newData[index], ...updates };
    onChange(newData);
  };

  const removeEducation = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {data.map((edu, index) => (
        <div key={edu.id} className="border-border relative space-y-4 rounded-lg border p-4">
          <button
            onClick={() => removeEducation(index)}
            className="text-muted-foreground hover:text-destructive absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Institution</label>
            <Input
              value={edu.institution}
              onChange={(e) => updateEducation(index, { institution: e.target.value })}
              placeholder="University Name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Degree</label>
            <Input
              value={edu.degree}
              onChange={(e) => updateEducation(index, { degree: e.target.value })}
              placeholder="Bachelor of Science"
            />
          </div>

          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Field of Study</label>
            <Input
              value={edu.field}
              onChange={(e) => updateEducation(index, { field: e.target.value })}
              placeholder="Computer Science"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">Start Year</label>
              <Input
                type="number"
                value={edu.startDate || ""}
                onChange={(e) => updateEducation(index, { startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">End Year</label>
              <Input
                type="number"
                value={edu.endDate || ""}
                onChange={(e) => updateEducation(index, { endDate: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addEducation} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Education
      </Button>
    </div>
  );
};

const SkillsForm = ({ data, onChange }: { data: string[]; onChange: (data: string[]) => void }) => {
  const [inputValue, setInputValue] = useState("");

  const addSkill = () => {
    if (inputValue.trim() && !data.includes(inputValue.trim())) {
      onChange([...data, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeSkill = (skill: string) => {
    onChange(data.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const suggestedSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "SQL",
    "Git",
    "Agile",
  ].filter((skill) => !data.includes(skill));

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter"
          className="flex-1"
        />
        <Button onClick={addSkill} disabled={!inputValue.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {data.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1 py-1.5 pr-2 pl-3">
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="text-muted-foreground hover:text-foreground ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {suggestedSkills.length > 0 && (
        <div>
          <p className="text-muted-foreground mb-2 text-sm">Suggested skills:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.slice(0, 6).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="hover:bg-muted cursor-pointer"
                onClick={() => onChange([...data, skill])}
              >
                <Plus className="mr-1 h-3 w-3" />
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProjectsForm = ({
  data,
  onChange,
}: {
  data: Project[];
  onChange: (data: Project[]) => void;
}) => {
  const [techInput, setTechInput] = useState<Record<number, string>>({});

  const addProject = () => {
    onChange([
      ...data,
      {
        id: uuidv4(),
        name: "",
        role: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        technologies: [],
      },
    ]);
  };

  const update = (index: number, updates: Partial<Project>) => {
    const newData = [...data];
    newData[index] = { ...newData[index], ...updates };
    onChange(newData);
  };

  const addTech = (index: number) => {
    const val = techInput[index]?.trim();
    if (val && !(data[index].technologies ?? []).includes(val)) {
      update(index, { technologies: [...(data[index].technologies ?? []), val] });
      setTechInput((p) => ({ ...p, [index]: "" }));
    }
  };

  const removeTech = (projIndex: number, tech: string) => {
    update(projIndex, {
      technologies: (data[projIndex].technologies ?? []).filter((t) => t !== tech),
    });
  };

  return (
    <div className="space-y-6">
      {data.map((proj, index) => (
        <div key={proj.id} className="border-border relative space-y-4 rounded-lg border p-4">
          <button
            onClick={() => onChange(data.filter((_, i) => i !== index))}
            className="text-muted-foreground hover:text-destructive absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">Project Name</label>
              <Input
                value={proj.name}
                onChange={(e) => update(index, { name: e.target.value })}
                placeholder="My Project"
              />
            </div>
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">Your Role</label>
              <Input
                value={proj.role || ""}
                onChange={(e) => update(index, { role: e.target.value })}
                placeholder="Lead Developer"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">Start Date</label>
              <MonthYearPicker
                value={proj.startDate || ""}
                onChange={(v) => update(index, { startDate: v })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">End Date</label>
              <MonthYearPicker
                value={proj.endDate || ""}
                onChange={(v) => update(index, { endDate: v })}
                disabled={proj.current}
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={proj.current ?? false}
                  onChange={(e) => update(index, { current: e.target.checked, endDate: "" })}
                  className="border-input rounded"
                />
                <span className="text-foreground text-sm">Ongoing</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Description</label>
            <textarea
              value={proj.description || ""}
              onChange={(e) => update(index, { description: e.target.value })}
              placeholder="What this project involved and what you achieved..."
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full resize-none rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Technologies</label>
            <div className="flex flex-wrap gap-2">
              {(proj.technologies ?? []).map((tech) => (
                <Badge key={tech} variant="secondary" className="gap-1 py-1.5 pr-2 pl-3">
                  {tech}
                  <button
                    onClick={() => removeTech(index, tech)}
                    className="text-muted-foreground hover:text-foreground ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={techInput[index] || ""}
                onChange={(e) => setTechInput((p) => ({ ...p, [index]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTech(index);
                  }
                }}
                placeholder="React, Node.js, ..."
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => addTech(index)}
                disabled={!techInput[index]?.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addProject} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Project
      </Button>
    </div>
  );
};

const CertificationsForm = ({
  data,
  onChange,
}: {
  data: Certification[];
  onChange: (data: Certification[]) => void;
}) => {
  const addCertification = () => {
    onChange([...data, { id: uuidv4(), name: "", issuer: "", date: "" }]);
  };

  const update = (index: number, updates: Partial<Certification>) => {
    const newData = [...data];
    newData[index] = { ...newData[index], ...updates };
    onChange(newData);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      {data.map((cert, index) => (
        <div key={cert.id} className="border-border relative space-y-4 rounded-lg border p-4">
          <button
            onClick={() => onChange(data.filter((_, i) => i !== index))}
            className="text-muted-foreground hover:text-destructive absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">Certification Name</label>
              <Input
                value={cert.name}
                onChange={(e) => update(index, { name: e.target.value })}
                placeholder="AWS Certified Solutions Architect"
              />
            </div>
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">Issuing Organisation</label>
              <Input
                value={cert.issuer || ""}
                onChange={(e) => update(index, { issuer: e.target.value })}
                placeholder="Amazon Web Services"
              />
            </div>
          </div>

          <div className="w-48 space-y-2">
            <label className="text-foreground text-sm font-medium">Date Issued</label>
            <select
              className={selectClass}
              value={cert.date || ""}
              onChange={(e) => update(index, { date: e.target.value })}
            >
              <option value="">Year</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addCertification} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Certification
      </Button>
    </div>
  );
};

const ExtraCurricularForm = ({
  data,
  onChange,
}: {
  data: string[];
  onChange: (data: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  const add = () => {
    if (inputValue.trim() && !data.includes(inputValue.trim())) {
      onChange([...data, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Member of Chess Club, Volunteer at local shelter"
          className="flex-1"
        />
        <Button onClick={add} disabled={!inputValue.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {data.length > 0 && (
        <div className="space-y-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="border-border flex items-center gap-2 rounded-lg border px-3 py-2"
            >
              <Star className="text-muted-foreground h-3 w-3 shrink-0" />
              <span className="flex-1 text-sm">{item}</span>
              <button
                onClick={() => onChange(data.filter((_, i) => i !== index))}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CVFormStep = ({ ref, initialData, onUpdate, onNext: _onNext, user }: CVFormStepProps) => {
  const [activeSection, setActiveSection] = useState<
    | "personal"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "certifications"
    | "extraCurricular"
  >("personal");
  const [personalInfoErrors, setPersonalInfoErrors] = useState<PersonalInfoErrors>({});
  const [linkInput, setLinkInput] = useState({ name: "", href: "" });
  const [formData, setFormData] = useState<Partial<CV>>(
    initialData || {
      personalInfo: {
        fullName: user.name || "",
        email: user.email || "",
        phone: "",
        location: "",
        title: "",
        summary: "",
        links: [],
      },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      extraCurricular: [],
    },
  );

  const updateFormData = (updates: Partial<CV>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    onUpdate(newData);
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      const fullNameError = validateRequired(formData.personalInfo?.fullName ?? "", "Full Name");
      const emailError = validateEmail(formData.personalInfo?.email ?? "");
      const phoneError = validatePhone(formData.personalInfo?.phone ?? "");

      const links = formData.personalInfo?.links ?? [];
      const linkErrors: Record<number, { name?: string; href?: string }> = {};
      links.forEach((link, i) => {
        const nameErr = validateRequired(link.name, "Label");
        const hrefErr = validateUrl(link.href);
        if (nameErr || hrefErr) linkErrors[i] = { name: nameErr, href: hrefErr };
      });

      const pendingFilled = linkInput.name.trim() || linkInput.href.trim();
      const linkInputErrors = pendingFilled
        ? { name: validateRequired(linkInput.name, "Label"), href: validateUrl(linkInput.href) }
        : undefined;
      const hasLinkInputError = !!(linkInputErrors?.name || linkInputErrors?.href);

      const newErrors: PersonalInfoErrors = {
        fullName: fullNameError,
        email: emailError,
        phone: phoneError,
        links: Object.keys(linkErrors).length ? linkErrors : undefined,
        linkInput: linkInputErrors,
      };
      setPersonalInfoErrors(newErrors);

      const hasErrors =
        !!fullNameError ||
        !!emailError ||
        !!phoneError ||
        Object.keys(linkErrors).length > 0 ||
        hasLinkInputError;
      if (hasErrors) setActiveSection("personal");
      return !hasErrors;
    },
  }));

  const sections = [
    { id: "personal" as const, name: "Personal Info", icon: User },
    { id: "experience" as const, name: "Experience", icon: Briefcase },
    { id: "education" as const, name: "Education", icon: GraduationCap },
    { id: "skills" as const, name: "Skills", icon: Wrench },
    { id: "projects" as const, name: "Projects", icon: Rocket },
    { id: "certifications" as const, name: "Certifications", icon: Award },
    { id: "extraCurricular" as const, name: "Extra-Curricular", icon: Star },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <div className="md:col-span-1">
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                activeSection === section.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <section.icon className="h-4 w-4" />
              {section.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>{sections.find((s) => s.id === activeSection)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {activeSection === "personal" && (
              <PersonalInfoForm
                data={formData.personalInfo}
                onChange={(personalInfo) => updateFormData({ personalInfo })}
                errors={personalInfoErrors}
                onErrorsChange={setPersonalInfoErrors}
                linkInput={linkInput}
                onLinkInputChange={setLinkInput}
              />
            )}
            {activeSection === "experience" && (
              <ExperienceForm
                data={formData.experience || []}
                onChange={(experience) => updateFormData({ experience })}
              />
            )}
            {activeSection === "education" && (
              <EducationForm
                data={formData.education || []}
                onChange={(education) => updateFormData({ education })}
              />
            )}
            {activeSection === "skills" && (
              <SkillsForm
                data={formData.skills || []}
                onChange={(skills) => updateFormData({ skills })}
              />
            )}
            {activeSection === "projects" && (
              <ProjectsForm
                data={formData.projects || []}
                onChange={(projects) => updateFormData({ projects })}
              />
            )}
            {activeSection === "certifications" && (
              <CertificationsForm
                data={formData.certifications || []}
                onChange={(certifications) => updateFormData({ certifications })}
              />
            )}
            {activeSection === "extraCurricular" && (
              <ExtraCurricularForm
                data={formData.extraCurricular || []}
                onChange={(extraCurricular) => updateFormData({ extraCurricular })}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CVFormStep;
