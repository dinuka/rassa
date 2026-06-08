# Candidate Profile Endpoint

**Date:** 2026-06-08

## Overview

Implement `POST/GET/PUT /api/candidate/profile` in the NestJS backend. A candidate has exactly one profile containing their personal information, work experience, education, skills, projects, and certifications. This profile is the source of truth; CVs (tailored per job) will be generated from it later.

---

## Architecture

```
candidate-portal
  POST/GET/PUT /api/candidate/profile
        ↓ Bearer token
  NestJS backend
  candidate module
    CandidateProfileSchema  → MongoDB
    CandidatesController
    CandidatesService
```

---

## Data Shape

### `@repo/shared-types` — profile.ts

The sub-schemas currently in `cv.ts` (`LinkSchema`, `PersonalInfoSchema`, `ExperienceSchema`, `EducationSchema`, `ProjectSchema`, `CertificationSchema`) move to `profile.ts`. `cv.ts` imports them from there.

```ts
// profile.ts
export const ProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  personalInfo: PersonalInfoSchema,
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.array(z.string()),
  projects: z.array(ProjectSchema).optional(),
  certifications: z.array(CertificationSchema).optional(),
  extraCurricular: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CandidateProfile = z.infer<typeof ProfileSchema>;
```

### Request body (`SaveProfileDto`)

All fields except server-managed `id`, `userId`, `createdAt`, `updatedAt`:

```ts
{
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    title?: string;
    summary?: string;
    links?: Array<{ name: string; href: string }>;
  };
  experience: Array<{
    id: string;
    company: string;
    title: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
    highlights?: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills: string[];
  projects?: Array<{ id: string; name: string; ... }>;
  certifications?: Array<{ id: string; name: string; ... }>;
  extraCurricular?: string[];
}
```

---

## Components to Build

### `@repo/shared-types`

| File                                   | Change                                                                           |
| -------------------------------------- | -------------------------------------------------------------------------------- |
| `packages/shared-types/src/profile.ts` | **Create** — move sub-schemas here + define `ProfileSchema` / `CandidateProfile` |
| `packages/shared-types/src/cv.ts`      | **Modify** — remove sub-schemas/types, import from `./profile`                   |
| `packages/shared-types/src/index.ts`   | **Modify** — add `export * from "./profile"`                                     |

### NestJS backend (`apps/backend/src/modules/candidates/`)

| File                             | Purpose                                                                 |
| -------------------------------- | ----------------------------------------------------------------------- |
| `candidate-profile.schema.ts`    | Mongoose schema — `id` (UUID), `userId` (unique index), nested sub-docs |
| `dto/save-profile.dto.ts`        | `SaveProfileDto` + nested DTOs with `class-validator` decorators        |
| `candidates.controller.ts`       | `POST/GET/PUT /candidate/profile` — all JWT-guarded                     |
| `candidates.service.ts`          | `createProfile`, `getProfile`, `updateProfile`                          |
| `candidates.module.ts`           | Module wiring — registers schema, exports service                       |
| `apps/backend/src/app.module.ts` | Import `CandidatesModule`                                               |

---

## Endpoint Behaviour

| Method | Route                    | Success                         | Error cases                                            |
| ------ | ------------------------ | ------------------------------- | ------------------------------------------------------ |
| `POST` | `/api/candidate/profile` | `201` — returns saved profile   | `409` if profile already exists; `400` on invalid body |
| `GET`  | `/api/candidate/profile` | `200` — returns profile         | `404` if no profile yet                                |
| `PUT`  | `/api/candidate/profile` | `200` — returns updated profile | `404` if no profile; `400` on invalid body             |

All endpoints return `401` without a valid JWT.

---

## Verification

1. `pnpm --filter @rassa/backend build` — TypeScript must compile
2. `pnpm --filter @rassa/backend test` — existing tests must pass
3. Manual via Swagger at `http://localhost:4000/api`:
   - `POST /api/candidate/profile` with valid body → `201`
   - `GET /api/candidate/profile` → `200` with profile
   - `PUT /api/candidate/profile` → `200` with updated data
   - Second `POST` → `409 Conflict`
   - All endpoints without JWT → `401`
