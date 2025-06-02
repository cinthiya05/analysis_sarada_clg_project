from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router  # Make sure this is correctly importing your routes

app = FastAPI()

# Add CORS middleware FIRST
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use ["http://localhost:5173"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# THEN include your routes
app.include_router(router)

@app.get("/")
def root():
    return {"message": "FastAPI is running"}


