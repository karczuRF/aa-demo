import { SignTypedDataParams, SmartAccountSigner } from "@alchemy/aa-core"
import Schnorrkel from "aams-test/dist/schnorrkel"
import { Key, SignatureOutput } from "aams-test/dist/types"
import { pKeyString2Key } from "aams-test/dist/utils/schnorr-helpers"
import { TypedDataField, ethers, providers } from "ethers"
import { Hex, hexToSignature, isHex, signatureToHex } from "viem"
// import { Buffer as BufferPolyfill } from "buffer"
// declare var Buffer: typeof BufferPolyfill
// globalThis.Buffer = BufferPolyfill

// console.log("buffer", Buffer.from("foo", "hex"))

export const fixSignedData = (sig: Hex): Hex => {
  let signature = sig
  if (!isHex(signature)) {
    signature = `0x${signature}`
    if (!isHex(signature)) {
      throw new Error("Invalid signed data " + sig)
    }
  }

  // eslint-disable-next-line prefer-const
  let { r, s, v } = hexToSignature(signature)
  if (v === 0n || v === 1n) v += 27n
  const joined = signatureToHex({ r, s, v })
  return joined
}

export const signSchnorr = (msg: Uint8Array | Hex | string): SignatureOutput => {
  console.log("SCHNORR SIGNATURE FCT", { msg })
  if (!import.meta.env.VITE_SIGNER_PRIVATE_KEY) throw new Error("Missing Signer private key!")

  const _msg = msg.toString()
  const _pK = import.meta.env.VITE_SIGNER_PRIVATE_KEY
  console.log("SCHNORR SIGNATURE inside", { _pK })
  const pkKey = pKeyString2Key(_pK)
  console.log("SCHNORR SIGNATURE inside key", { pkKey })
  const _sig = Schnorrkel.sign(pkKey, _msg)
  return _sig
}

export function getRPCSignerOwner(signer: providers.JsonRpcSigner): SmartAccountSigner {
  return {
    signerType: "json-rpc",
    inner: signer,
    getAddress: async () => Promise.resolve((await signer.getAddress()) as `0x${string}`),
    // signMessage: async (msg: Uint8Array | string) => (await signer.signMessage(msg)) as `0x${string}`,
    signMessage: async (msg: Uint8Array | Hex | string) => {
      const sig = signSchnorr(msg)
      console.log("SCHNORR SIGNATURE", { sig })
      return sig.signature.toHex() as Hex
    },
    signTypedData: async (params: SignTypedDataParams) => {
      return fixSignedData(
        (await signer._signTypedData(
          params.domain!,
          params.types as unknown as Record<string, TypedDataField[]>,
          params.message
        )) as Hex
      )
    },
  }
}
