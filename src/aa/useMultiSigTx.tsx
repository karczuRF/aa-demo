import { UserOperationRequest } from "aa-schnorr-multisig-sdk/dist/accountAbstraction"
import { SchnorrSigner } from "aa-schnorr-multisig-sdk/dist/signers"
import { MultiSigUserOpWithSigners } from "aa-schnorr-multisig-sdk/dist/transaction"
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
  const [multiSigTx, setMultiSigTx] = useState<MultiSigUserOpWithSigners>()

  useEffect(() => {
    function getMultiSigTx() {
      if (signers.length > 1) {
        const tx = new MultiSigUserOpWithSigners(signers, opHash, userOp)
        setMultiSigTx(tx)
      }
    }
    getMultiSigTx()
  }, [signers, opHash, userOp])

  return multiSigTx
}
