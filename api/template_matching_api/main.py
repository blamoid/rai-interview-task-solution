from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import AnyHttpUrl

from template_matching_api.api.api import api_router

BACKEND_CORS_ORIGINS: list[AnyHttpUrl] = [
    "http://localhost:5173",  # type: ignore
]
app = FastAPI(title="Template matching management API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin).rstrip("/") for origin in BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix="/api")
