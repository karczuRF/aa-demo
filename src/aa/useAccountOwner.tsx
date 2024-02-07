import { useEthersSigner } from "./useEthersSigner"
import { useMemo } from "react"
import { Chain } from "viem"
import { getSchnorrSigner } from "./getSchnorrSigner.ts"
import { useMultiSigAccountSigner } from "./smartAccointSigner.ts"

export function useAccountOwner({ chainId }: { chainId: Chain["id"] }) {
  // const signer = useEthersSigner({ chainId })

  const signer = useMemo(() => {
    if (chainId) return getSchnorrSigner()
  }, [chainId])

  return signer
}
