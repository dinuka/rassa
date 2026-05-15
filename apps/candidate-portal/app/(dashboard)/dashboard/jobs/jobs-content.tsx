"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Progress,
  Separator,
} from "@repo/ui";
import {
  Search,
  Filter,
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import { ExternalJobMatcher } from "./external-job-matcher";

// Mock job data
const mockJobs = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    remote: true,
    matchScore: 92,
    salary: { min: 150000, max: 180000 },
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    matchedSkills: ["React", "TypeScript", "Node.js"],
    missingSkills: ["GraphQL"],
    postedAt: "2024-01-10",
    description: "We are looking for a Senior Frontend Engineer to join our team...",
  },
  {
    id: "2",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Remote",
    type: "Full-time",
    remote: true,
    matchScore: 87,
    salary: { min: 120000, max: 150000 },
    skills: ["React", "Python", "AWS", "PostgreSQL"],
    matchedSkills: ["React", "Python"],
    missingSkills: ["AWS", "PostgreSQL"],
    postedAt: "2024-01-08",
    description: "Join our fast-growing startup as a Full Stack Developer...",
  },
  {
    id: "3",
    title: "React Developer",
    company: "Digital Agency",
    location: "New York, NY",
    type: "Full-time",
    remote: false,
    matchScore: 85,
    salary: { min: 130000, max: 160000 },
    skills: ["React", "JavaScript", "CSS", "Figma"],
    matchedSkills: ["React", "JavaScript", "CSS"],
    missingSkills: ["Figma"],
    postedAt: "2024-01-05",
    description: "Looking for a talented React Developer to build beautiful interfaces...",
  },
  {
    id: "4",
    title: "Software Engineer",
    company: "Enterprise Solutions",
    location: "Austin, TX",
    type: "Full-time",
    remote: true,
    matchScore: 78,
    salary: { min: 140000, max: 170000 },
    skills: ["Java", "Spring Boot", "React", "Docker"],
    matchedSkills: ["React"],
    missingSkills: ["Java", "Spring Boot", "Docker"],
    postedAt: "2024-01-03",
    description: "Enterprise Solutions is hiring a Software Engineer...",
  },
  {
    id: "5",
    title: "Frontend Team Lead",
    company: "FinTech Corp",
    location: "Chicago, IL",
    type: "Full-time",
    remote: false,
    matchScore: 72,
    salary: { min: 170000, max: 200000 },
    skills: ["React", "TypeScript", "Team Leadership", "System Design"],
    matchedSkills: ["React", "TypeScript"],
    missingSkills: ["Team Leadership", "System Design"],
    postedAt: "2024-01-01",
    description: "Lead our frontend team to build the next generation of fintech products...",
  },
];

type ViewMode = "grid" | "list";
type SortOption = "match" | "date" | "salary";

export function JobsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortBy, setSortBy] = useState<SortOption>("match");
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [showExternalMatcher, setShowExternalMatcher] = useState(false);
  const [filterRemote, setFilterRemote] = useState(false);
  const [minMatchScore, setMinMatchScore] = useState(0);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const filteredJobs = mockJobs
    .filter((job) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.skills.some((skill) => skill.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .filter((job) => (filterRemote ? job.remote : true))
    .filter((job) => job.matchScore >= minMatchScore)
    .sort((a, b) => {
      if (sortBy === "match") return b.matchScore - a.matchScore;
      if (sortBy === "date") return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      if (sortBy === "salary") return b.salary.max - a.salary.max;
      return 0;
    });

  const formatSalary = (min: number, max: number) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Matches</h1>
          <p className="text-muted-foreground">
            {filteredJobs.length} jobs match your profile
          </p>
        </div>
        <Button onClick={() => setShowExternalMatcher(true)} variant="outline">
          <LinkIcon className="h-4 w-4 mr-2" />
          Match External Job
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by title, company, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterRemote ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRemote(!filterRemote)}
              >
                <MapPin className="h-4 w-4 mr-1" />
                Remote
              </Button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="match">Best Match</option>
                <option value="date">Most Recent</option>
                <option value="salary">Highest Salary</option>
              </select>
              <div className="flex border border-input rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-muted" : "hover:bg-muted/50"}`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-muted" : "hover:bg-muted/50"}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Match Score Filter */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Min match:</span>
            <div className="flex gap-2">
              {[0, 70, 80, 90].map((score) => (
                <Button
                  key={score}
                  variant={minMatchScore === score ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMinMatchScore(score)}
                >
                  {score === 0 ? "All" : `${score}%+`}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job List */}
      <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2" : "space-y-4"}>
        {filteredJobs.map((job) => (
          <Card
            key={job.id}
            className="hover:border-primary/50 transition-colors overflow-hidden"
          >
            <CardContent className={viewMode === "grid" ? "p-5" : "p-5"}>
              <div className="flex gap-4">
                {/* Company Logo Placeholder */}
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                </div>

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/dashboard/jobs/${job.id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {job.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {job.company}
                      </p>
                    </div>

                    {/* Match Score */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={job.matchScore}
                            className="w-20"
                            size="sm"
                            variant={
                              job.matchScore >= 90
                                ? "success"
                                : job.matchScore >= 80
                                ? "default"
                                : "warning"
                            }
                          />
                          <span className="text-sm font-semibold text-foreground w-10">
                            {job.matchScore}%
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {savedJobs.has(job.id) ? (
                          <BookmarkCheck className="h-5 w-5 text-primary" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      {formatSalary(job.salary.min, job.salary.max)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(job.postedAt)}
                    </span>
                    {job.remote && (
                      <Badge variant="secondary" className="text-xs">
                        Remote
                      </Badge>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.matchedSkills.map((skill) => (
                      <Badge key={skill} variant="default" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {job.missingSkills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs text-muted-foreground">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/jobs/${job.id}`}>View Details</Link>
                    </Button>
                    <Button size="sm" variant="outline">
                      Quick Apply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No jobs found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}

      {/* External Job Matcher Modal */}
      {showExternalMatcher && (
        <ExternalJobMatcher onClose={() => setShowExternalMatcher(false)} />
      )}
    </div>
  );
}
