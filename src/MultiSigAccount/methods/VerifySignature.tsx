import React, { useState } from "react"

import { MultiOwnersSmartAccountParams } from "../MultiOwnersSmartAccount.types.ts"
import { useAccountSigner } from "../../aa/useAccountSigner.tsx"

import { MultiSigSmartAccount } from "aams-test/dist/typechain/index"

export const VerifySignature: React.FC<MultiOwnersSmartAccountParams> = (accountParams) => {
  const { chainId } = accountParams
  const [newOwner, setNewOwner] = useState<string>("")
  const [hash, setHash] = useState<string>("")
  const [signature, setSignature] = useState<string>("")
  const accountSigner = useAccountSigner({ chainId })

  const handleVerifySignature = async () => {
    console.log("verify signature", chainId)
    if (hash && signature && accountSigner) {
      const address = await accountSigner.getAddress()

      // const transferData = MultiSigSmartAccount.encodeFunctionData("grantRole", [])
      // const transferUserOperation: TransactionRequest = {
      //   data: transferData as Hex,
      //   to: address,
      // }
      // const userOperationTransaction = await accountSigner.sendTransaction(transferUserOperation)

      console.log("user operation grant ownership")

      setHash(hash)
      setHash(signature)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>user operation: signature hash</b>
      <input type="text" value={newOwner} onChange={(e) => setNewOwner(String(e.target.value))} />
      <button onClick={handleVerifySignature}>Verify Signature</button>
    </div>
  )
}
