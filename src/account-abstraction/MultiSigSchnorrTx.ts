import Schnorrkel from "aams-test/dist/schnorrkel"
import { Challenge, Key, PublicNonces, Signature, SignatureOutput } from "aams-test/dist/types"
import SchnorrSigner from "aams-test/dist/utils/SchnorrSigner"
import { getAllCombos, pubKey2Address, sumMultiSchnorrSigs } from "aams-test/dist/utils/schnorr-helpers"
import { ethers } from "ethers"
import { Hex } from "viem"

export interface MuSigCombo {
  schnorrSigners: SchnorrSigner[]
  combinedPubKey: Key
  signatures: SignatureOutput[]
}
// TODO remove it and import (ts error)
// export function getAllCombinedPubKeysXofY(signers: SchnorrSigner[], x: number): Key[] {
//   if (signers.length < 2) {
//     throw Error("At least 2 signers should be provided")
//   }
//   // example X of Y signers defined as [A, B, C]
//   // 3 of 3: [ABC]
//   // 2 of 3: [AB, AC, BC, ABC]
//   // 1 of 3: [A, B, C, AB, AC, BC, ABC]

//   // create array of possible signers combinations limited by given X (out of Y) multisignature
//   const allSignersCombos: SchnorrSigner[][] = getAllCombos(signers).filter((combo) => combo.length >= x)
//   const publicKeysCombos: Key[][] = allSignersCombos.map((signers) => signers.map((signer) => signer.getPublicKey()))
//   const allCombinedPubKeys = publicKeysCombos.map((publicKeys) => Schnorrkel.getCombinedPublicKey(publicKeys))
//   return allCombinedPubKeys
// }

// function createCombos(signers: SchnorrSigner[], x: number): MuSigCombo[] {
//   if (signers.length < 2) {
//     throw Error("At least 2 signers should be provided")
//   }
//   const allSignersCombos: SchnorrSigner[][] = getAllCombos(signers).filter((combo) => combo.length >= x)
//   const combos: MuSigCombo[] = []
//   allSignersCombos.forEach((signers, i) => {
//     console.log("COMBO", signers)

//     const _pk = signers.map((signer) => signer.getPublicKey())
//     const combinedPubKey = Schnorrkel.getCombinedPublicKey(_pk)
//     combos[i] = { schnorrSigners: signers, combinedPubKey: combinedPubKey, signatures: [] }
//   })
//   console.log("COMBO", { combos })
//   return combos
// }
export type MuSigSingleSigns = {
  [signerAddress: string]: SignatureOutput
}

export type MuSigSignersNonces = {
  [signerAddress: string]: PublicNonces
}

export type MuSigSignersPubKeys = {
  [signerAddress: string]: Key
}

