import { SignTypedDataParams, SmartAccountSigner } from "@alchemy/aa-core"
import Schnorrkel from "aams-test/dist/schnorrkel"
import { SignatureOutput } from "aams-test/dist/types"
import { pKeyString2Key } from "aams-test/dist/utils/schnorr-helpers"
import { useCallback } from "react"
import { Hex, createWalletClient, http, toHex } from "viem"
import { useWalletClient } from "wagmi"
import { privateKeyToAccount } from "viem/accounts"
import { polygonMumbai } from "viem/chains"

type MultiSigSmartAccountSignerResult =
  | {
      isLoading: false
      owner: SmartAccountSigner
    }
  | {
      isLoading: true
      owner: undefined
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

const account = privateKeyToAccount(import.meta.env.VITE_SIGNER_PRIVATE_KEY)

const client = createWalletClient({
  account,
  chain: polygonMumbai,
  transport: http(), // TODO set like this for now; whatever
})

export function useMultiSigAccountSigner(): MultiSigSmartAccountSignerResult {
  const signerType = "json-rpc"
  const inner = client
  const walletClientQuery = useWalletClient()
  // We need this to by pass a viem bug https://github.com/wagmi-dev/viem/issues/606
  const signMessage = useCallback(
    (msg: Uint8Array | string) => Promise.resolve(_signSchnorr(msg).signature.toHex() as `0x${string}`),
    [walletClientQuery.data]
  )
  const signTypedData = useCallback(
    (data: SignTypedDataParams) =>
      walletClientQuery.data!.request({
        // ignore the type error here, it's a bug in the viem typing
        // @ts-ignore
        method: "eth_signTypedData_v4",
        // @ts-ignore
        params: [toHex(data), walletClientQuery.data.account.address],
      }),
    [walletClientQuery.data]
  )
  const getAddress = useCallback(
    () => Promise.resolve(walletClientQuery.data!.account.address),
    [walletClientQuery.data]
  )
  if (walletClientQuery.isLoading) {
    return {
      isLoading: true,
      owner: undefined,
    }
  }
  return { isLoading: false, owner: { signerType, inner, signMessage, signTypedData, getAddress } }
}
