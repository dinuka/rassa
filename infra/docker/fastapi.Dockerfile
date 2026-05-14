FROM python:3.12-slim

WORKDIR /app

RUN pip install uv

COPY apps/ai-service/pyproject.toml .
RUN uv sync --no-dev --frozen

COPY apps/ai-service/ .

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
