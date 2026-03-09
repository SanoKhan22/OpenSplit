from celery import Celery
from app.config import settings

celery_app = Celery(
    "opensplit",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=["app.tasks.receipt_tasks", "app.tasks.fx_tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    result_expires=3600,
)
