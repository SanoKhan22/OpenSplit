"""
Single entry point for all LLM calls in OpenSplit.
All agent code MUST use this module — never instantiate LLM clients directly.
"""
from functools import lru_cache

from llama_index.core import Settings as LlamaSettings
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding

from app.config import settings


@lru_cache(maxsize=1)
def get_llm() -> OpenAI:
    return OpenAI(
        model=settings.openai_model,
        api_key=settings.openai_api_key,
        temperature=0.0,
    )


@lru_cache(maxsize=1)
def get_embedding_model() -> OpenAIEmbedding:
    return OpenAIEmbedding(
        model=settings.openai_embedding_model,
        api_key=settings.openai_api_key,
    )


def configure_llama_index() -> None:
    """Call once at startup to configure global LlamaIndex settings."""
    LlamaSettings.llm = get_llm()
    LlamaSettings.embed_model = get_embedding_model()
