import React, { useState } from "react"
import { type TransactionRequest } from "@ethersproject/providers"

import { useAccountSigner } from "../../aa/useAccountSigner.tsx"
import { useMultiOwnerSmartAccount } from "../useMultiOwnerSmartAccount.tsx"
import { MultiSigSmartAccountParams } from "../MultiOwnersSmartAccount.types.ts"
import { Hex } from "viem"
import { SMART_ACCOUNT_ADDRESS } from "../../../utils/const.ts"

export const GrantOwnership: React.FC<MultiSigSmartAccountParams> = ({ chainId }) => {
  const [newOwner, setNewOwner] = useState<string>("")
  const accountSigner = useAccountSigner({ chainId, smartAccountAddress: SMART_ACCOUNT_ADDRESS })
  const { multiOwnerSmartAccount } = useMultiOwnerSmartAccount({ chainId })

  const handleGrantOwnership = async () => {
    if (multiOwnerSmartAccount && newOwner && accountSigner) {
      const address = await accountSigner.getAddress()
      const ownerRole = await multiOwnerSmartAccount.OWNER_ROLE()

      const transferData = multiOwnerSmartAccount.interface.encodeFunctionData("grantRole", [ownerRole, newOwner])
      const transferUserOperation: TransactionRequest = {
        data: transferData as Hex,
        to: address,
      }
      console.log("user operation grant ownership", transferUserOperation)
      const userOperationTransaction = await accountSigner.sendTransaction(transferUserOperation)

      console.log("user operation grant ownership", userOperationTransaction)

      setNewOwner("")
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>userOp: grant OWNER_ROLE (0xb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e)</b>
      <input type="text" value={newOwner} onChange={(e) => setNewOwner(String(e.target.value))} />
      <button onClick={handleGrantOwnership}>grant permission</button>
    </div>
  )
}
