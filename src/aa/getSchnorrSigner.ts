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
// const account = privateKeyToAccount(import.meta.env.VITE_SIGNER_PRIVATE_KEY)

// export const client = createWalletClient({
//   account,
//   chain: polygonMumbai,
//   transport: http(), // TODO set like this for now; whatever
// })

// // this can now be used as an owner for a Smart Contract Account
// export const eoaSigner = new WalletClientSigner(
//   client,
//   "local" // signerType
// )

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

// msg as Hex to transfer eth to eo
// (tx hash: 0x08a132b6c7efd5744120234c21a6bde731107d04cd33358b72a241ecd675e083)
// 0x6feffe4abbb5058841ec00c249ca186494f95e64fd69b60888cfa8bffa21f151

export function getSchnorrSigner(signer: SchnorrSigner): SmartAccountSigner {
  return {
    signerType: "schnorr",
    inner: signer,
    getAddress: async () => Promise.resolve(signer.getAddress() as `0x${string}`),
    signMessage: async (msg: Uint8Array | Hex | string) => {
      const sig = signer.signMessage(msg.toString())
      console.log("SCHNORR SIGNATURE", { sig })
      console.log("SCHNORR SIGNATURE msg", utils.hexlify(msg))
      console.log("SCHNORR SIGNATURE signature", utils.hexlify(sig.signature.buffer))
      return utils.hexlify(sig.signature.buffer) as Hex
      // return "0xc869ee9503b49c80d96b3be05a50893a11d37bc12f0af0514883ff85dd224e20388b4dbd0ced3428e175821fca5f0bd48229bc34326adf5446d93cd884c0245e2fa6c7e0a7ab693d675a89f52f85d417d36b018eff4cf04a71d5f449f7824cf2000000000000000000000000000000000000000000000000000000000000001c" as Hex
    },
    signTypedData: async (params: SignTypedDataParams) => {
      return fixSignedData("0x" as Hex)
    },
  }
}
