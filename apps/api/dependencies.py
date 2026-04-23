import asyncpg
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from auth.jwt import decode_token
from db.connection import get_pool

_bearer        = HTTPBearer()
_bearer_optional = HTTPBearer(auto_error=False)


async def current_user(
    creds: HTTPAuthorizationCredentials = Depends(_bearer),
) -> dict:
    try:
        payload = decode_token(creds.credentials)
        return {'id': payload['sub'], 'role': payload['role']}
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid or expired token')


async def optional_user(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer_optional),
) -> dict | None:
    if not creds:
        return None
    try:
        payload = decode_token(creds.credentials)
        return {'id': payload['sub'], 'role': payload['role']}
    except ValueError:
        return None


async def require_admin(user: dict = Depends(current_user)) -> dict:
    if user['role'] != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Admin only')
    return user
