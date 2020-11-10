import logging
from contextlib import contextmanager
from datetime import datetime, timedelta

import sqlalchemy
from sqlalchemy import (
    BigInteger,
    Binary,
    Boolean,
    Column,
    DateTime,
    Integer,
    MetaData,
    String,
    Table,
    func,
    literal,
)
from sqlalchemy.sql import and_, or_, select
from squeak.core import CSqueak

from squeaknode.blockchain.util import parse_block_header
from squeaknode.core.offer import Offer
from squeaknode.core.offer_with_peer import OfferWithPeer
from squeaknode.core.squeak_entry import SqueakEntry
from squeaknode.core.squeak_entry_with_profile import SqueakEntryWithProfile
from squeaknode.server.squeak_peer import SqueakPeer
from squeaknode.server.squeak_profile import SqueakProfile
from squeaknode.server.sent_payment import SentPayment
from squeaknode.server.util import get_hash

logger = logging.getLogger(__name__)


class Models:
    def __init__(self, schema=None):
        self.schema = schema
        self.metadata = MetaData(schema=schema)

        self.squeaks = Table(
            "squeak",
            self.metadata,
            Column("hash", String(64), primary_key=True),
            Column("created", DateTime, server_default=func.now(), nullable=False),
            Column("n_version", Integer, nullable=False),
            Column("hash_enc_content", String(64), nullable=False),
            Column("hash_reply_sqk", String(64), nullable=False),
            Column("hash_block", String(64), nullable=False),
            Column("n_block_height", Integer, nullable=False),
            Column("vch_script_pub_key", Binary, nullable=False),
            Column("vch_encryption_key", Binary, nullable=False),
            Column("enc_data_key", String, nullable=False),
            Column("iv", String(64), nullable=False),
            Column("n_time", Integer, nullable=False),
            Column("n_nonce", BigInteger, nullable=False),
            Column("enc_content", String(2272), nullable=False),
            Column("vch_script_sig", Binary, nullable=False),
            Column("author_address", String(35), index=True, nullable=False),
            Column("vch_decryption_key", Binary, nullable=True),
            Column("block_header", Binary, nullable=True),
        )

        self.profiles = Table(
            "profile",
            self.metadata,
            Column("profile_id", Integer, primary_key=True),
            Column("created", DateTime, server_default=func.now(), nullable=False),
            Column("profile_name", String, unique=True, nullable=False),
            Column("private_key", Binary),
            Column("address", String(35), unique=True, nullable=False),
            Column("sharing", Boolean, nullable=False),
            Column("following", Boolean, nullable=False),
        )

        self.peers = Table(
            "peer",
            self.metadata,
            Column("id", Integer, primary_key=True),
            Column("created", DateTime, server_default=func.now(), nullable=False),
            Column("peer_name", String),
            Column("server_host", String, nullable=False),
            Column("server_port", Integer, nullable=False),
            Column("uploading", Boolean, nullable=False),
            Column("downloading", Boolean, nullable=False),
        )

        self.offers = Table(
            "offer",
            self.metadata,
            Column("offer_id", Integer, primary_key=True),
            Column("created", DateTime, server_default=func.now(), nullable=False),
            Column("squeak_hash", String(64), nullable=False),
            Column("key_cipher", Binary, nullable=False),
            Column("iv", Binary, nullable=False),
            Column("payment_hash", String(64), nullable=False),
            Column("invoice_timestamp", Integer, nullable=False),
            Column("invoice_expiry", Integer, nullable=False),
            Column("price_msat", Integer, nullable=False),
            Column("payment_request", String, nullable=False),
            Column("destination", String(66), nullable=False),
            Column("node_host", String, nullable=False),
            Column("node_port", Integer, nullable=False),
            Column("peer_id", Integer, nullable=False),
        )

        self.sent_payments = Table(
            "sent_payment",
            self.metadata,
            Column("sent_payment_id", Integer, primary_key=True),
            Column("created", DateTime, server_default=func.now(), nullable=False),
            Column("offer_id", Integer, nullable=False),
            Column("peer_id", Integer, nullable=False),
            Column("squeak_hash", String(64), nullable=False),
            Column("preimage_hash", String(64), nullable=False),
            Column("preimage", String(64), nullable=False),
            Column("amount", Integer, nullable=False),
            Column("node_pubkey", String(66), nullable=False),
            Column("preimage_is_valid", Boolean, nullable=False),
        )