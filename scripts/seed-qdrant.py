"""Seed Qdrant with sample collections and initial data."""

from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams

client = QdrantClient(host="localhost", port=6333)

# Create CV embeddings collection
client.recreate_collection(
    collection_name="cv_embeddings",
    vectors_config=VectorParams(size=1024, distance=Distance.COSINE),
)

# Create job embeddings collection
client.recreate_collection(
    collection_name="job_embeddings",
    vectors_config=VectorParams(size=1024, distance=Distance.COSINE),
)

print("Seeded Qdrant collections")
