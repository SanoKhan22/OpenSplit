"""Tests for groups endpoints."""


def _register_and_token(client, email: str = "g@example.com") -> str:
    res = client.post(
        "/api/auth/register",
        json={"email": email, "password": "password123"},
    )
    return res.json()["data"]["access_token"]


def test_create_group(client) -> None:  # type: ignore[no-untyped-def]
    token = _register_and_token(client, "cg@example.com")
    res = client.post(
        "/api/groups",
        json={"name": "Trip to Paris", "currency": "EUR"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["name"] == "Trip to Paris"
    assert data["currency"] == "EUR"


def test_list_groups(client) -> None:  # type: ignore[no-untyped-def]
    token = _register_and_token(client, "lg@example.com")
    client.post(
        "/api/groups",
        json={"name": "House Expenses", "currency": "USD"},
        headers={"Authorization": f"Bearer {token}"},
    )
    res = client.get("/api/groups", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    groups = res.json()["data"]
    assert len(groups) >= 1


def test_get_group(client) -> None:  # type: ignore[no-untyped-def]
    token = _register_and_token(client, "gg@example.com")
    created = client.post(
        "/api/groups",
        json={"name": "Camping", "currency": "USD"},
        headers={"Authorization": f"Bearer {token}"},
    ).json()["data"]
    res = client.get(
        f"/api/groups/{created['id']}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    assert res.json()["data"]["id"] == created["id"]


def test_update_group(client) -> None:  # type: ignore[no-untyped-def]
    token = _register_and_token(client, "ug@example.com")
    created = client.post(
        "/api/groups",
        json={"name": "Old Name", "currency": "USD"},
        headers={"Authorization": f"Bearer {token}"},
    ).json()["data"]
    res = client.patch(
        f"/api/groups/{created['id']}",
        json={"name": "New Name"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    assert res.json()["data"]["name"] == "New Name"


def test_delete_group(client) -> None:  # type: ignore[no-untyped-def]
    token = _register_and_token(client, "dg@example.com")
    created = client.post(
        "/api/groups",
        json={"name": "To Delete", "currency": "USD"},
        headers={"Authorization": f"Bearer {token}"},
    ).json()["data"]
    res = client.delete(
        f"/api/groups/{created['id']}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    # Should 404 after deletion (soft-deleted)
    res2 = client.get(
        f"/api/groups/{created['id']}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res2.status_code == 404
