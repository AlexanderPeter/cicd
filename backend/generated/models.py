from sqlalchemy import Integer, PrimaryKeyConstraint, String, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

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
