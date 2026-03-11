"""add invite_code to groups

Revision ID: 0002
Revises: 0001
Create Date: 2026-03-11 00:00:00.000000
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add invite_code column to groups table
    op.add_column("groups", sa.Column("invite_code", sa.String(10), nullable=True))
    
    # Generate random invite codes for existing groups using SQL
    op.execute("""
        UPDATE groups 
        SET invite_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8))
        WHERE invite_code IS NULL
    """)
    
    # Make invite_code NOT NULL after populating existing rows
    op.alter_column("groups", "invite_code", nullable=False)
    
    # Add unique constraint on invite_code
    op.create_unique_constraint("uq_groups_invite_code", "groups", ["invite_code"])


def downgrade() -> None:
    op.drop_constraint("uq_groups_invite_code", "groups", type_="unique")
    op.drop_column("groups", "invite_code")
