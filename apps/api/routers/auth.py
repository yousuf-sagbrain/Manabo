from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel

from auth.jwt import create_token
from db.connection import get_pool
from db import users as users_db

router = APIRouter()


class LoginRequest(BaseModel):
    applicant_id: str
    name: str | None = None


class UserInfo(BaseModel):
    id: str
    applicant_id: str
    full_name: str | None
    role: str
    cohort_name: str | None


class LoginResponse(BaseModel):
    token: str
    user: UserInfo


@router.post('/login', response_model=LoginResponse)
async def login(body: LoginRequest, request: Request, pool=Depends(get_pool)):
    applicant_id = body.applicant_id.strip().upper()

    user = await users_db.get_by_applicant_id(pool, applicant_id)
    if not user:
        user = await users_db.create_user(pool, applicant_id, body.name)
        user['cohort_name'] = None

    if not user.get('is_active', True):
        raise HTTPException(status_code=403, detail='Account is inactive')

    user_id = str(user['id'])
    await users_db.touch_login(pool, user_id)
    await users_db.log_login_event(
        pool,
        user_id,
        request.client.host if request.client else None,
        request.headers.get('user-agent'),
    )

    token = create_token(user_id, user['role'])
    return LoginResponse(
        token=token,
        user=UserInfo(
            id=user_id,
            applicant_id=user['applicant_id'],
            full_name=user.get('full_name'),
            role=user['role'],
            cohort_name=user.get('cohort_name'),
        ),
    )
