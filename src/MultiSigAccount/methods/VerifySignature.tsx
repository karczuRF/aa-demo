import React, { useState } from "react"

import { MultiOwnersSmartAccountParams } from "../MultiOwnersSmartAccount.types.ts"

import { useMultiOwnerSmartAccount } from "../useMultiOwnerSmartAccount.tsx"
import { ERC1271_MAGICVALUE_BYTES32 } from "../../../utils/const.ts"

export const VerifySignature: React.FC<MultiOwnersSmartAccountParams> = (accountParams) => {
  const [hash, setHash] = useState<string>("hash")
  const [isValidSig, setIsValidSig] = useState<boolean>()
  const [signature, setSignature] = useState<string>("signature")
  const { isAccountCreated, multiOwnerSmartAccount } = useMultiOwnerSmartAccount(accountParams)

  const handleVerifySignature = async () => {
    console.log("verify signature", signature)
    if (hash && signature && isAccountCreated && multiOwnerSmartAccount) {
      const isValidValue = await multiOwnerSmartAccount.isValidSignature(hash, signature)

      // const transferData = MultiSigSmartAccount.encodeFunctionData("grantRole", [])
      // const transferUserOperation: TransactionRequest = {
      //   data: transferData as Hex,
      //   to: address,
      // }
      // const userOperationTransaction = await accountSigner.sendTransaction(transferUserOperation)

      console.log("is valid", isValidValue)

      setHash(hash)
      setSignature(signature)
      setIsValidSig(isValidValue == ERC1271_MAGICVALUE_BYTES32)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>user operation: signature hash</b>
      sig
      <input type="text" value={signature} onChange={(e) => setSignature(String(e.target.value))} />
      hash
      <input type="text" value={hash} onChange={(e) => setHash(String(e.target.value))} />
      {/* <button onClick={handleVerifySignature}>Verify Signature</button> */}
      {/* <h4 style={{ color: isValidSig ? "green" : "red" }}>Is Valid? {isValidSig ? "yes" : "no"}</h4> */}
    </div>
  )
}
