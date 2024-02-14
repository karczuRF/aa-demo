import * as React from "react"
import { useWalletClient } from "wagmi"
import { providers } from "ethers"
import { WalletClient } from "viem"

export function walletClientToSigner(walletClient: WalletClient) {
  const { chain, transport } = walletClient

  if (!chain) return
  console.log("useEthersSigner chain", chain)
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)

  return provider.getSigner()
}

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId })

  return React.useMemo(() => (walletClient ? walletClientToSigner(walletClient) : undefined), [walletClient])
}
