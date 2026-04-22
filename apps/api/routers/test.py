from fastapi import APIRouter, Depends
from pydantic import BaseModel

from db.connection import get_pool
from db import test_queries as test_db, kana as kana_db
from dependencies import current_user

router = APIRouter()

TOTAL_QUESTIONS = 20


class StartResponse(BaseModel):
    attempt_id: str
    attempt_number: int
    questions: list[dict]


class AnswerItem(BaseModel):
    character: str
    user_input: str
    response_ms: int | None = None


class SubmitRequest(BaseModel):
    answers: list[AnswerItem]
    time_taken_seconds: int | None = None


class SubmitResponse(BaseModel):
    score: int
    total: int
    accuracy: float
    passed: bool


@router.post('/attempts', response_model=StartResponse)
async def start_test(
    user: dict = Depends(current_user),
    pool=Depends(get_pool),
):
    attempt_number = await test_db.next_attempt_number(pool, user['id'])
    attempt = await test_db.create_attempt(pool, user['id'], attempt_number)
    questions = await kana_db.get_random_subset(pool, 'both', TOTAL_QUESTIONS)

    return StartResponse(
        attempt_id=str(attempt['id']),
        attempt_number=attempt_number,
        questions=[
            {'id': str(q['id']), 'character': q['character'], 'script_type': q['script_type']}
            for q in questions
        ],
    )


@router.post('/attempts/{attempt_id}/submit', response_model=SubmitResponse)
async def submit_test(
    attempt_id: str,
    body: SubmitRequest,
    user: dict = Depends(current_user),
    pool=Depends(get_pool),
):
    result = await test_db.submit_attempt(
        pool, attempt_id, user['id'],
        [a.model_dump() for a in body.answers],
    )
    return SubmitResponse(**result)
