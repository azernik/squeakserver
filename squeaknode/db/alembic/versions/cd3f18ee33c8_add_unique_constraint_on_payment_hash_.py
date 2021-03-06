"""Add unique constraint on payment hash of received offer

Revision ID: cd3f18ee33c8
Revises: df59995f322c
Create Date: 2021-01-27 17:40:06.995928

"""
from alembic import op


# revision identifiers, used by Alembic.
revision = 'cd3f18ee33c8'
down_revision = 'df59995f322c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('received_offer', schema=None) as batch_op:
        batch_op.create_unique_constraint(
            'uq_received_offer_payment_hash', ['payment_hash'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('received_offer', schema=None) as batch_op:
        batch_op.drop_constraint(
            'uq_received_offer_payment_hash', type_='unique')

    # ### end Alembic commands ###
