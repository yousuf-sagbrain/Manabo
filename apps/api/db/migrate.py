import asyncpg


async def run_migrations(pool: asyncpg.Pool) -> None:
    async with pool.acquire() as conn:
        await conn.execute(
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 0'
        )
        await conn.execute(
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_days INTEGER NOT NULL DEFAULT 0'
        )
        await conn.execute(
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS last_practice_date DATE'
        )