export type MuSigSignersCombos = {
  [signerAddress: string]: MuSigCombo[]
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
  allCombinedPubKeys: Key[] = []
  combos: MuSigCombo[] = []
  signersCombos: MuSigSignersCombos = {}
  minNrOfSigs: number = 0

  constructor(signers: SchnorrSigner[], opHash: Hex, minNrOfSigs: number = signers.length) {
    console.log("[musigtx] create tx", this.isInitialized, { signers })
    this.signers = signers
    this.minNrOfSigs = minNrOfSigs
    if (this.isInitialized) return
    if (signers.length < 2) {
      throw Error("At least 2 signers should be provided")
    }
    signers.map((sig) => {
      const _signerAddress = sig.getAddress()
      console.log("[musigtx] create signer", _signerAddress)
      this.signersCombos[_signerAddress] = []
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
    // this.allCombinedPubKeys = getAllCombinedPubKeysXofY(signers, 2)
    this.combos = this.createCombos(signers, 2)
    console.log("[musigtx] create comPubKeys", this.combinedPubKey)
    console.log("[musigtx] create comPubKeys", this.allCombinedPubKeys)

    this.isInitialized = true
  }

  createCombos(signers: SchnorrSigner[], x: number): MuSigCombo[] {
    if (signers.length < 2) {
      throw Error("At least 2 signers should be provided")
    }
    const allSignersCombos: SchnorrSigner[][] = getAllCombos(signers).filter((combo) => combo.length >= x)
    const combos: MuSigCombo[] = []
    allSignersCombos.forEach((signers, i) => {
      console.log("COMBO", signers)

      const _pk = signers.map((signer) => signer.getPublicKey())
      const combinedPubKey = Schnorrkel.getCombinedPublicKey(_pk)
      const _combo = { schnorrSigners: signers, combinedPubKey: combinedPubKey, signatures: [] }
      combos[i] = _combo

      signers.forEach((signer, i) => {
        this.signersCombos[signer.getAddress()].push(_combo)
      })
    })
    console.log("COMBO", { combos })
    return combos
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
    // TODO test
    this.combos[0].signatures?.push(_sig)
    this.signatures.push(_sig)
    console.log("[musigtx] single sign done", _sig)
    return _sig
  }

  // TODO !!!!!! HERE CHANGE `multiSigHash` params - take them every time from combo
  // each combo has different pubkey and nonces
  singleSignHash(signer: SchnorrSigner) {
    console.log("[musigtx] single sign nonces", this.msg, this.pubKeys, this.pubNonces)
    const op = this.opHash
    const pk = this.pubKeys
    const pn = this.pubNonces
    const _sig = signer.multiSignHash(op, pk, pn)
    // TODO test
    this.signersCombos[signer.getAddress()].forEach((combo) => {
      // const _sig = signer.multiSignHash(op, pk, pn)
      combo.signatures?.push(_sig)
    })

    // this.combos[0].signatures?.push(_sig)
    this.signatures.push(_sig)
    console.log("[musigtx] single sign done combo", _sig, this.combos[0].signatures)
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

  getMultiSignFull() {
    console.log("[musigtx] full get multi sign", this.combos)

    const muSig = Object.entries(this.signersCombos).map(([, combos]) => {
      return combos.find((combo) => {
        return combo.signatures.length == combo.schnorrSigners.length
      })
    })
    console.log("[musigtx] SIGNERS COMBOS", this.signersCombos)
    console.log("[musigtx] MUSIG FIND", { muSig })

    const _muSigCombo = muSig[0] //TODO check if exists
    if (!_muSigCombo) return "0x"
    console.log("[musigtx] MUSIG FIND", _muSigCombo)
    console.log("[musigtx] MUSIG FIND", _muSigCombo)
    const _combinedPubKey = _muSigCombo.combinedPubKey
    console.log("[musigtx] MUSIG FIND", pubKey2Address(_muSigCombo.combinedPubKey))
    const _signatures = _muSigCombo.signatures
    // const _combinedPubKey = this.combos[0].combinedPubKey
    // const _signatures = this.combos[0].signatures

    console.log("[musigtx] full get multi sign", _combinedPubKey, _signatures, this.signers.length)
    if (!_combinedPubKey || !_signatures || this.signers.length < 2) return "0x"
    const _sigs: Signature[] = _signatures.map((sig) => sig.signature)
    const challenges: Challenge[] = _signatures.map((sig) => sig.challenge)
    console.log("[musigtx] full get multi sign array", _sigs)
    const _summed = sumMultiSchnorrSigs(_sigs)

    // the multisig px and parity
    const px = ethers.utils.hexlify(_combinedPubKey.buffer.subarray(1, 33))
    const parity = _combinedPubKey.buffer[0] - 2 + 27

    // challenge for every signature has to be the same, so pick first one
    const e = challenges[0]

    // wrap the result
    const abiCoder = new ethers.utils.AbiCoder()
    const sigData = abiCoder.encode(["bytes32", "bytes32", "bytes32", "uint8"], [px, e.buffer, _summed.buffer, parity])
    console.log("[musigtx] get multi sign ===>", sigData)

    return sigData
  }
}
