"""Tests for expense endpoints."""


def _setup(client, email: str) -> tuple[str, str]:
    """Register a user, create a group, return (token, group_id)."""
    reg = client.post(
        "/api/auth/register",
        json={"email": email, "password": "password123"},
    )
    token = reg.json()["data"]["access_token"]
    me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    user_id = me.json()["data"]["id"]

    grp = client.post(
        "/api/groups",
        json={"name": "Expense Group", "currency": "USD"},
        headers={"Authorization": f"Bearer {token}"},
    )
    group_id = grp.json()["data"]["id"]
    return token, group_id, user_id


def test_create_expense(client) -> None:  # type: ignore[no-untyped-def]
    token, group_id, user_id = _setup(client, "ce@example.com")
    res = client.post(
        "/api/expenses",
        json={
            "group_id": group_id,
            "title": "Dinner",
            "amount_cents": 5000,
            "currency": "USD",
            "splits": [{"user_id": user_id, "share_cents": 5000}],
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["title"] == "Dinner"
    assert data["amount_cents"] == 5000


def test_expense_split_mismatch(client) -> None:  # type: ignore[no-untyped-def]
    token, group_id, user_id = _setup(client, "sm@example.com")
    res = client.post(
        "/api/expenses",
        json={
            "group_id": group_id,
            "title": "Bad Split",
            "amount_cents": 5000,
            "currency": "USD",
            "splits": [{"user_id": user_id, "share_cents": 3000}],  # mismatch
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 422


def test_list_expenses(client) -> None:  # type: ignore[no-untyped-def]
    token, group_id, user_id = _setup(client, "le@example.com")
    client.post(
        "/api/expenses",
        json={
            "group_id": group_id,
            "title": "Groceries",
            "amount_cents": 2000,
            "currency": "USD",
            "splits": [{"user_id": user_id, "share_cents": 2000}],
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    res = client.get(
        f"/api/expenses/group/{group_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    assert len(res.json()["data"]) >= 1


def test_delete_expense(client) -> None:  # type: ignore[no-untyped-def]
    token, group_id, user_id = _setup(client, "de@example.com")
    created = client.post(
        "/api/expenses",
        json={
            "group_id": group_id,
            "title": "To Delete",
            "amount_cents": 1000,
            "currency": "USD",
            "splits": [{"user_id": user_id, "share_cents": 1000}],
        },
        headers={"Authorization": f"Bearer {token}"},
    ).json()["data"]
    res = client.delete(
        f"/api/expenses/{created['id']}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
