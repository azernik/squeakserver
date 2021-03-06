import logging

from squeak.core import CSqueak

from proto import squeak_server_pb2
from squeaknode.core.squeak_controller import SqueakController
from squeaknode.core.util import get_hash

logger = logging.getLogger(__name__)


class SqueakServerHandler(object):
    """Handles server commands."""

    def __init__(self, squeak_controller: SqueakController):
        self.squeak_controller = squeak_controller

    def handle_posted_squeak(self, squeak: CSqueak):
        logger.info(
            "Handle posted squeak with hash: {}".format(get_hash(squeak).hex()))
        # Save the squeak
        self.squeak_controller.save_uploaded_squeak(squeak)

    def handle_get_squeak(self, squeak_hash: bytes):
        logger.info("Handle get squeak by hash: {}".format(squeak_hash.hex()))
        return self.squeak_controller.get_public_squeak(squeak_hash)

    def handle_lookup_squeaks(self, request):
        addresses = request.addresses
        min_block = request.min_block
        max_block = request.max_block
        logger.info(
            "Handle lookup squeaks with addresses: {}, min_block: {}, max_block: {}".format(
                str(addresses), min_block, max_block
            )
        )
        hashes = self.squeak_controller.lookup_squeaks(
            addresses, min_block, max_block)
        logger.info("Got number of hashes from db: {}".format(len(hashes)))
        allowed_addresses = self.squeak_controller.lookup_allowed_addresses(
            addresses)
        logger.info(
            "Got number of allowed addresses from db: {}".format(
                len(allowed_addresses))
        )
        latest_block_height = self.squeak_controller.get_best_block_height()
        return squeak_server_pb2.LookupSqueaksReply(
            latest_block_height=latest_block_height,
            hashes=hashes,
            allowed_addresses=allowed_addresses,
        )

    def handle_lookup_squeaks_to_download(self, request):
        network = request.network
        addresses = request.addresses
        min_block = request.min_block
        max_block = request.max_block
        if network != self.squeak_controller.get_network():
            raise Exception("Wrong network.")
        logger.info(
            "Handle lookup squeaks to download with addresses: {}, min_block: {}, max_block: {}".format(
                str(addresses), min_block, max_block
            )
        )
        hashes = self.squeak_controller.lookup_squeaks(
            addresses, min_block, max_block)
        logger.info(
            "Got number of hashes to download from db: {}".format(len(hashes)))
        return squeak_server_pb2.LookupSqueaksToDownloadReply(
            hashes=hashes,
        )

    def handle_lookup_squeaks_to_upload(self, request):
        network = request.network
        addresses = request.addresses
        if network != self.squeak_controller.get_network():
            raise Exception("Wrong network.")
        logger.info(
            "Handle lookup squeaks to upload with addresses: {}".format(
                str(addresses)
            )
        )
        network = self.squeak_controller.get_network()
        allowed_addresses = self.squeak_controller.lookup_allowed_addresses(
            addresses)
        latest_block_height = self.squeak_controller.get_best_block_height()
        block_range = self.squeak_controller.get_block_range()
        max_block = latest_block_height
        min_block = latest_block_height - block_range
        hashes = self.squeak_controller.lookup_squeaks(
            addresses, min_block, max_block)
        logger.info(
            "Got number of hashes to already uploaded from db: {}, number of allowed addresses: {} with min_block: {} and max_block: {}".format(
                len(hashes),
                len(allowed_addresses),
                min_block,
                max_block,
            )
        )
        return squeak_server_pb2.LookupSqueaksToUploadReply(
            hashes=hashes,
            addresses=allowed_addresses,
            min_block=min_block,
            max_block=max_block,
        )

    def handle_get_offer(self, squeak_hash: bytes, client_addr: str):
        logger.info(
            "Handle get offer by hash: {} from client_addr: {}".format(
                squeak_hash.hex(), client_addr
            )
        )
        buy_offer = self.squeak_controller.get_buy_offer(
            squeak_hash, client_addr)
        return buy_offer
