import asyncpg
from . import kana as kana_db


async def create_session(
    pool: asyncpg.Pool,
    user_id: str,
    script_filter: str,
    mode: str,
) -> str:
    row = await pool.fetchrow(
        """
        INSERT INTO practice_sessions (user_id, script_filter, mode)
        VALUES ($1, $2, $3)
        RETURNING id
        """,
        user_id,
        script_filter,
        mode,
    )
    return str(row['id'])  # type: ignore[index]


async def record_answer(
    pool: asyncpg.Pool,
    session_id: str,
    user_id: str,
    character: str,
    user_input: str,
    is_correct: bool,
    response_ms: int | None,
) -> None:
    kana = await kana_db.get_by_character(pool, character)
    if not kana:
        return

    await pool.execute(
        """
        INSERT INTO practice_answers
            (session_id, user_id, kana_id, user_input, is_correct, response_ms)
        VALUES ($1, $2, $3, $4, $5, $6)
        """,
        session_id,
        user_id,
        kana['id'],
        user_input,
        is_correct,
        response_ms,
    )

    # Upsert per-character progress
    await pool.execute(
        """
        INSERT INTO user_progress (user_id, kana_id, correct_count, incorrect_count, accuracy, last_seen_at)
        VALUES ($1, $2,
            CASE WHEN $3 THEN 1 ELSE 0 END,
            CASE WHEN $3 THEN 0 ELSE 1 END,
            CASE WHEN $3 THEN 100 ELSE 0 END,
            NOW()
        )
        ON CONFLICT ON CONSTRAINT user_progress_user_kana_unique
        DO UPDATE SET
            correct_count   = user_progress.correct_count   + CASE WHEN $3 THEN 1 ELSE 0 END,
            incorrect_count = user_progress.incorrect_count + CASE WHEN $3 THEN 0 ELSE 1 END,
            accuracy = ROUND(
                (user_progress.correct_count + CASE WHEN $3 THEN 1 ELSE 0 END)::numeric /
                NULLIF(user_progress.correct_count + user_progress.incorrect_count + 1, 0) * 100,
                2
            ),
            is_mastered = (
                (user_progress.correct_count + CASE WHEN $3 THEN 1 ELSE 0 END) >= 5 AND
                ROUND(
                    (user_progress.correct_count + CASE WHEN $3 THEN 1 ELSE 0 END)::numeric /
                    NULLIF(user_progress.correct_count + user_progress.incorrect_count + 1, 0) * 100,
                    2
                ) >= 80
            ),
            last_seen_at = NOW(),
            updated_at   = NOW()
        """,
        user_id,
        kana['id'],
        is_correct,
    )


async def complete_session(
    pool: asyncpg.Pool,
    session_id: str,
    correct_count: int,
    incorrect_count: int,
    streak_max: int,
    duration_seconds: int,
) -> None:
    total = correct_count + incorrect_count
    accuracy = round(correct_count / total * 100, 2) if total > 0 else 0.0

    await pool.execute(
        """
        UPDATE practice_sessions SET
            total_questions  = $2,
            correct_count    = $3,
            incorrect_count  = $4,
            accuracy         = $5,
            streak_max       = $6,
            duration_seconds = $7,
            completed_at     = NOW()
        WHERE id = $1
        """,
        session_id,
        total,
        correct_count,
        incorrect_count,
        accuracy,
        streak_max,
        duration_seconds,
    )
