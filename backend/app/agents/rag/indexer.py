"""LlamaIndex RAG indexer — indexes expense history and receipts for context retrieval."""
from pathlib import Path

from llama_index.core import VectorStoreIndex, Document, StorageContext
from llama_index.core.storage.docstore import SimpleDocumentStore
from llama_index.core.storage.index_store import SimpleIndexStore
from llama_index.core.vector_stores import SimpleVectorStore

from app.agents.llm_client import configure_llama_index

_INDEX_DIR = Path("/tmp/opensplit_rag_index")


def get_or_create_index() -> VectorStoreIndex:
    configure_llama_index()
    if _INDEX_DIR.exists():
        storage_context = StorageContext.from_defaults(persist_dir=str(_INDEX_DIR))
        return VectorStoreIndex([], storage_context=storage_context)

    storage_context = StorageContext.from_defaults(
        docstore=SimpleDocumentStore(),
        index_store=SimpleIndexStore(),
        vector_store=SimpleVectorStore(),
    )
    index = VectorStoreIndex([], storage_context=storage_context)
    _INDEX_DIR.mkdir(parents=True, exist_ok=True)
    index.storage_context.persist(persist_dir=str(_INDEX_DIR))
    return index


def index_expense(expense_id: str, text: str) -> None:
    """Add or update an expense document in the index."""
    configure_llama_index()
    index = get_or_create_index()
    doc = Document(text=text, doc_id=expense_id)
    index.insert(doc)
    index.storage_context.persist(persist_dir=str(_INDEX_DIR))
