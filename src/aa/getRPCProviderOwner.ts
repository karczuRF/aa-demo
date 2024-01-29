import { SignTypedDataParams, SmartAccountSigner } from "@alchemy/aa-core"
import { TypedDataField, providers } from "ethers"
import { Hex, hexToSignature, isHex, signatureToHex } from "viem"

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

export function getRPCSignerOwner(signer: providers.JsonRpcSigner): SmartAccountSigner {
  return {
    signerType: "json-rpc",
    inner: signer,
    getAddress: async () => Promise.resolve((await signer.getAddress()) as `0x${string}`),
    signMessage: async (msg: Uint8Array | string) => (await signer.signMessage(msg)) as `0x${string}`,
    signTypedData: async (params: SignTypedDataParams) => {
      return fixSignedData(
        (await signer._signTypedData(params.domain!, params.types as unknown as Record<string, TypedDataField[]>, params.message)) as Hex
      )
    },
  }
}
