import Schnorrkel from "aams-test/dist/schnorrkel"
import { Key, KeyPair, PublicNonces } from "aams-test/dist/types"
import { pubKey2Address } from "aams-test/dist/utils/schnorr-helpers"

import { privateKeyVerify, publicKeyCreate } from "secp256k1"

const schnorrkel = new Schnorrkel()

export default class SchnorrSigner {
  #privateKey: Key
  #publicKey: Key

  // TODO ONLY FOR TEST
  constructor(_pk: Uint8Array) {
    let privKeyBytes: Buffer

    do {
      privKeyBytes = Buffer.from(_pk)
    } while (!privateKeyVerify(privKeyBytes))

    const pubKey = Buffer.from(publicKeyCreate(privKeyBytes))

    const data = {
      publicKey: pubKey,
      privateKey: privKeyBytes,
    }

    const keys = new KeyPair(data)
    this.#privateKey = keys.privateKey
    this.#publicKey = keys.publicKey
  }

  getPublicKey(): Key {
    return this.#publicKey
  }

  getPublicNonces(): PublicNonces {
    return schnorrkel.generatePublicNonces(this.#privateKey)
  }

  getAddress(): string {
    return pubKey2Address(this.#publicKey)
  }

  multiSignMessage(msg: string, publicKeys: Key[], publicNonces: PublicNonces[]) {
    return schnorrkel.multiSigSign(this.#privateKey, msg, publicKeys, publicNonces)
  }

  // // TODO is it needed here? should privKey be passed like this?
  // signMessage(msg: string) {
  //   return Schnorrkel.sign(this.#privateKey, msg)
  // }
}
