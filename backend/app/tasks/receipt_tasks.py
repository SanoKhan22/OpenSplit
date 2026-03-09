"""Celery task: async receipt OCR + LLM extraction."""
from app.tasks.celery_app import celery_app


@celery_app.task(name="tasks.process_receipt", bind=True, max_retries=3)
def process_receipt_task(self, image_bytes: bytes, user_id: str) -> dict:  # type: ignore[misc]
    try:
        from app.agents.receipt_agent import ReceiptAgent
        agent = ReceiptAgent()
        result = agent.extract(image_bytes)
        return {
            "merchant": result.merchant,
            "date": result.date,
            "currency": result.currency,
            "total_cents": result.total_cents,
            "tax_cents": result.tax_cents,
            "tip_cents": result.tip_cents,
            "subtotal_cents": result.subtotal_cents,
            "line_items": [
                {"description": item.description, "amount_cents": item.amount_cents}
                for item in result.line_items
            ],
        }
    except Exception as exc:
        raise self.retry(exc=exc, countdown=5)
