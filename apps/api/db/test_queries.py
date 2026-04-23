import asyncpg
from . import kana as kana_db
from . import users as users_db
from . import badges as badges_db


async def next_attempt_number(pool: asyncpg.Pool, user_id: str) -> int:
    count = await pool.fetchval(
        'SELECT COUNT(*) FROM test_attempts WHERE user_id = $1',
        user_id,
    )
    return (count or 0) + 1


async def create_attempt(pool: asyncpg.Pool, user_id: str, attempt_number: int) -> dict:
    row = await pool.fetchrow(
        """
        INSERT INTO test_attempts (user_id, attempt_number, status, started_at)
        VALUES ($1, $2, 'in_progress', NOW())
        RETURNING id, attempt_number, started_at
        """,
        user_id,
        attempt_number,
    )
    return dict(row)  # type: ignore[arg-type]


async def submit_attempt(
    pool: asyncpg.Pool,
    attempt_id: str,
    user_id: str,
    answers: list[dict],
) -> dict:
    score   = 0
    records = []

    for order, ans in enumerate(answers, start=1):
        kana = await kana_db.get_by_character(pool, ans['character'])
        if not kana:
            continue

        user_input    = ans.get('user_input', '').strip().lower()
        correct_romaji = kana['romaji']
        aliases        = kana['aliases'] or []
        is_correct     = user_input == correct_romaji or user_input in aliases

        if is_correct:
            score += 1

        records.append((
            attempt_id,
            user_id,
            kana['id'],
            order,
            ans.get('user_input', ''),
            is_correct,
            ans.get('response_ms'),
        ))

    await pool.executemany(
        """
        INSERT INTO test_answers
            (attempt_id, user_id, kana_id, question_order, user_input, is_correct, response_ms)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        """,
        records,
    )

    total    = len(records)
    accuracy = round(score / total * 100, 2) if total > 0 else 0.0
    passed   = accuracy >= 80.0

    await pool.execute(
        """
        UPDATE test_attempts SET
            score        = $2,
            accuracy     = $3,
            passed       = $4,
            status       = 'submitted',
            submitted_at = NOW()
        WHERE id = $1
        """,
        attempt_id,
        score,
        accuracy,
        passed,
    )

    # XP + badges
    if passed:
        await users_db.award_xp(pool, user_id, 100)

        newly = await badges_db.award_badge_if_new(pool, user_id, 'first_pass')
        if newly:
            await users_db.award_xp(pool, user_id, 25)

        if score == total:
            await users_db.award_xp(pool, user_id, 50)
            newly = await badges_db.award_badge_if_new(pool, user_id, 'perfect_score')
            if newly:
                await users_db.award_xp(pool, user_id, 25)

    return {'score': score, 'total': total, 'accuracy': accuracy, 'passed': passed}
