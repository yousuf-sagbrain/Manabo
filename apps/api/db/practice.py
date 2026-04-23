import asyncpg
from . import kana as kana_db
from . import users as users_db
from . import badges as badges_db

HIRAGANA_TOTAL  = 46
KATAKANA_TOTAL  = 46


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


async def _check_mastery_badges(pool: asyncpg.Pool, user_id: str) -> None:
    mastered_h = await pool.fetchval(
        """
        SELECT COUNT(*) FROM user_progress up
        JOIN kana_characters kc ON kc.id = up.kana_id
        WHERE up.user_id = $1 AND up.is_mastered = true AND kc.script_type = 'hiragana'
        """,
        user_id,
    ) or 0

    mastered_k = await pool.fetchval(
        """
        SELECT COUNT(*) FROM user_progress up
        JOIN kana_characters kc ON kc.id = up.kana_id
        WHERE up.user_id = $1 AND up.is_mastered = true AND kc.script_type = 'katakana'
        """,
        user_id,
    ) or 0

    if mastered_h >= HIRAGANA_TOTAL:
        newly = await badges_db.award_badge_if_new(pool, user_id, 'all_hiragana')
        if newly:
            await users_db.award_xp(pool, user_id, 25)

    if mastered_k >= KATAKANA_TOTAL:
        newly = await badges_db.award_badge_if_new(pool, user_id, 'all_katakana')
        if newly:
            await users_db.award_xp(pool, user_id, 25)

    if mastered_h >= HIRAGANA_TOTAL and mastered_k >= KATAKANA_TOTAL:
        newly = await badges_db.award_badge_if_new(pool, user_id, 'all_kana')
        if newly:
            await users_db.award_xp(pool, user_id, 50)


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

    if is_correct:
        await users_db.award_xp(pool, user_id, 10)

        total_correct = await pool.fetchval(
            'SELECT COUNT(*) FROM practice_answers WHERE user_id = $1 AND is_correct = true',
            user_id,
        ) or 0

        if total_correct >= 10:
            newly = await badges_db.award_badge_if_new(pool, user_id, 'first_10')
            if newly:
                await users_db.award_xp(pool, user_id, 25)

        await _check_mastery_badges(pool, user_id)


async def complete_session(
    pool: asyncpg.Pool,
    session_id: str,
    user_id: str,
    correct_count: int,
    incorrect_count: int,
    streak_max: int,
    duration_seconds: int,
) -> None:
    total    = correct_count + incorrect_count
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

    await users_db.award_xp(pool, user_id, 50)

    new_streak = await users_db.update_streak(pool, user_id)

    newly = await badges_db.award_badge_if_new(pool, user_id, 'first_practice')
    if newly:
        await users_db.award_xp(pool, user_id, 25)

    if new_streak >= 3:
        newly = await badges_db.award_badge_if_new(pool, user_id, 'streak_3')
        if newly:
            await users_db.award_xp(pool, user_id, 25)

    if new_streak >= 7:
        newly = await badges_db.award_badge_if_new(pool, user_id, 'streak_7')
        if newly:
            await users_db.award_xp(pool, user_id, 25)
