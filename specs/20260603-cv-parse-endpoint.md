# CV Parse Endpoint

**Date:** 2026-06-03

## Overview

Implement a real `POST /api/cv-documents/parse` endpoint in the NestJS backend that:

1. Accepts a CV file (PDF or DOCX) via multipart upload
2. Stores the original file in MinIO
3. Extracts text and calls the ai-service (Ollama / llama3.2) for structured parsing
4. Returns structured CV data matching the `Cv` type from `@repo/shared-types`

The candidate-portal's mock `/api/cv/parse` Next.js route becomes a simple proxy to this endpoint.

---

## Architecture

```
candidate-portal
  POST /api/cv/parse  (Next.js BFF proxy)
        ↓ multipart forward + Bearer token
  NestJS backend
  POST /api/cv-documents/parse  (JWT guarded)
    FilesService   → upload original to MinIO
    AiGatewayService → POST /api/cv/analyze (ai-service)
        ↓ multipart HTTP
  FastAPI ai-service
  POST /api/cv/analyze
    cv_extractor   → extract raw text (PyMuPDF / python-docx)
    cv_parser      → Ollama llama3.2 structured extraction
    return ParsedCvResponse (JSON)
```

---

## Data Shape

Response shape (subset of `Cv` from `@repo/shared-types`):

```ts
{
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    title?: string;
    summary?: string;
  };
  experience: Array<{
    id: string;          // uuid4 added by ai-service
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
    id: string;          // uuid4 added by ai-service
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills: string[];
  fileName: string;
}
```

---

## Components to Build

### ai-service (Python / FastAPI)

| File                                      | Purpose                                                                              |
| ----------------------------------------- | ------------------------------------------------------------------------------------ |
| `app/schemas/cv.py`                       | Pydantic models: `PersonalInfo`, `Experience`, `Education`, `ParsedCvResponse`       |
| `app/document_processing/cv_extractor.py` | `extract_text(bytes, content_type)` — PyMuPDF for PDF, python-docx for DOCX          |
| `app/services/cv_parser.py`               | `parse_cv(text)` — Ollama llama3.2 via OpenAI-compat SDK, returns `ParsedCvResponse` |
| `app/api/v1/cv.py`                        | `POST /api/cv/analyze` — wires extractor + parser                                    |
| `app/core/config.py`                      | Add `OLLAMA_BASE_URL` (default `http://localhost:11434/v1`)                          |
| `pyproject.toml`                          | Add `python-multipart` for FastAPI file upload                                       |

**Ollama connection:** `openai.AsyncOpenAI(base_url=settings.ollama_base_url, api_key="ollama")` using the already-installed `openai` SDK.

### NestJS backend

| File                                              | Purpose                                             |
| ------------------------------------------------- | --------------------------------------------------- |
| `modules/files/files.module.ts`                   | MinIO client provider                               |
| `modules/files/files.service.ts`                  | `upload(buffer, filename, mimetype) → objectKey`    |
| `modules/ai-gateway/ai-gateway.module.ts`         | HttpModule wrapper                                  |
| `modules/ai-gateway/ai-gateway.service.ts`        | `parseCv(buffer, filename, mimetype) → ParsedCvDto` |
| `modules/cv-documents/cv-documents.module.ts`     | Imports FilesModule + AiGatewayModule               |
| `modules/cv-documents/cv-documents.controller.ts` | `POST /cv-documents/parse` (JWT guarded, multipart) |
| `modules/cv-documents/cv-documents.service.ts`    | Orchestrates upload + parse                         |
| `modules/cv-documents/dto/parsed-cv.dto.ts`       | Response DTO                                        |
| `app.module.ts`                                   | Add CvDocumentsModule, FilesModule, AiGatewayModule |
| `package.json`                                    | Add `minio`, `@nestjs/axios`                        |

**Parse is stateless** — no DB write. Persistence happens later when the candidate confirms via the existing `POST /cv-documents` flow.

### candidate-portal (Next.js)

| File                        | Change                                                                                                            |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `app/api/cv/parse/route.ts` | Replace mock with proxy to `${env.apiUrl}/cv-documents/parse` + Bearer token (same pattern as `/api/cv/route.ts`) |

---

## Environment Variables

| Variable           | Service    | Default                     |
| ------------------ | ---------- | --------------------------- |
| `OLLAMA_BASE_URL`  | ai-service | `http://localhost:11434/v1` |
| `MINIO_ENDPOINT`   | backend    | already configured          |
| `MINIO_PORT`       | backend    | already configured          |
| `MINIO_ACCESS_KEY` | backend    | already configured          |
| `MINIO_SECRET_KEY` | backend    | already configured          |
| `MINIO_BUCKET`     | backend    | already configured          |
| `AI_SERVICE_URL`   | backend    | `http://localhost:8000`     |

---

## Dependencies

| Package            | Location                         | Reason                       |
| ------------------ | -------------------------------- | ---------------------------- |
| `minio`            | `apps/backend/package.json`      | MinIO client                 |
| `@nestjs/axios`    | `apps/backend/package.json`      | HTTP calls to ai-service     |
| `python-multipart` | `apps/ai-service/pyproject.toml` | FastAPI `UploadFile` support |

---

## Verification

1. `docker compose -f infra/docker-compose.dev.yml up -d`
2. Pull model: `docker exec <ollama-container> ollama pull llama3.2`
3. `pnpm dev`
4. Upload a real PDF/DOCX through the candidate-portal onboarding wizard
5. Confirm response has populated `personalInfo`, `experience`, `education`, `skills`
6. `pnpm --filter @rassa/backend test`
7. `cd apps/ai-service && uv run pytest`
