#!/usr/bin/env bash
set -euo pipefail

MODELS_DIR="apps/ai-service/models"
mkdir -p "$MODELS_DIR"

echo "Downloading BGE embedding model..."
python3 -c "
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('BAAI/bge-large-en-v1.5')
model.save('$MODELS_DIR/bge-large-en-v1.5')
"

echo "Downloading BGE reranker..."
python3 -c "
from sentence_transformers import CrossEncoder
model = CrossEncoder('BAAI/bge-reranker-base')
model.save('$MODELS_DIR/bge-reranker-base')
"

echo "Models downloaded to $MODELS_DIR"
