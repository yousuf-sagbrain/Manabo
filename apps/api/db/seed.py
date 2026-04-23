import asyncpg

# (char, romaji, aliases, vowel_group, row_order, col_order)
_HIRAGANA = [
    ('あ', 'a',   [],       'a', 0, 0), ('い', 'i',   [],       'i', 0, 1),
    ('う', 'u',   [],       'u', 0, 2), ('え', 'e',   [],       'e', 0, 3),
    ('お', 'o',   [],       'o', 0, 4),
    ('か', 'ka',  [],       'a', 1, 0), ('き', 'ki',  [],       'i', 1, 1),
    ('く', 'ku',  [],       'u', 1, 2), ('け', 'ke',  [],       'e', 1, 3),
    ('こ', 'ko',  [],       'o', 1, 4),
    ('さ', 'sa',  [],       'a', 2, 0), ('し', 'shi', ['si'],   'i', 2, 1),
    ('す', 'su',  [],       'u', 2, 2), ('せ', 'se',  [],       'e', 2, 3),
    ('そ', 'so',  [],       'o', 2, 4),
    ('た', 'ta',  [],       'a', 3, 0), ('ち', 'chi', ['ti'],   'i', 3, 1),
    ('つ', 'tsu', ['tu'],   'u', 3, 2), ('て', 'te',  [],       'e', 3, 3),
    ('と', 'to',  [],       'o', 3, 4),
    ('な', 'na',  [],       'a', 4, 0), ('に', 'ni',  [],       'i', 4, 1),
    ('ぬ', 'nu',  [],       'u', 4, 2), ('ね', 'ne',  [],       'e', 4, 3),
    ('の', 'no',  [],       'o', 4, 4),
    ('は', 'ha',  [],       'a', 5, 0), ('ひ', 'hi',  [],       'i', 5, 1),
    ('ふ', 'fu',  ['hu'],   'u', 5, 2), ('へ', 'he',  [],       'e', 5, 3),
    ('ほ', 'ho',  [],       'o', 5, 4),
    ('ま', 'ma',  [],       'a', 6, 0), ('み', 'mi',  [],       'i', 6, 1),
    ('む', 'mu',  [],       'u', 6, 2), ('め', 'me',  [],       'e', 6, 3),
    ('も', 'mo',  [],       'o', 6, 4),
    ('や', 'ya',  [],       'a', 7, 0), ('ゆ', 'yu',  [],       'u', 7, 2),
    ('よ', 'yo',  [],       'o', 7, 4),
    ('ら', 'ra',  [],       'a', 8, 0), ('り', 'ri',  [],       'i', 8, 1),
    ('る', 'ru',  [],       'u', 8, 2), ('れ', 're',  [],       'e', 8, 3),
    ('ろ', 'ro',  [],       'o', 8, 4),
    ('わ', 'wa',  [],       'a', 9, 0), ('を', 'wo',  ['o'],    'o', 9, 4),
    ('ん', 'n',   ['nn'],   'n', 10, 0),
]

_KATAKANA = [
    ('ア', 'a',   [],       'a', 0, 0), ('イ', 'i',   [],       'i', 0, 1),
    ('ウ', 'u',   [],       'u', 0, 2), ('エ', 'e',   [],       'e', 0, 3),
    ('オ', 'o',   [],       'o', 0, 4),
    ('カ', 'ka',  [],       'a', 1, 0), ('キ', 'ki',  [],       'i', 1, 1),
    ('ク', 'ku',  [],       'u', 1, 2), ('ケ', 'ke',  [],       'e', 1, 3),
    ('コ', 'ko',  [],       'o', 1, 4),
    ('サ', 'sa',  [],       'a', 2, 0), ('シ', 'shi', ['si'],   'i', 2, 1),
    ('ス', 'su',  [],       'u', 2, 2), ('セ', 'se',  [],       'e', 2, 3),
    ('ソ', 'so',  [],       'o', 2, 4),
    ('タ', 'ta',  [],       'a', 3, 0), ('チ', 'chi', ['ti'],   'i', 3, 1),
    ('ツ', 'tsu', ['tu'],   'u', 3, 2), ('テ', 'te',  [],       'e', 3, 3),
    ('ト', 'to',  [],       'o', 3, 4),
    ('ナ', 'na',  [],       'a', 4, 0), ('ニ', 'ni',  [],       'i', 4, 1),
    ('ヌ', 'nu',  [],       'u', 4, 2), ('ネ', 'ne',  [],       'e', 4, 3),
    ('ノ', 'no',  [],       'o', 4, 4),
    ('ハ', 'ha',  [],       'a', 5, 0), ('ヒ', 'hi',  [],       'i', 5, 1),
    ('フ', 'fu',  ['hu'],   'u', 5, 2), ('ヘ', 'he',  [],       'e', 5, 3),
    ('ホ', 'ho',  [],       'o', 5, 4),
    ('マ', 'ma',  [],       'a', 6, 0), ('ミ', 'mi',  [],       'i', 6, 1),
    ('ム', 'mu',  [],       'u', 6, 2), ('メ', 'me',  [],       'e', 6, 3),
    ('モ', 'mo',  [],       'o', 6, 4),
    ('ヤ', 'ya',  [],       'a', 7, 0), ('ユ', 'yu',  [],       'u', 7, 2),
    ('ヨ', 'yo',  [],       'o', 7, 4),
    ('ラ', 'ra',  [],       'a', 8, 0), ('リ', 'ri',  [],       'i', 8, 1),
    ('ル', 'ru',  [],       'u', 8, 2), ('レ', 're',  [],       'e', 8, 3),
    ('ロ', 'ro',  [],       'o', 8, 4),
    ('ワ', 'wa',  [],       'a', 9, 0), ('ヲ', 'wo',  ['o'],    'o', 9, 4),
    ('ン', 'n',   ['nn'],   'n', 10, 0),
]


async def seed_cohorts(pool: asyncpg.Pool) -> None:
    await pool.execute(
        """
        INSERT INTO cohorts (name)
        SELECT 'Batch 16'
        WHERE NOT EXISTS (
            SELECT 1 FROM cohorts WHERE name = 'Batch 16'
        )
        """
    )


async def seed_admin(pool: asyncpg.Pool) -> None:
    await pool.execute(
        """
        INSERT INTO users (applicant_id, full_name, role)
        SELECT 'ADMIN', 'B-JET Admin', 'admin'
        WHERE NOT EXISTS (
            SELECT 1 FROM users WHERE applicant_id = 'ADMIN'
        )
        """
    )


async def seed_kana(pool: asyncpg.Pool) -> None:
    count = await pool.fetchval('SELECT COUNT(*) FROM kana_characters')
    if count and count >= 92:
        return

    rows = (
        [(*row, 'hiragana') for row in _HIRAGANA] +
        [(*row, 'katakana') for row in _KATAKANA]
    )
    await pool.executemany(
        """
        INSERT INTO kana_characters
            (character, romaji, aliases, vowel_group, row_order, col_order, script_type)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
        """,
        rows,
    )
    print(f'[seed] inserted {len(rows)} kana characters')
