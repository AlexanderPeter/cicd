from typing import List

from sqlalchemy import DateTime, ForeignKeyConstraint, Integer, PrimaryKeyConstraint, String, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
import datetime

class Base(DeclarativeBase):
    pass


class Poll(Base):
    __tablename__ = 'poll'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='poll_pkey'),
        UniqueConstraint('code', name='poll_code_key')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(Text)
    code: Mapped[str] = mapped_column(String(10))

    slot: Mapped[List['Slot']] = relationship('Slot', back_populates='poll')


class Slot(Base):
    __tablename__ = 'slot'
    __table_args__ = (
        ForeignKeyConstraint(['poll_id'], ['poll.id'], ondelete='CASCADE', name='fk_poll'),
        PrimaryKeyConstraint('id', name='slot_pkey')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    poll_id: Mapped[int] = mapped_column(Integer)
    start_time: Mapped[datetime.datetime] = mapped_column(DateTime)
    end_time: Mapped[datetime.datetime] = mapped_column(DateTime)

    poll: Mapped['Poll'] = relationship('Poll', back_populates='slot')
    vote: Mapped[List['Vote']] = relationship('Vote', back_populates='slot')


class Vote(Base):
    __tablename__ = 'vote'
    __table_args__ = (
        ForeignKeyConstraint(['slot_id'], ['slot.id'], ondelete='CASCADE', name='fk_slot'),
        PrimaryKeyConstraint('id', name='vote_pkey'),
        UniqueConstraint('slot_id', 'participant_name', name='unique_vote_per_slot')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slot_id: Mapped[int] = mapped_column(Integer)
    participant_name: Mapped[str] = mapped_column(Text)
    choice: Mapped[str] = mapped_column(String(10))

    slot: Mapped['Slot'] = relationship('Slot', back_populates='vote')
