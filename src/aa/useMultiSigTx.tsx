import { useEffect, useState } from "react"
import SchnorrSigner from "aams-test/dist/utils/SchnorrSigner"
import MultiSigSchnorrTx from "../account-abstraction/MultiSigSchnorrTx.ts"
import { Hex } from "viem"

export function useMultiSigTx({ signers, opHash }: { signers: SchnorrSigner[]; opHash: Hex }) {
  const [multiSigTx, setMultiSigTx] = useState<MultiSigSchnorrTx>()

  useEffect(() => {
    function getMultiSigTx() {
      if (signers.length > 1) {
        const tx = new MultiSigSchnorrTx(signers, opHash)
        setMultiSigTx(tx)
      }
    }
    getMultiSigTx()
  }, [signers, opHash])

  console.log("return musig tx", multiSigTx)
  return multiSigTx
}
