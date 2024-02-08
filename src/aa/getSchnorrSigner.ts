import { SignTypedDataParams, SmartAccountSigner, WalletClientSigner } from "@alchemy/aa-core"
import Schnorrkel from "aams-test/dist/schnorrkel"
import { SignatureOutput } from "aams-test/dist/types"
import { createSchnorrSigner, pKeyString2Key } from "aams-test/dist/utils/schnorr-helpers"
import { ethers, utils } from "ethers"
import { Hex, createWalletClient, hexToBytes, hexToSignature, http, isHex, signatureToHex } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { polygonMumbai } from "wagmi/chains"
import SchnorrSigner from "aams-test/dist/utils/SchnorrSigner"

// if you have a mnemonic, viem also exports a mnemonicToAccount function (see above import)
// const [signer1, signer2] = useSchnorrSigners({ chainId: polygonMumbai.id })
const account = privateKeyToAccount(import.meta.env.VITE_SIGNER_PRIVATE_KEY)
const signer1 = createSchnorrSigner(hexToBytes(import.meta.env.VITE_SIGNER_PRIVATE_KEY))
const signer2 = createSchnorrSigner(hexToBytes(import.meta.env.VITE_SIGNER2_PRIVATE_KEY))

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

const _multiSig = (schnorrSigners: SchnorrSigner[], msg: Uint8Array | Hex | string) => {
  console.log("SCHNORR SIGNATURE MULTI inside sig", { msg })
  const _msgHash = ethers.utils.solidityKeccak256(["bytes32"], [msg])
  const pubKeys = schnorrSigners.map((sig) => sig.getPublicKey())
  const pubNonces = schnorrSigners.map((sig) => sig.getPublicNonces())
  const [signer] = schnorrSigners
  const _sig = signer.multiSignMessage(_msgHash, pubKeys, pubNonces)
  console.log("SCHNORR SIGNATURE MULTI inside sig", { _sig })
  return _sig
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
      const sig = _multiSig([signer1, signer2], msg)
      console.log("SCHNORR SIGNATURE", { sig })
      console.log("SCHNORR SIGNATURE msg", utils.hexlify(msg))
      console.log("SCHNORR SIGNATURE signature", utils.hexlify(sig.signature.buffer))
      return utils.hexlify(sig.signature.buffer) as Hex
    },
    signTypedData: async (params: SignTypedDataParams) => {
      return fixSignedData((await eoaSigner.signTypedData(params)) as Hex)
    },
  }
}
