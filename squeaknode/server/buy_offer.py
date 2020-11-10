class BuyOffer:
    def __init__(
        self,
        squeak_hash,
        key_cipher,
        iv,
        price_msat,
        preimage_hash,
        payment_request,
        pubkey,
        host,
        port,
        proof,
    ):
        self.squeak_hash = squeak_hash
        self.key_cipher = key_cipher
        self.iv = iv
        self.price_msat = price_msat
        self.preimage_hash = preimage_hash
        self.payment_request = payment_request
        self.pubkey = pubkey
        self.host = host
        self.port = port
        self.proof = proof
