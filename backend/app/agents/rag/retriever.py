"""RAG retriever — query the expense index for relevant context."""
from llama_index.core import QueryBundle

from app.agents.rag.indexer import get_or_create_index


def retrieve(query: str, top_k: int = 5) -> list[str]:
    """Retrieve relevant expense context for a query."""
    index = get_or_create_index()
    retriever = index.as_retriever(similarity_top_k=top_k)
    nodes = retriever.retrieve(QueryBundle(query_str=query))
    return [node.get_content() for node in nodes]
