import { UserOperationRequest } from "aams-test/dist/accountAbstraction"
import { SchnorrSigner } from "aams-test/dist/signers"
import { SchnorrMultiSigTx } from "aams-test/dist/transaction"
import { useEffect, useState } from "react"
import { Hex } from "viem"

export function useMultiSigTx({
  signers,
  opHash,
  userOp,
}: {
  signers: SchnorrSigner[]
  opHash: Hex
  userOp: UserOperationRequest
}) {
  const [multiSigTx, setMultiSigTx] = useState<SchnorrMultiSigTx>()

  useEffect(() => {
    function getMultiSigTx() {
      if (signers.length > 1) {
        const tx = new SchnorrMultiSigTx(signers, opHash, userOp)
        setMultiSigTx(tx)
      }
    }
    getMultiSigTx()
  }, [signers, opHash, userOp])

  return multiSigTx
}
