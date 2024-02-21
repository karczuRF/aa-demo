import { useEffect, useState } from "react"
import SchnorrSigner from "aams-test/dist/utils/SchnorrSigner"
import SchnorrMultiSigTx from "../account-abstraction/SchnorrMultiSigTx.ts"
import { Hex } from "viem"

export function useMultiSigTx({ signers, opHash }: { signers: SchnorrSigner[]; opHash: Hex }) {
  const [multiSigTx, setMultiSigTx] = useState<SchnorrMultiSigTx>()

  useEffect(() => {
    console.log("return musig tx useeffect", multiSigTx?.isInitialized)
    function getMultiSigTx() {
      if (signers.length > 1) {
        const tx = new SchnorrMultiSigTx(signers, opHash)
        setMultiSigTx(tx)
      }
    }
    getMultiSigTx()
  }, [signers, opHash])

  console.log("return musig tx", multiSigTx?.isInitialized)
  return multiSigTx
}
