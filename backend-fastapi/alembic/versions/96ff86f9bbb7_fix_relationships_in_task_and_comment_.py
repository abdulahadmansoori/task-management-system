"""Fix relationships in Task and Comment models

Revision ID: 96ff86f9bbb7
Revises: bf1a0ba1db79
Create Date: 2024-08-04 18:46:49.156584

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '96ff86f9bbb7'
down_revision: Union[str, None] = 'bf1a0ba1db79'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###
