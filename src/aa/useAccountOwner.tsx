import { useMemo } from "react"
import { getSmartAccountSigner } from "./getSmartAccountSigner.ts"
import { SchnorrSigner } from "aa-schnorr-multisig-sdk/dist/signers/SchnorrSigner"

export function useAccountOwner({ signer }: { signer: SchnorrSigner }) {
  const owner = useMemo(() => {
    return getSmartAccountSigner(signer)
  }, [signer])

  return owner
}
