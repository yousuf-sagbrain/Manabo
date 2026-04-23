import asyncpg
from . import badges as badges_db


async def get_user_stats(pool: asyncpg.Pool, user_id: str) -> dict:
    user_row = await pool.fetchrow(
        'SELECT xp, streak_days FROM users WHERE id = $1',
        user_id,
    )
    xp          = int(user_row['xp'])          if user_row else 0
    streak_days = int(user_row['streak_days']) if user_row else 0
    level          = xp // 500 + 1
    xp_to_next     = 500 - (xp % 500)

    # Mastered character counts
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

    # Session totals
    session_row = await pool.fetchrow(
        """
        SELECT
            COUNT(*)                                    AS total_sessions,
            COALESCE(AVG(accuracy), 0)                  AS accuracy_overall
        FROM practice_sessions
        WHERE user_id = $1 AND completed_at IS NOT NULL
        """,
        user_id,
    )
    total_sessions   = int(session_row['total_sessions'])   if session_row else 0
    accuracy_overall = float(session_row['accuracy_overall']) if session_row else 0.0

    tests_passed = await pool.fetchval(
        "SELECT COUNT(*) FROM test_attempts WHERE user_id = $1 AND passed = true AND status = 'submitted'",
        user_id,
    ) or 0

    # Correct answers today
    correct_today = await pool.fetchval(
        """
        SELECT COUNT(*) FROM practice_answers
        WHERE user_id = $1 AND is_correct = true AND answered_at >= CURRENT_DATE
        """,
        user_id,
    ) or 0

    # Weak characters: bottom 5 by accuracy with at least 1 attempt
    weak_rows = await pool.fetch(
        """
        SELECT kc.character, kc.romaji, up.accuracy
        FROM user_progress up
        JOIN kana_characters kc ON kc.id = up.kana_id
        WHERE up.user_id = $1 AND (up.correct_count + up.incorrect_count) > 0
        ORDER BY up.accuracy ASC, up.incorrect_count DESC
        LIMIT 5
        """,
        user_id,
    )
    weak_characters = [
        {'character': r['character'], 'romaji': r['romaji'], 'accuracy': float(r['accuracy'])}
        for r in weak_rows
    ]

    # User rank by XP
    rank = await pool.fetchval(
        """
        SELECT COUNT(*) + 1 FROM users
        WHERE role = 'learner' AND deleted_at IS NULL AND xp > (
            SELECT xp FROM users WHERE id = $1
        )
        """,
        user_id,
    ) or 1

    badges = await badges_db.get_user_badges(pool, user_id)

    return {
        'xp':               xp,
        'streak_days':      streak_days,
        'level':            level,
        'xp_to_next_level': xp_to_next,
        'rank':             int(rank),
        'badges':           [{'badge_key': b['badge_key'], 'earned_at': b['earned_at'].isoformat()} for b in badges],
        'mastered_hiragana': int(mastered_h),
        'mastered_katakana': int(mastered_k),
        'total_hiragana':    46,
        'total_katakana':    46,
        'total_sessions':    total_sessions,
        'tests_passed':      int(tests_passed),
        'accuracy_overall':  round(accuracy_overall, 1),
        'correct_today':     int(correct_today),
        'weak_characters':   weak_characters,
    }


async def get_leaderboard(pool: asyncpg.Pool, user_id: str | None = None) -> dict:
    rows = await pool.fetch(
        """
        SELECT
            applicant_id,
            COALESCE(full_name, applicant_id) AS display_name,
            xp,
            streak_days,
            xp / 500 + 1 AS level,
            RANK() OVER (ORDER BY xp DESC) AS rank
        FROM users
        WHERE role = 'learner' AND deleted_at IS NULL
        ORDER BY xp DESC
        LIMIT 10
        """,
    )

    entries = [
        {
            'rank':         int(r['rank']),
            'applicant_id': r['applicant_id'],
            'display_name': r['display_name'],
            'xp':           int(r['xp']),
            'streak_days':  int(r['streak_days']),
            'level':        int(r['level']),
        }
        for r in rows
    ]

    your_rank = None
    if user_id:
        your_rank = await pool.fetchval(
            """
            SELECT COUNT(*) + 1 FROM users
            WHERE role = 'learner' AND deleted_at IS NULL AND xp > (
                SELECT xp FROM users WHERE id = $1
            )
            """,
            user_id,
        )
        your_rank = int(your_rank or 1)

    return {'entries': entries, 'your_rank': your_rank}
