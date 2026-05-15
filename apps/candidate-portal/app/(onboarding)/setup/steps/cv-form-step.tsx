"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from "@repo/ui";
import { Plus, X, Briefcase, GraduationCap, User, Wrench } from "lucide-react";
import type { CV, Experience, Education } from "@repo/shared-types";

interface CVFormStepProps {
  initialData: Partial<CV> | null;
  onUpdate: (data: Partial<CV>) => void;
  onNext: () => void;
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function CVFormStep({ initialData, onUpdate, onNext, user }: CVFormStepProps) {
  const [activeSection, setActiveSection] = useState<"personal" | "experience" | "education" | "skills">("personal");
  const [formData, setFormData] = useState<Partial<CV>>(
    initialData || {
      personalInfo: {
        fullName: user.name || "",
        email: user.email || "",
        phone: "",
        location: "",
        title: "",
        summary: "",
      },
      experience: [],
      education: [],
      skills: [],
    }
  );

  const updateFormData = (updates: Partial<CV>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    onUpdate(newData);
  };

  const sections = [
    { id: "personal" as const, name: "Personal Info", icon: User },
    { id: "experience" as const, name: "Experience", icon: Briefcase },
    { id: "education" as const, name: "Education", icon: GraduationCap },
    { id: "skills" as const, name: "Skills", icon: Wrench },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {/* Section Navigation */}
      <div className="md:col-span-1">
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
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

      {/* Section Content */}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PersonalInfoForm({
  data,
  onChange,
}: {
  data?: CV["personalInfo"];
  onChange: (data: CV["personalInfo"]) => void;
}) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value } as CV["personalInfo"]);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Full Name</label>
          <Input
            value={data?.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Professional Title</label>
          <Input
            value={data?.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Senior Software Engineer"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input
            type="email"
            value={data?.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="john@example.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Phone</label>
          <Input
            value={data?.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Location</label>
        <Input
          value={data?.location || ""}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="San Francisco, CA"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Professional Summary</label>
        <textarea
          value={data?.summary || ""}
          onChange={(e) => handleChange("summary", e.target.value)}
          placeholder="Brief summary of your professional background and career objectives..."
          className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none"
        />
      </div>
    </div>
  );
}

function ExperienceForm({
  data,
  onChange,
}: {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}) {
  const addExperience = () => {
    onChange([
      ...data,
      {
        id: crypto.randomUUID(),
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

  return (
    <div className="space-y-6">
      {data.map((exp, index) => (
        <div key={exp.id} className="p-4 border border-border rounded-lg space-y-4 relative">
          <button
            onClick={() => removeExperience(index)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Company</label>
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(index, { company: e.target.value })}
                placeholder="Company Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Job Title</label>
              <Input
                value={exp.title}
                onChange={(e) => updateExperience(index, { title: e.target.value })}
                placeholder="Software Engineer"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Start Date</label>
              <Input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(index, { startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">End Date</label>
              <Input
                type="month"
                value={exp.endDate || ""}
                onChange={(e) => updateExperience(index, { endDate: e.target.value })}
                disabled={exp.current}
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) =>
                    updateExperience(index, { current: e.target.checked, endDate: "" })
                  }
                  className="rounded border-input"
                />
                <span className="text-sm text-foreground">Current</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              value={exp.description}
              onChange={(e) => updateExperience(index, { description: e.target.value })}
              placeholder="Describe your responsibilities and achievements..."
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addExperience} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Experience
      </Button>
    </div>
  );
}

function EducationForm({
  data,
  onChange,
}: {
  data: Education[];
  onChange: (data: Education[]) => void;
}) {
  const addEducation = () => {
    onChange([
      ...data,
      {
        id: crypto.randomUUID(),
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
        <div key={edu.id} className="p-4 border border-border rounded-lg space-y-4 relative">
          <button
            onClick={() => removeEducation(index)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Institution</label>
              <Input
                value={edu.institution}
                onChange={(e) => updateEducation(index, { institution: e.target.value })}
                placeholder="University Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Degree</label>
              <Input
                value={edu.degree}
                onChange={(e) => updateEducation(index, { degree: e.target.value })}
                placeholder="Bachelor of Science"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Field of Study</label>
              <Input
                value={edu.field}
                onChange={(e) => updateEducation(index, { field: e.target.value })}
                placeholder="Computer Science"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Start Year</label>
              <Input
                type="number"
                value={edu.startDate}
                onChange={(e) => updateEducation(index, { startDate: e.target.value })}
                placeholder="2018"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">End Year</label>
              <Input
                type="number"
                value={edu.endDate || ""}
                onChange={(e) => updateEducation(index, { endDate: e.target.value })}
                placeholder="2022"
              />
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addEducation} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
}

function SkillsForm({
  data,
  onChange,
}: {
  data: string[];
  onChange: (data: string[]) => void;
}) {
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
            <Badge key={skill} variant="secondary" className="pl-3 pr-2 py-1.5 gap-1">
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {suggestedSkills.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Suggested skills:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.slice(0, 6).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="cursor-pointer hover:bg-muted"
                onClick={() => onChange([...data, skill])}
              >
                <Plus className="h-3 w-3 mr-1" />
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
