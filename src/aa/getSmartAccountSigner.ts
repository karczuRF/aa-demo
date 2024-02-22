import { Hex, SignTypedDataParams, SmartAccountSigner } from "@alchemy/aa-core"
import { SchnorrSigner } from "aams-test/dist/signers"
import { utils } from "ethers"

export function getSmartAccountSigner(signer: SchnorrSigner): SmartAccountSigner {
  return {
    signerType: "schnorr",
    inner: signer,
    getAddress: async () => Promise.resolve(signer.getAddress() as `0x${string}`),
    signMessage: async (msg: Uint8Array | Hex | string) => {
      const sig = signer.signMessage(msg.toString())
      return utils.hexlify(sig.signature.buffer) as Hex
    },
    signTypedData: async (params: SignTypedDataParams) => {
      return fixSignedData("0x" as Hex)
    },
  }
}

function fixSignedData(arg0: string): `0x${string}` | PromiseLike<`0x${string}`> {
  throw new Error("Function not implemented.")
}
