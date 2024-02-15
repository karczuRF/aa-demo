import { useEffect, useState } from "react"
import { useEthersSigner } from "./useEthersSigner.tsx"
import { ConnectionParams } from "../account-abstraction/MultiSigAccountAbstraction.types.ts"

import SchnorrSigner from "aams-test/dist/utils/SchnorrSigner"
import { createSchnorrSigner } from "aams-test/dist/utils/schnorr-helpers"
import { hexToBytes } from "viem"

export function useSchnorrSigners({ chainId }: ConnectionParams) {
  // const signer = useEthersSigner({ chainId })
  const [schnorrSigners, setSchnorrSigners] = useState<SchnorrSigner[]>([])
  const pk1 = import.meta.env.VITE_SIGNER_PRIVATE_KEY
  const pk2 = import.meta.env.VITE_SIGNER2_PK
  const pk3 = import.meta.env.VITE_SIGNER3_PK
  useEffect(() => {
    function getSigners() {
      console.log("[musigtx] create signers")
      const signer1 = createSchnorrSigner(hexToBytes(pk1))
      const signer2 = createSchnorrSigner(hexToBytes(pk2))
      const signer3 = createSchnorrSigner(hexToBytes(pk3))

      setSchnorrSigners([signer1, signer2, signer3])
    }
    getSigners()
  }, [chainId, pk1, pk2])

  return schnorrSigners
}
