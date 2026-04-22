from fastapi import APIRouter

router = APIRouter()


@router.get("/session")
async def get_session():
    # Returns a practice session question pool
    raise NotImplementedError


@router.post("/session/{session_id}/answer")
async def submit_answer(session_id: str):
    # Records a single answer; updates streak and progress
    raise NotImplementedError
