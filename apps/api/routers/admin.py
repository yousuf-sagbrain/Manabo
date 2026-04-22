from fastapi import APIRouter, Depends
from db.connection import get_pool
from dependencies import require_admin

router = APIRouter()


@router.get('/dashboard')
async def dashboard(
    cohort_id: str | None = None,
    user: dict = Depends(require_admin),
    pool=Depends(get_pool),
):
    cohort_filter = "AND u.cohort_id = $1" if cohort_id else ""
    args = [cohort_id] if cohort_id else []

    learners = await pool.fetchval(
        f"SELECT COUNT(*) FROM users u WHERE u.role = 'learner' AND u.deleted_at IS NULL {cohort_filter}",
        *args,
    )
    logins_today = await pool.fetchval(
        f"""
        SELECT COUNT(*) FROM login_events le
        JOIN users u ON u.id = le.user_id
        WHERE le.logged_at >= CURRENT_DATE {cohort_filter}
        """,
        *args,
    )
    pass_rate = await pool.fetchval(
        f"""
        SELECT ROUND(
            SUM(CASE WHEN ta.passed THEN 1 ELSE 0 END)::numeric /
            NULLIF(COUNT(*), 0) * 100, 1
        )
        FROM test_attempts ta
        JOIN users u ON u.id = ta.user_id
        WHERE ta.status = 'submitted' {cohort_filter}
        """,
        *args,
    )
    avg_study_min = await pool.fetchval(
        f"""
        SELECT ROUND(AVG(stl.duration_seconds) / 60.0, 1)
        FROM study_time_logs stl
        JOIN users u ON u.id = stl.user_id
        WHERE stl.session_date >= CURRENT_DATE - 7 {cohort_filter}
        """,
        *args,
    )

    return {
        'learner_count':    learners or 0,
        'logins_today':     logins_today or 0,
        'pass_rate':        float(pass_rate) if pass_rate else 0.0,
        'avg_study_min_7d': float(avg_study_min) if avg_study_min else 0.0,
    }
