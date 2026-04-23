import asyncpg


ALL_BADGES = [
    'first_practice',
    'first_10',
    'all_hiragana',
    'all_katakana',
    'all_kana',
    'streak_3',
    'streak_7',
    'first_pass',
    'perfect_score',
]


async def award_badge_if_new(pool: asyncpg.Pool, user_id: str, badge_key: str) -> bool:
    """Insert badge; returns True only if it was newly awarded (not a duplicate)."""
    result = await pool.execute(
        """
        INSERT INTO achievements (user_id, badge_key)
        VALUES ($1, $2)
        ON CONFLICT ON CONSTRAINT achievements_user_badge_unique DO NOTHING
        """,
        user_id,
        badge_key,
    )
    return result == 'INSERT 0 1'


async def get_user_badges(pool: asyncpg.Pool, user_id: str) -> list[dict]:
    rows = await pool.fetch(
        'SELECT badge_key, earned_at FROM achievements WHERE user_id = $1 ORDER BY earned_at',
        user_id,
    )
    return [dict(r) for r in rows]
