import { MultiOwnersSmartAccountParams } from "./MultiOwnersSmartAccount.types.ts"
import { useMultiOwnerAccountOwnership } from "./methods/useMultiOwnerAccountOwnership.tsx"

import { useMultiOwnerSmartAccount } from "./useMultiOwnerSmartAccount.tsx"
import React from "react"
import { NativeSmartWallet } from "../NativeSmartWallet.tsx"
import { GrantOwnership } from "./methods/GrantOwnership.tsx"
import { VerifySignature } from "./methods/VerifySignature.tsx"
import { CreateSignature } from "./methods/CreateSignature.tsx"

// smart account address 0x89872F0A5F6E8A2aa394E39F9b095761FA5577Eb

export const MultiOwnerSmartAccount: React.FC<MultiOwnersSmartAccountParams> = (multiOwnersSmartAccountParams) => {
  const { isAccountCreated } = useMultiOwnerSmartAccount(multiOwnersSmartAccountParams)
  const { isOwner, isSigner, eoaAddress, accountSignerAddress } =
    useMultiOwnerAccountOwnership(multiOwnersSmartAccountParams)
  // const { address: eoaAddress } = useEOA(multiOwnersSmartAccountParams)

  console.log("[MultiOwnerSmartAccount] accountAddress", accountSignerAddress)
  console.log("[MultiOwnerSmartAccount] isOwner", isOwner)
  console.log("[MultiOwnerSmartAccount] isAccountCreated", isAccountCreated)

  return (
    <div style={{ margin: "24px", padding: "12px" }}>
      <div>
        <h2>Smart Account Address: {accountSignerAddress}</h2>
        <h3>EOA Address: {eoaAddress}</h3>
        <h3>Account Signer Address: {accountSignerAddress}</h3>
        <h4 style={{ color: isOwner ? "green" : "red" }}>Is EOA owner? {isOwner ? "yes" : "no"}</h4>
        <h4 style={{ color: isSigner ? "green" : "red" }}>Is EOA signer? {isSigner ? "yes" : "no"}</h4>
      </div>
      <NativeSmartWallet {...multiOwnersSmartAccountParams} />
      {/* <UserOperationsERC20 {...multiOwnersSmartAccountParams} /> */}

      {isAccountCreated && (
        <>
          <GrantOwnership {...multiOwnersSmartAccountParams} />
          <VerifySignature {...multiOwnersSmartAccountParams} />
          <CreateSignature {...multiOwnersSmartAccountParams} />
        </>
      )}
    </div>
  )
}
