import pathlib
import asyncpg


async def _init_schema(conn: asyncpg.Connection) -> None:
    sql = (pathlib.Path(__file__).parent / 'schema.sql').read_text(encoding='utf-8')
    await conn.execute(sql)


async def _ensure_cohort_name_uniqueness(conn: asyncpg.Connection) -> None:
    await conn.execute(
        """
        WITH ranked AS (
            SELECT
                id,
                name,
                FIRST_VALUE(id) OVER (PARTITION BY name ORDER BY created_at, id) AS canonical_id,
                ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at, id) AS row_num
            FROM cohorts
        )
        UPDATE users AS u
        SET cohort_id = ranked.canonical_id
        FROM ranked
        WHERE u.cohort_id = ranked.id
          AND ranked.row_num > 1
        """
    )
    await conn.execute(
        """
        DELETE FROM cohorts AS c
        USING (
            SELECT id
            FROM (
                SELECT
                    id,
                    ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at, id) AS row_num
                FROM cohorts
            ) ranked
            WHERE ranked.row_num > 1
        ) duplicates
        WHERE c.id = duplicates.id
        """
    )
    await conn.execute(
        """
        CREATE UNIQUE INDEX IF NOT EXISTS idx_cohorts_name_unique
        ON cohorts(name)
        """
    )


async def run_migrations(pool: asyncpg.Pool) -> None:
    async with pool.acquire() as conn:
        await _init_schema(conn)
        await _ensure_cohort_name_uniqueness(conn)
        await conn.execute(
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 0'
        )
        await conn.execute(
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_days INTEGER NOT NULL DEFAULT 0'
        )
        await conn.execute(
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS last_practice_date DATE'
        )
    print('[migrate] schema initialised')
