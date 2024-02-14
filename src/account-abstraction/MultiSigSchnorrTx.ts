import Schnorrkel from "aams-test/dist/schnorrkel"
import { Challenge, Key, PublicNonces, Signature, SignatureOutput } from "aams-test/dist/types"
import SchnorrSigner from "aams-test/dist/utils/SchnorrSigner"
import { sumMultiSchnorrSigs } from "aams-test/dist/utils/schnorr-helpers"
import { ethers } from "ethers"
import { Hex } from "viem"

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
  // nonces: MuSigSignersNonces = {}
  // publicKeys: MuSigSignersPubKeys = {}
  // signatures: MuSigSingleSigns = {}
  combinedPubKey?: Key
  msg: string = ""
  pubKeys: Key[] = []
  pubNonces: PublicNonces[] = []
  opHash: Hex = "0x"
  isInitialized: boolean = false
  signatures: SignatureOutput[] = []

  constructor(signers: SchnorrSigner[], opHash: Hex) {
    console.log("[musigtx] create tx", this.isInitialized, { signers })
    this.signers = signers
    if (this.isInitialized) return
    if (signers.length < 2) {
      throw Error("At least 2 signers should be provided")
    }
    signers.map((sig) => {
      const _signerAddress = sig.getAddress()
      console.log("[musigtx] create signer", _signerAddress)
      // this.nonces[_signerAddress] = sig.getPublicNonces()
      // this.publicKeys[_signerAddress] = sig.getPublicKey()
    })
    const publicKeys: Key[] = signers.map((signer) => signer.getPublicKey())
    const publicNonces: PublicNonces[] = signers.map((signer) => signer.getPublicNonces())
    this.pubKeys = publicKeys
    this.pubNonces = publicNonces
    this.combinedPubKey = Schnorrkel.getCombinedPublicKey(publicKeys)
    this.opHash = opHash
    console.log("[musigtx] create pn", this.pubNonces)
    this.isInitialized = true
  }

  setMsg(msg: string) {
    this.msg = msg
  }

  setOpHash(hash: Hex) {
    this.opHash = hash
  }

  getMsg(): string {
    return this.msg
  }

  singleSignMessage(signer: SchnorrSigner) {
    console.log("[musigtx] single sign nonces", this.msg, this.pubKeys, this.pubNonces)
    const op = this.opHash
    const pk = this.pubKeys
    const pn = this.pubNonces
    const _sig = signer.multiSignMessage(op, pk, pn)
    this.signatures.push(_sig)
    console.log("[musigtx] single sign done", _sig)
    return _sig
  }

  singleSignHash(signer: SchnorrSigner) {
    console.log("[musigtx] single sign nonces", this.msg, this.pubKeys, this.pubNonces)
    const op = this.opHash
    const pk = this.pubKeys
    const pn = this.pubNonces
    const _sig = signer.multiSignHash(op, pk, pn)
    this.signatures.push(_sig)
    console.log("[musigtx] single sign done hash", _sig)
    return _sig
  }

  // setSingleSign(signer: SchnorrSigner, signature: SignatureOutput) {
  //   const _signer = signer.getAddress()
  //   console.log("[musigtx] set single sign", { signature })
  //   console.log("[musigtx] set single sign", _signer)
  //   this.signatures[_signer] = signature
  // }

  // getSingleSignature(signer: SchnorrSigner): SignatureOutput {
  //   return this.signatures[signer.getAddress()]
  // }

  // getPubNonces(): PublicNonces[] {
  //   return Object.entries(this.nonces).map(([, nonce]) => {
  //     return nonce
  //   })
  // }

  // getPublicKeys(): Key[] {
  //   return Object.entries(this.publicKeys).map(([, pk]) => {
  //     return pk
  //   })
  // }

  getMultiSign() {
    console.log("[musigtx] get multi sign")
    if (!this.combinedPubKey || !this.signatures || this.signers.length < 2) return
    const _sigs: Signature[] = this.signatures.map((sig) => sig.signature)
    const challenges: Challenge[] = this.signatures.map((sig) => sig.challenge)
    console.log("[musigtx] get multi sign array", _sigs)
    const _summed = sumMultiSchnorrSigs(_sigs)

    // the multisig px and parity
    const px = ethers.utils.hexlify(this.combinedPubKey.buffer.subarray(1, 33))
    const parity = this.combinedPubKey.buffer[0] - 2 + 27

    // challenge for every signature has to be the same, so pick first one
    const e = challenges[0]

    // wrap the result
    const abiCoder = new ethers.utils.AbiCoder()
    const sigData = abiCoder.encode(["bytes32", "bytes32", "bytes32", "uint8"], [px, e.buffer, _summed.buffer, parity])
    console.log("[musigtx] get multi sign ===>", sigData)
    return sigData
  }
}
