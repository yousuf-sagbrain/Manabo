from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class LoginRequest(BaseModel):
    applicant_id: str  # e.g. BJET-2025-0123


class LoginResponse(BaseModel):
    learner_id: str
    name: str
    cohort: str


@router.post("/login", response_model=LoginResponse)
async def login(body: LoginRequest):
    # Phase 1: ID-only login — validate against registered list
    # Phase 3: replace with JWT + bcrypt email auth
    raise HTTPException(status_code=501, detail="Not implemented yet")
