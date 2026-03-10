"""Tests for the health endpoint."""


def test_health(client) -> None:  # type: ignore[no-untyped-def]
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
