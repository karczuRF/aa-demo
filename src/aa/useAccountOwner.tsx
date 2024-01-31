import { useEthersSigner } from "./useEthersSigner"
import { useMemo } from "react"
import { getRPCSignerOwner } from "./getRPCProviderOwner.ts"
import { Chain } from "viem"

export function useAccountOwner({ chainId }: { chainId: Chain["id"] }) {
  const signer = useEthersSigner({ chainId })

  const owner = useMemo(() => {
    if (signer) return getRPCSignerOwner(signer)
  }, [signer])

  return owner
}
