import { useEffect, useState } from "react"
import { ConnectionParams } from "./MultiSigSmartAccountParams.types.ts"
import { SchnorrSigner } from "aa-schnorr-multisig-sdk/dist/signers/SchnorrSigner"
import { createSchnorrSigner } from "aa-schnorr-multisig-sdk/dist/helpers/schnorr-helpers"

export function useSchnorrSigners({ chainId }: ConnectionParams) {
  const [schnorrSigners, setSchnorrSigners] = useState<SchnorrSigner[]>([])
  const pk1 = import.meta.env.VITE_SIGNER_PRIVATE_KEY
  const pk2 = import.meta.env.VITE_SIGNER2_PK
  const pk3 = import.meta.env.VITE_SIGNER3_PK
  useEffect(() => {
    function getSigners() {
      console.log("[musigtx] create signers")
      const signer1 = createSchnorrSigner(pk1)
      const signer2 = createSchnorrSigner(pk2)
      const signer3 = createSchnorrSigner(pk3)

      setSchnorrSigners([signer1, signer2, signer3])
    }
    getSigners()
  }, [chainId, pk1, pk2])

  return schnorrSigners
}

export function useSchnorrSignersPerTx({ nrOfSigners, txId }: { nrOfSigners: number; txId: number }) {
  const [schnorrSigners, setSchnorrSigners] = useState<SchnorrSigner[][]>([])
  const pk1 = import.meta.env.VITE_SIGNER_PRIVATE_KEY
  const pk2 = import.meta.env.VITE_SIGNER2_PK
  const pk3 = import.meta.env.VITE_SIGNER3_PK
  const _signersPrivKeys = [pk1, pk2, pk3]

  useEffect(() => {
    function getSigners() {
      let signers = []
      for (let i = 0; i < nrOfSigners; i++) {
        const signer = createSchnorrSigner(_signersPrivKeys[i])
        signers.push(signer)
      }
      return signers
    }
    const createdSigners = getSigners()
    setSchnorrSigners((prev) => [...prev, createdSigners])
  }, [nrOfSigners, txId])

  return schnorrSigners[txId]
}
