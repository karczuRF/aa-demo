import Schnorrkel from "aams-test/dist/schnorrkel"
import { Key, PublicNonces, SignatureOutput } from "aams-test/dist/types"
import SchnorrSigner from "aams-test/dist/utils/SchnorrSigner"
import { sumMultiSchnorrSigs } from "aams-test/dist/utils/schnorr-helpers"
import { ethers } from "ethers"

export type MuSigSingleSigns = {
  [signerAddress: string]: SignatureOutput
}

export type MuSigSignersNonces = {
  [signerAddress: string]: PublicNonces
}

export type MuSigSignersPubKeys = {
  [signerAddress: string]: Key
}

export default class MultiSigSchnorrTx {
  readonly signers: SchnorrSigner[]
  nonces: MuSigSignersNonces = {}
  signatures: MuSigSingleSigns = {}
  combinedPubKey: Key

  constructor(signers: SchnorrSigner[]) {
    this.signers = signers
    signers.map((sig) => {
      const _signerAddress = sig.getAddress()
      this.nonces[_signerAddress] = sig.getPublicNonces()
    })
    const _pubKeys = signers.flatMap((sig) => sig.getPublicKey())
    this.combinedPubKey = Schnorrkel.getCombinedPublicKey(_pubKeys)
  }

  setSingleSign(signer: SchnorrSigner, signature: SignatureOutput) {
    this.signatures[signer.getAddress()] = signature
  }

  getMultiSign() {
    if (!this.signatures) return

    const _sigs = Object.entries(this.signatures).map(([, sig]) => {
      return sig.signature
    })
    const _summed = sumMultiSchnorrSigs(_sigs)

    // the multisig px and parity
    const px = ethers.utils.hexlify(this.combinedPubKey.buffer.subarray(1, 33))
    const parity = this.combinedPubKey.buffer[0] - 2 + 27

    const _challenges = Object.entries(this.signatures).map(([, sig]) => {
      return sig.challenge
    })
    // challenge for every signature has to be the same, so pick first one
    const e = _challenges[0]

    // wrap the result
    const abiCoder = new ethers.utils.AbiCoder()
    const sigData = abiCoder.encode(["bytes32", "bytes32", "bytes32", "uint8"], [px, e.buffer, _summed.buffer, parity])
    return sigData
  }
}
