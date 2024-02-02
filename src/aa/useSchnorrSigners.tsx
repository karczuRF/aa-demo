import { useEffect, useState } from "react"
import { useEthersSigner } from "./useEthersSigner.tsx"
import { ConnectionParams } from "../account-abstraction/MultiSigAccountAbstraction.types.ts"

import SchnorrSigner from "aams-test/dist/utils/SchnorrSigner"
import { createSchnorrSigner } from "aams-test/dist/utils/schnorr-helpers"
import { hexToBytes } from "viem"

export function useSchnorrSigners({ chainId }: ConnectionParams) {
  const signer = useEthersSigner({ chainId })
  const [schnorrSigners, setSchnorrSigners] = useState<SchnorrSigner[]>([])

  useEffect(() => {
    if (signer) {
      const signer1 = createSchnorrSigner(hexToBytes(import.meta.env.VITE_SIGNER_PRIVATE_KEY))
      const signer2 = createSchnorrSigner(hexToBytes(import.meta.env.VITE_SIGNER2_PRIVATE_KEY))

      setSchnorrSigners([signer1, signer2])
    }
  }, [signer, chainId])

  return schnorrSigners
}
