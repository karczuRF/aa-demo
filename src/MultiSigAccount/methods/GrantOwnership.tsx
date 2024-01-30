import React, { useState } from "react"
import { type TransactionRequest } from "@ethersproject/providers"

import { useAccountSigner } from "../../aa/useAccountSigner.tsx"
import { Hex } from "../../account-abstraction/UserOperation.ts"
import { useMultiOwnerSmartAccount } from "../useMultiOwnerSmartAccount.tsx"
import { MultiOwnersSmartAccountParams } from "../MultiOwnersSmartAccount.types.ts"

export const GrantOwnership: React.FC<MultiOwnersSmartAccountParams> = ({ chainId, address }) => {
  const [newOwner, setNewOwner] = useState<string>("")
  const accountSigner = useAccountSigner({ chainId })

  const { multiOwnerSmartAccount } = useMultiOwnerSmartAccount({ chainId, address })

  const handleGrantOwnership = async () => {
    console.log(multiOwnerSmartAccount, newOwner, accountSigner)
    if (multiOwnerSmartAccount && newOwner && accountSigner) {
      const address = await accountSigner.getAddress()
      const ownerRole = await multiOwnerSmartAccount.OWNER_ROLE()

      const transferData = multiOwnerSmartAccount.interface.encodeFunctionData("grantRole", [ownerRole, newOwner])
      const transferUserOperation: TransactionRequest = {
        data: transferData as Hex,
        to: address,
      }
      const userOperationTransaction = await accountSigner.sendTransaction(transferUserOperation)

      console.log("user operation grant ownership", userOperationTransaction)

      setNewOwner("")
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>user operation: grant permission</b>
      <input type="text" value={newOwner} onChange={(e) => setNewOwner(String(e.target.value))} />
      <button onClick={handleGrantOwnership}>grant permission</button>
    </div>
  )
}
