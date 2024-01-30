import React from "react"

import { MultiOwnersSmartAccountParams } from "../MultiOwnersSmartAccount.types.ts"

export const VerifySignature: React.FC<MultiOwnersSmartAccountParams> = ({ chainId }) => {
  const handleVerifySignature = async () => {
    console.log("verify signature", chainId)
    // if (multiOwnerSmartAccount && hash && signature && accountSigner) {
    //   const address = await accountSigner.getAddress()

    //   const transferData = multiOwnerSmartAccount.interface.encodeFunctionData("grantOwnership", [newOwner])
    //   const transferUserOperation: TransactionRequest = {
    //     data: transferData as Hex,
    //     to: address,
    //   }
    //   const userOperationTransaction = await accountSigner.sendTransaction(transferUserOperation)

    //   console.log("user operation grant ownership", userOperationTransaction)

    //   setHash("")
    // }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>user operation: grant permission</b>
      {/* <input type="text" value={newOwner} onChange={(e) => setHash(String(e.target.value))} />
      <input type="text" value={newOwner} onChange={(e) => setHash(String(e.target.value))} /> */}
      <button onClick={handleVerifySignature}>Verify Signature</button>
    </div>
  )
}
