import { GrantOwnership } from "./methods/GrantOwnership.tsx"
import { MultiOwnersSmartAccountParams } from "./MultiOwnersSmartAccount.types.ts"
import { useMultiOwnerAccountOwnership } from "./methods/useMultiOwnerAccountOwnership.tsx"
import { useEOA } from "../eoa/useEOA.tsx"
import { useMultiOwnerSmartAccount } from "./useMultiOwnerSmartAccount.tsx"
import React from "react"
import { NativeSmartWallet } from "../NativeSmartWallet.tsx"

export const MultiOwnerSmartAccount: React.FC<MultiOwnersSmartAccountParams> = (multiOwnersSmartAccountParams) => {
  const { isAccountCreated } = useMultiOwnerSmartAccount(multiOwnersSmartAccountParams)
  const { isOwner, accountAddress } = useMultiOwnerAccountOwnership(multiOwnersSmartAccountParams)

  const { address: eoaAddress } = useEOA(multiOwnersSmartAccountParams)

  console.log("[MultiOwnerSmartAccount] accountAddress", accountAddress)
  console.log("[MultiOwnerSmartAccount] isOwner", isOwner)
  console.log("[MultiOwnerSmartAccount] isAccountCreated", isAccountCreated)

  return (
    <div style={{ margin: "24px", padding: "12px" }}>
      <div>
        {isAccountCreated ? <h2>Smart Account Address: {accountAddress}</h2> : <h2>Account not created yet</h2>}
        <h3>EOA Address: {eoaAddress}</h3>
      </div>
      <NativeSmartWallet {...multiOwnersSmartAccountParams} />
      {/* <UserOperationsERC20 {...multiOwnersSmartAccountParams} /> */}

      {isOwner && isAccountCreated && (
        <>
          <GrantOwnership {...multiOwnersSmartAccountParams} />
        </>
      )}
    </div>
  )
}
