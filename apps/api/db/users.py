import asyncpg
from datetime import date


async def award_xp(pool: asyncpg.Pool, user_id: str, amount: int) -> None:
    await pool.execute(
        'UPDATE users SET xp = xp + $2, updated_at = NOW() WHERE id = $1',
        user_id,
        amount,
    )


async def update_streak(pool: asyncpg.Pool, user_id: str) -> int:
    """Update consecutive-day streak. Returns new streak_days value."""
    row = await pool.fetchrow(
        'SELECT streak_days, last_practice_date FROM users WHERE id = $1',
        user_id,
    )
    if not row:
        return 0

    today = date.today()
    last  = row['last_practice_date']

    if last is None:
        new_streak = 1
    elif last == today:
        return int(row['streak_days'])
    elif (today - last).days == 1:
        new_streak = row['streak_days'] + 1
    else:
        new_streak = 1

    await pool.execute(
        """
        UPDATE users
        SET streak_days = $2, last_practice_date = $3, updated_at = NOW()
        WHERE id = $1
        """,
        user_id,
        new_streak,
        today,
    )
    return new_streak


async def get_by_applicant_id(pool: asyncpg.Pool, applicant_id: str) -> dict | None:
    row = await pool.fetchrow(
        """
        SELECT u.id, u.applicant_id, u.full_name, u.role, u.cohort_id, u.is_active,
               c.name AS cohort_name
        FROM   users u
        LEFT JOIN cohorts c ON c.id = u.cohort_id
        WHERE  u.applicant_id = $1
          AND  u.deleted_at IS NULL
        """,
        applicant_id,
    )
    return dict(row) if row else None


async def create_user(pool: asyncpg.Pool, applicant_id: str, full_name: str | None) -> dict:
    row = await pool.fetchrow(
        """
        INSERT INTO users (applicant_id, full_name, role)
        VALUES ($1, $2, 'learner')
        RETURNING id, applicant_id, full_name, role, cohort_id, is_active
        """,
        applicant_id,
        full_name or applicant_id,
    )
    return dict(row)  # type: ignore[arg-type]


async def touch_login(pool: asyncpg.Pool, user_id: str) -> None:
    await pool.execute(
        'UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1',
        user_id,
    )


async def log_login_event(
    pool: asyncpg.Pool,
    user_id: str,
    ip_address: str | None,
    user_agent: str | None,
) -> None:
    await pool.execute(
        'INSERT INTO login_events (user_id, ip_address, user_agent) VALUES ($1, $2, $3)',
        user_id,
        ip_address,
        user_agent,
    )
