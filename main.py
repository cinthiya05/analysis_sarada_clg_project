from fastapi import FastAPI
from routes import router  # assuming your APIRouter is named 'router'

app = FastAPI()

# Include your routes
app.include_router(router)

# Optional root endpoint
@app.get("/")
def root():
    return {"message": "FastAPI is running"}
