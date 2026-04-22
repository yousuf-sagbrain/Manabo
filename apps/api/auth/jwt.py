import os
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError

_SECRET = os.getenv('JWT_SECRET', 'dev-secret-change-in-prod')
_ALGO   = 'HS256'
_EXPIRE = timedelta(days=7)


def create_token(user_id: str, role: str) -> str:
    payload = {
        'sub':  user_id,
        'role': role,
        'exp':  datetime.now(timezone.utc) + _EXPIRE,
    }
    return jwt.encode(payload, _SECRET, algorithm=_ALGO)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, _SECRET, algorithms=[_ALGO])
    except JWTError as exc:
        raise ValueError('Invalid token') from exc
