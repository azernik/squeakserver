import logging
import threading
from abc import ABC
from abc import abstractmethod

from squeaknode.sync.peer_connection import PeerConnection

logger = logging.getLogger(__name__)


class NetworkSync(ABC):

    def __init__(
        self,
        squeak_controller,
    ):
        self.squeak_controller = squeak_controller
        self.stopped = threading.Event()

    @abstractmethod
    def get_peers_to_sync(self):
        pass

    @abstractmethod
    def sync_peer(self, peer_connection):
        pass

    def stop(self):
        self.stopped.set()

    def sync(self):
        for peer in self.get_peers_to_sync():
            sync_peer_thread = threading.Thread(
                target=self._sync_peer,
                args=(peer,),
            )
            sync_peer_thread.start()
        # TODO: sleep for timeout and then call self._stop()

    def _sync_peer(self, peer):
        with PeerConnection(
                self.squeak_controller,
                peer,
                self.stopped,
        ).open_connection() as peer_connection:
            self.sync_peer(peer_connection)


class DownloadSync(NetworkSync):

    def get_peers_to_sync(self):
        return self.squeak_controller.get_downloading_peers()

    @abstractmethod
    def sync_peer(self, peer_connection):
        pass


class UploadSync(NetworkSync):

    def get_peers_to_sync(self):
        return self.squeak_controller.get_uploading_peers()

    @abstractmethod
    def sync_peer(self, peer_connection):
        pass


class TimelineDownloadSync(DownloadSync):

    def __init__(
        self,
        squeak_controller,
        min_block,
        max_block,
    ):
        super().__init__(squeak_controller)
        self.min_block = min_block
        self.max_block = max_block

    def sync_peer(self, peer_connection):
        peer_connection.download(self.min_block, self.max_block)


class SingleSqueakDownloadSync(DownloadSync):

    def __init__(
        self,
        squeak_controller,
        squeak_hash: bytes,
    ):
        super().__init__(squeak_controller)
        self.squeak_hash = squeak_hash

    def sync_peer(self, peer_connection):
        peer_connection.download_single_squeak(self.squeak_hash)


class TimelineUploadSync(UploadSync):

    def __init__(
        self,
        squeak_controller,
    ):
        super().__init__(squeak_controller)

    def sync_peer(self, peer_connection):
        peer_connection.upload()


class SingleSqueakUploadSync(UploadSync):

    def __init__(
        self,
        squeak_controller,
        squeak_hash: bytes,
    ):
        super().__init__(squeak_controller)
        self.squeak_hash = squeak_hash

    def sync_peer(self, peer_connection):
        peer_connection.upload_single_squeak(self.squeak_hash)
