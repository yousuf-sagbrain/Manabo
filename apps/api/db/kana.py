import asyncpg


async def get_all(pool: asyncpg.Pool, script_filter: str = 'both') -> list[dict]:
    if script_filter == 'both':
        rows = await pool.fetch(
            'SELECT * FROM kana_characters ORDER BY script_type, row_order, col_order'
        )
    else:
        rows = await pool.fetch(
            'SELECT * FROM kana_characters WHERE script_type = $1 ORDER BY row_order, col_order',
            script_filter,
        )
    return [dict(r) for r in rows]


async def get_by_character(pool: asyncpg.Pool, character: str) -> dict | None:
    row = await pool.fetchrow(
        'SELECT * FROM kana_characters WHERE character = $1',
        character,
    )
    return dict(row) if row else None


async def get_random_subset(pool: asyncpg.Pool, script_filter: str, limit: int) -> list[dict]:
    if script_filter == 'both':
        rows = await pool.fetch(
            'SELECT * FROM kana_characters ORDER BY RANDOM() LIMIT $1',
            limit,
        )
    else:
        rows = await pool.fetch(
            'SELECT * FROM kana_characters WHERE script_type = $1 ORDER BY RANDOM() LIMIT $2',
            script_filter,
            limit,
        )
    return [dict(r) for r in rows]
