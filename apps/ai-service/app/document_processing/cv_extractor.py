import io

import fitz  # PyMuPDF
from docx import Document


def extract_text(file_bytes: bytes, content_type: str) -> str:
    if "pdf" in content_type:
        return _extract_pdf(file_bytes)
    if "word" in content_type or content_type.endswith(("docx", "doc")):
        return _extract_docx(file_bytes)
    raise ValueError(f"Unsupported content type: {content_type}")


def _extract_pdf(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    pages = [page.get_text() for page in doc]
    doc.close()
    return "\n".join(pages)


def _extract_docx(file_bytes: bytes) -> str:
    doc = Document(io.BytesIO(file_bytes))
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
