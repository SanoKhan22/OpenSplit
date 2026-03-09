"""Celery task: cache FX rates in Redis (TTL 1hr per AGENTS.md)."""
import json
import httpx
import redis

from app.config import settings
from app.tasks.celery_app import celery_app

_redis = redis.from_url(settings.redis_url)
_FX_KEY = "fx_rates"


@celery_app.task(name="tasks.refresh_fx_rates")
def refresh_fx_rates() -> dict:
    """Fetch latest FX rates and cache in Redis for 1hr."""
    if not settings.exchangerate_api_key:
        return {"error": "no fx api key configured"}

    url = f"https://v6.exchangerate-api.com/v6/{settings.exchangerate_api_key}/latest/USD"
    resp = httpx.get(url, timeout=10)
    resp.raise_for_status()
    rates = resp.json().get("conversion_rates", {})
    _redis.setex(_FX_KEY, settings.fx_cache_ttl_seconds, json.dumps(rates))
    return rates


def get_rate(from_currency: str, to_currency: str) -> float:
    """Get FX rate — convert at display time only, never store converted amounts."""
    cached = _redis.get(_FX_KEY)
    rates: dict = json.loads(cached) if cached else {}
    if not rates:
        rates = refresh_fx_rates()  # type: ignore[assignment]
    usd_to_from = rates.get(from_currency, 1.0)
    usd_to_to = rates.get(to_currency, 1.0)
    return usd_to_to / usd_to_from
