from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.endpoints import fen_router, corners_router

app = FastAPI()

# CORS settings
allowed_origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(fen_router, prefix="/fen", tags=["FEN"])
app.include_router(corners_router, prefix="/corners", tags=["Corners"])
