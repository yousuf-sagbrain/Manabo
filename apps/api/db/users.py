import asyncpg


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
