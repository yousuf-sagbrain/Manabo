from fastapi import APIRouter, Depends

from db.connection import get_pool
from db import stats as stats_db
from dependencies import current_user, optional_user

router = APIRouter()


@router.get('/me/stats')
async def my_stats(
    user: dict = Depends(current_user),
    pool=Depends(get_pool),
):
    return await stats_db.get_user_stats(pool, user['id'])


@router.get('/leaderboard')
async def leaderboard(
    pool=Depends(get_pool),
    user: dict | None = Depends(optional_user),
):
    user_id = user['id'] if user else None
    return await stats_db.get_leaderboard(pool, user_id)
