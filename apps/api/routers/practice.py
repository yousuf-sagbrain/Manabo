from fastapi import APIRouter, Depends
from pydantic import BaseModel

from db.connection import get_pool
from db import practice as practice_db, kana as kana_db
from dependencies import current_user

router = APIRouter()


class CreateSessionRequest(BaseModel):
    script_filter: str = 'hiragana'
    mode: str = 'typing'


class CreateSessionResponse(BaseModel):
    session_id: str


class AnswerRequest(BaseModel):
    character: str
    user_input: str
    is_correct: bool
    response_ms: int | None = None


class CompleteRequest(BaseModel):
    correct_count: int
    incorrect_count: int
    streak_max: int
    duration_seconds: int


@router.post('/sessions', response_model=CreateSessionResponse)
async def create_session(
    body: CreateSessionRequest,
    user: dict = Depends(current_user),
    pool=Depends(get_pool),
):
    session_id = await practice_db.create_session(
        pool, user['id'], body.script_filter, body.mode,
    )
    return CreateSessionResponse(session_id=session_id)


@router.post('/sessions/{session_id}/answers', status_code=204)
async def record_answer(
    session_id: str,
    body: AnswerRequest,
    user: dict = Depends(current_user),
    pool=Depends(get_pool),
):
    await practice_db.record_answer(
        pool, session_id, user['id'],
        body.character, body.user_input, body.is_correct, body.response_ms,
    )


@router.patch('/sessions/{session_id}/complete', status_code=204)
async def complete_session(
    session_id: str,
    body: CompleteRequest,
    user: dict = Depends(current_user),
    pool=Depends(get_pool),
):
    await practice_db.complete_session(
        pool, session_id,
        body.correct_count, body.incorrect_count, body.streak_max, body.duration_seconds,
    )


@router.get('/kana')
async def list_kana(script_filter: str = 'both', pool=Depends(get_pool)):
    rows = await kana_db.get_all(pool, script_filter)
    return {'characters': rows}
