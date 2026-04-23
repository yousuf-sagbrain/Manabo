import os
from contextlib import asynccontextmanager

# Load .env before any os.environ reads — pydantic-settings is in requirements.txt
from pydantic_settings import BaseSettings, SettingsConfigDict

class _Env(BaseSettings):
    database_url: str
    jwt_secret: str = 'dev-secret-change-in-prod'
    cors_origins: str = 'http://localhost:3000,http://localhost:4000'
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

_env = _Env()
os.environ.setdefault('DATABASE_URL', _env.database_url)
os.environ.setdefault('JWT_SECRET',   _env.jwt_secret)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.connection import init_pool, close_pool, get_pool
from db.seed import seed_kana, seed_admin, seed_cohorts
from db.migrate import run_migrations
from routers import auth, practice, test, admin, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_pool()
    pool = await get_pool()
    await run_migrations(pool)
    await seed_cohorts(pool)
    await seed_kana(pool)
    await seed_admin(pool)
    yield
    await close_pool()


app = FastAPI(
    title='Manabo',
    description='Manabo (学ぼ) — Hiragana & Katakana Learning Platform · Core API',
    version='0.1.0',
    lifespan=lifespan,
)

_cors_origins = [o.strip() for o in _env.cors_origins.split(',') if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth.router,     prefix='/auth',     tags=['auth'])
app.include_router(practice.router, prefix='/practice', tags=['practice'])
app.include_router(test.router,     prefix='/test',     tags=['test'])
app.include_router(admin.router,    prefix='/admin',    tags=['admin'])
app.include_router(users.router,    prefix='/users',    tags=['users'])


@app.get('/health', tags=['health'])
async def health():
    return {'status': 'ok', 'service': 'manabo-api'}
