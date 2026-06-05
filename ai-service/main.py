from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class GazeRequest(BaseModel):
    image: str

@app.post("/analyze-gaze")
async def analyze_gaze(data: GazeRequest):

    return {
        "looking": "center",
        "confidence": 0.95,
        "faces": 1
    }

faces = 1