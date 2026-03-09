"""Receipt scanning agent — OCR → LLM extraction → structured expense data."""
from __future__ import annotations

import base64
import json
from dataclasses import dataclass

from app.agents.llm_client import get_llm


@dataclass
class ReceiptLineItem:
    description: str
    amount_cents: int  # Always cents — never floats


@dataclass
class ReceiptExtractionResult:
    merchant: str | None
    date: str | None
    subtotal_cents: int
    tax_cents: int
    tip_cents: int
    total_cents: int
    line_items: list[ReceiptLineItem]
    currency: str


_SYSTEM_PROMPT = """You are a receipt parsing assistant. 
Extract all information from the receipt image and return a JSON object with:
{
  "merchant": string or null,
  "date": "YYYY-MM-DD" or null,
  "currency": "USD" (3-letter ISO code),
  "subtotal_cents": integer (subtotal in cents),
  "tax_cents": integer,
  "tip_cents": integer,
  "total_cents": integer,
  "line_items": [
    {"description": string, "amount_cents": integer}
  ]
}
IMPORTANT: All monetary values MUST be integers in cents (e.g. $12.50 = 1250).
Never use floats. If a value is unknown, use 0."""


class ReceiptAgent:
    def __init__(self) -> None:
        self.llm = get_llm()

    def extract(self, image_bytes: bytes) -> ReceiptExtractionResult:
        """Extract structured data from a receipt image using vision LLM."""
        b64 = base64.b64encode(image_bytes).decode()

        from openai import OpenAI as OpenAIClient
        from app.config import settings

        client = OpenAIClient(api_key=settings.openai_api_key)
        response = client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{b64}"},
                        },
                        {"type": "text", "text": "Extract all receipt data as JSON."},
                    ],
                },
            ],
            response_format={"type": "json_object"},
        )

        raw = json.loads(response.choices[0].message.content or "{}")
        return ReceiptExtractionResult(
            merchant=raw.get("merchant"),
            date=raw.get("date"),
            subtotal_cents=int(raw.get("subtotal_cents", 0)),
            tax_cents=int(raw.get("tax_cents", 0)),
            tip_cents=int(raw.get("tip_cents", 0)),
            total_cents=int(raw.get("total_cents", 0)),
            currency=raw.get("currency", "USD"),
            line_items=[
                ReceiptLineItem(
                    description=item["description"],
                    amount_cents=int(item["amount_cents"]),
                )
                for item in raw.get("line_items", [])
            ],
        )
