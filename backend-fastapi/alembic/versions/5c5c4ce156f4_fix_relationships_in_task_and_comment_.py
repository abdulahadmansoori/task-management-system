"""Fix relationships in Task and Comment models3

Revision ID: 5c5c4ce156f4
Revises: ae53b0449f88
Create Date: 2024-08-04 19:18:21.046869

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5c5c4ce156f4'
down_revision: Union[str, None] = 'ae53b0449f88'
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
