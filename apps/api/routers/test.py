from fastapi import APIRouter

router = APIRouter()


@router.post("/start")
async def start_test():
    # Creates a mastery test attempt; returns 20-question pool + server-side timer
    raise NotImplementedError


@router.post("/{attempt_id}/submit")
async def submit_test(attempt_id: str):
    # Scores the attempt; records pass/fail (80% threshold) against attempt id
    raise NotImplementedError
