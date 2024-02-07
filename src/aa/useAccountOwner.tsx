import { useEthersSigner } from "./useEthersSigner"
import { useMemo } from "react"
import { getRPCProviderSigner } from "./getRPCProviderOwner.ts"
import { Chain } from "viem"

export function useAccountOwner({ chainId }: { chainId: Chain["id"] }) {
  const signer = useEthersSigner({ chainId })

  const owner = useMemo(() => {
    if (signer) return getRPCProviderSigner(signer)
  }, [signer])

  return owner
}
