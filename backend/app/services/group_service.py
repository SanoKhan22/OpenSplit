import uuid
import secrets
import string
from datetime import datetime, UTC

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.group import GroupModel, GroupMemberModel
from app.models.user import UserModel
from app.schemas.group import GroupCreateSchema, GroupUpdateSchema, GroupSchema, GroupMemberSchema, GroupJoinSchema


class GroupService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def _generate_invite_code(self) -> str:
        """Generate a unique 8-character invite code."""
        while True:
            code = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))
            existing = self.db.query(GroupModel).filter(
                GroupModel.invite_code == code,
                GroupModel.deleted_at.is_(None),
            ).first()
            if not existing:
                return code

    def _get_or_404(self, group_id: uuid.UUID) -> GroupModel:
        group = self.db.query(GroupModel).filter(
            GroupModel.id == group_id,
            GroupModel.deleted_at.is_(None),
        ).first()
        if not group:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")
        return group

    def _assert_member(self, group_id: uuid.UUID, user: UserModel) -> GroupMemberModel:
        member = self.db.query(GroupMemberModel).filter(
            GroupMemberModel.group_id == group_id,
            GroupMemberModel.user_id == user.id,
            GroupMemberModel.deleted_at.is_(None),
        ).first()
        if not member:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a group member")
        return member

    def create(self, payload: GroupCreateSchema, user: UserModel) -> GroupSchema:
        group = GroupModel(
            name=payload.name,
            description=payload.description,
            currency=payload.currency,
            invite_code=self._generate_invite_code(),
            created_by_id=user.id,
        )
        self.db.add(group)
        self.db.flush()

        membership = GroupMemberModel(group_id=group.id, user_id=user.id, is_admin=True)
        self.db.add(membership)
        self.db.commit()
        self.db.refresh(group)
        return GroupSchema.model_validate(group)

    def list_for_user(self, user: UserModel) -> list[GroupSchema]:
        memberships = self.db.query(GroupMemberModel).filter(
            GroupMemberModel.user_id == user.id,
            GroupMemberModel.deleted_at.is_(None),
        ).all()
        group_ids = [m.group_id for m in memberships]
        groups = self.db.query(GroupModel).filter(
            GroupModel.id.in_(group_ids),
            GroupModel.deleted_at.is_(None),
        ).all()
        return [GroupSchema.model_validate(g) for g in groups]

    def get(self, group_id: uuid.UUID, user: UserModel) -> GroupSchema:
        group = self._get_or_404(group_id)
        self._assert_member(group_id, user)
        return GroupSchema.model_validate(group)

    def get_members(self, group_id: uuid.UUID, user: UserModel) -> list[dict]:
        """Get all members of a group with their user details."""
        self._get_or_404(group_id)
        self._assert_member(group_id, user)
        members = self.db.query(GroupMemberModel).filter(
            GroupMemberModel.group_id == group_id,
            GroupMemberModel.deleted_at.is_(None),
        ).all()
        result = []
        for m in members:
            member_user = self.db.query(UserModel).filter(UserModel.id == m.user_id).first()
            if member_user:
                result.append({
                    "id": m.id,
                    "group_id": m.group_id,
                    "user_id": m.user_id,
                    "is_admin": m.is_admin,
                    "nickname": m.nickname,
                    "user_display_name": member_user.display_name,
                    "user_email": member_user.email,
                })
        return result

    def update(self, group_id: uuid.UUID, payload: GroupUpdateSchema, user: UserModel) -> GroupSchema:
        group = self._get_or_404(group_id)
        member = self._assert_member(group_id, user)
        if not member.is_admin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
        if payload.name is not None:
            group.name = payload.name
        if payload.description is not None:
            group.description = payload.description
        self.db.commit()
        self.db.refresh(group)
        return GroupSchema.model_validate(group)

    def delete(self, group_id: uuid.UUID, user: UserModel) -> None:
        group = self._get_or_404(group_id)
        member = self._assert_member(group_id, user)
        if not member.is_admin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
        group.deleted_at = datetime.now(UTC)
        self.db.commit()

    def add_member(self, group_id: uuid.UUID, user_id: uuid.UUID, current_user: UserModel) -> GroupMemberSchema:
        group = self._get_or_404(group_id)
        self._assert_member(group_id, current_user)
        existing = self.db.query(GroupMemberModel).filter(
            GroupMemberModel.group_id == group_id,
            GroupMemberModel.user_id == user_id,
            GroupMemberModel.deleted_at.is_(None),
        ).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already a member")
        member = GroupMemberModel(group_id=group_id, user_id=user_id)
        self.db.add(member)
        self.db.commit()
        self.db.refresh(member)
        return GroupMemberSchema.model_validate(member)

    def join_by_code(self, payload: GroupJoinSchema, user: UserModel) -> GroupSchema:
        """Join a group using an invite code."""
        group = self.db.query(GroupModel).filter(
            GroupModel.invite_code == payload.invite_code.upper(),
            GroupModel.deleted_at.is_(None),
        ).first()
        if not group:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid invite code")
        
        # Check if already a member
        existing = self.db.query(GroupMemberModel).filter(
            GroupMemberModel.group_id == group.id,
            GroupMemberModel.user_id == user.id,
            GroupMemberModel.deleted_at.is_(None),
        ).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already a member of this group")
        
        # Add user as member
        member = GroupMemberModel(group_id=group.id, user_id=user.id, is_admin=False)
        self.db.add(member)
        self.db.commit()
        self.db.refresh(group)
        return GroupSchema.model_validate(group)
