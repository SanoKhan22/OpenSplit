"""Tests for auth endpoints."""
import pytest


def test_register(client) -> None:  # type: ignore[no-untyped-def]
    res = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "password123", "display_name": "Test User"},
    )
    assert res.status_code == 200
    body = res.json()
    assert body["message"] == "success"
    assert body["data"]["access_token"]


def test_register_duplicate_email(client) -> None:  # type: ignore[no-untyped-def]
    payload = {"email": "dup@example.com", "password": "password123"}
    client.post("/api/auth/register", json=payload)
    res = client.post("/api/auth/register", json=payload)
    assert res.status_code == 409


def test_login(client) -> None:  # type: ignore[no-untyped-def]
    client.post(
        "/api/auth/register",
        json={"email": "login@example.com", "password": "password123"},
    )
    res = client.post(
        "/api/auth/login",
        json={"email": "login@example.com", "password": "password123"},
    )
    assert res.status_code == 200
    assert res.json()["data"]["access_token"]


def test_login_wrong_password(client) -> None:  # type: ignore[no-untyped-def]
    client.post(
        "/api/auth/register",
        json={"email": "wrong@example.com", "password": "correct"},
    )
    res = client.post(
        "/api/auth/login",
        json={"email": "wrong@example.com", "password": "incorrect"},
    )
    assert res.status_code == 401


def test_guest_login(client) -> None:  # type: ignore[no-untyped-def]
    res = client.post("/api/auth/guest", json={"display_name": "Guest Tester"})
    assert res.status_code == 200
    assert res.json()["data"]["access_token"]


def test_me(client) -> None:  # type: ignore[no-untyped-def]
    reg = client.post(
        "/api/auth/register",
        json={"email": "me@example.com", "password": "password123", "display_name": "Me"},
    )
    token = reg.json()["data"]["access_token"]
    res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.json()["data"]["email"] == "me@example.com"


def test_me_unauthenticated(client) -> None:  # type: ignore[no-untyped-def]
    res = client.get("/api/auth/me")
    assert res.status_code == 403
