import { useEffect, useMemo, useState } from "react"
import SchnorrSigner from "aams-test/dist/utils/SchnorrSigner"
import MultiSigSchnorrTx from "../account-abstraction/MultiSigSchnorrTx.ts"

export function useMultiSigTx({ signers }: { signers: SchnorrSigner[] }) {
  const [multiSigTx, setMultiSigTx] = useState<MultiSigSchnorrTx>()

  useEffect(() => {
    function getMultiSigTx() {
      const tx = new MultiSigSchnorrTx(signers)
      setMultiSigTx(tx)
    }
    getMultiSigTx()
  }, [signers])

  return multiSigTx
}
