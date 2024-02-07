import { SignTypedDataParams, SmartAccountSigner, WalletClientSigner } from "@alchemy/aa-core"
import Schnorrkel from "aams-test/dist/schnorrkel"
import { SignatureOutput } from "aams-test/dist/types"
import { pKeyString2Key } from "aams-test/dist/utils/schnorr-helpers"
import { Hex, createWalletClient, hexToSignature, http, isHex, signatureToHex } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { polygonMumbai } from "wagmi/chains"

// if you have a mnemonic, viem also exports a mnemonicToAccount function (see above import)
// const [signer1, signer2] = useSchnorrSigners({ chainId: polygonMumbai.id })
const account = privateKeyToAccount(import.meta.env.VITE_SIGNER_PRIVATE_KEY)

export const client = createWalletClient({
  account,
  chain: polygonMumbai,
  transport: http(), // TODO set like this for now; whatever
})

// this can now be used as an owner for a Smart Contract Account
export const eoaSigner = new WalletClientSigner(
  client,
  "local" // signerType
)

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

const _signSchnorr = (msg: Uint8Array | Hex | string): SignatureOutput => {
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

export function getSchnorrSigner(): SmartAccountSigner {
  return {
    signerType: "schnorr",
    inner: client,
    getAddress: async () => Promise.resolve((await eoaSigner.getAddress()) as `0x${string}`),
    signMessage: async (msg: Uint8Array | Hex | string) => {
      const sig = _signSchnorr(msg)
      console.log("SCHNORR SIGNATURE", { sig })
      return sig.signature.toHex() as Hex
    },
    signTypedData: async (params: SignTypedDataParams) => {
      return fixSignedData((await eoaSigner.signTypedData(params)) as Hex)
    },
  }
}
