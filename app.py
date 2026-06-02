import os
import shutil
import uuid
import requests
from typing import List
from fastapi import FastAPI, Body, HTTPException, status
from pydantic import BaseModel, HttpUrl

from image_processor import PetProcessor
from vectorizer import PetVectorizer
from matcher import calculate_similarity

app = FastAPI(
    title="FindPet ML Service API", 
    description="API for pet photo vectorization and similarity matching"
)

try:
    print("Loading AI models (MegaDetector & Vision Transformer)...")
    detector = PetProcessor()
    vectorizer = PetVectorizer()
    print("All models successfully loaded!")
except Exception as e:
    print(f"Error initializing models: {e}")

class AnalyzeRequest(BaseModel):
    image_url: HttpUrl

class Candidate(BaseModel):
    id: int
    vector: List[float]

class MatchRequest(BaseModel):
    target_vector: List[float]
    candidates: List[Candidate]

# ENDPOINT 1: DOWNLOAD, CROP & VECTORIZE
@app.post("/analyze", status_code=status.HTTP_200_OK)
async def analyze_pet(request: AnalyzeRequest):
    unique_id = str(uuid.uuid4())
    temp_original = f"temp_orig_{unique_id}.jpg"
    output_dir = "processed_pets"
    
    try:
        response = requests.get(str(request.image_url), stream=True, timeout=15)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to download image from the provided URL")
        
        with open(temp_original, "wb") as buffer:
            shutil.copyfileobj(response.raw, buffer)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File download error: {str(e)}")

    os.makedirs(output_dir, exist_ok=True)

    try:
        detection = detector.process_and_crop(temp_original, output_dir)
        
        if detection["status"] != "success":
            raise HTTPException(status_code=422, detail="No animal detected in the image")

        cropped_path = detection["output_path"]
        vector = vectorizer.get_vector(cropped_path)
        
        return {
            "status": "success",
            "vector": vector
        }

    finally:
        if os.path.exists(temp_original):
            os.remove(temp_original)
        if 'detection' in locals() and detection.get("output_path") and os.path.exists(detection["output_path"]):
            os.remove(detection["output_path"])

# ENDPOINT 2: MATCHING (VECTOR COMPARISON)
@app.post("/match", status_code=status.HTTP_200_OK)
async def match_pets(request: MatchRequest):
    if not request.candidates:
        return []
        
    results = []
    target = request.target_vector
    
    for candidate in request.candidates:
        similarity = calculate_similarity(target, candidate.vector)
        
        results.append({
            "id": candidate.id,
            "similarity_percentage": round(similarity * 100, 2)
        })
    
    results.sort(key=lambda x: x["similarity_percentage"], reverse=True)
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)