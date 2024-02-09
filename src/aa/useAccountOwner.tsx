import { useMemo } from "react"
import { getSchnorrSigner } from "./getSchnorrSigner.ts"
import SchnorrSigner from "aams-test/dist/utils/SchnorrSigner"

export function useAccountOwner({ signer }: { signer: SchnorrSigner }) {
  const owner = useMemo(() => {
    return getSchnorrSigner(signer)
  }, [signer])

  return owner
}
