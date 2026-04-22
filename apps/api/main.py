from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, practice, test, admin

app = FastAPI(
    title="B-JET API",
    description="Hiragana & Katakana Learning Platform — Core API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4000"],  # gateway only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,     prefix="/auth",     tags=["auth"])
app.include_router(practice.router, prefix="/practice", tags=["practice"])
app.include_router(test.router,     prefix="/test",     tags=["test"])
app.include_router(admin.router,    prefix="/admin",    tags=["admin"])


@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok", "service": "bjet-api"}
