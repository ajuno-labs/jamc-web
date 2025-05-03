from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util

app = FastAPI()

# Load the SBERT model
model = SentenceTransformer("all-mpnet-base-v2")

class SimilarityRequest(BaseModel):
    sentence1: str
    sentence2: str

class SimilarityResponse(BaseModel):
    similarity: float

@app.post("/similarity", response_model=SimilarityResponse)
async def compute_similarity(req: SimilarityRequest):
    """
    Compute cosine similarity between two sentences.
    """
    emb1 = model.encode(req.sentence1, convert_to_tensor=True)
    emb2 = model.encode(req.sentence2, convert_to_tensor=True)
    cos_sim = util.pytorch_cos_sim(emb1, emb2).item()
    return SimilarityResponse(similarity=cos_sim) 