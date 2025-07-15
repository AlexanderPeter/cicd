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
