import { MultiSigSmartAccountParams } from "./MultiOwnersSmartAccount.types.ts"
import { useMultiOwnerAccountOwnership } from "./methods/useMultiOwnerAccountOwnership.tsx"

import React from "react"
import { NativeSmartWallet } from "../nativeToken/NativeSmartWallet.tsx"
import { UserOperationsERC20 } from "../userOperation/UserOperationsERC20.tsx"

export const MultiOwnerSmartAccount: React.FC<MultiSigSmartAccountParams> = (multiOwnersSmartAccountParams) => {
  const { isOwner, isSigner, eoaAddress, accountSignerAddress } =
    useMultiOwnerAccountOwnership(multiOwnersSmartAccountParams)

  return (
    <div style={{ margin: "24px", padding: "12px" }}>
      <div>
        <h2>Smart Account Address: {accountSignerAddress}</h2>
        <h3>Account Signer Address: {accountSignerAddress}</h3>
        <h3>EOA Address: {eoaAddress}</h3>
        <h4 style={{ color: isOwner ? "green" : "red" }}>Is EOA owner? {isOwner ? "yes" : "no"}</h4>
        <h4 style={{ color: isSigner ? "green" : "red" }}>Is EOA signer? {isSigner ? "yes" : "no"}</h4>
      </div>
      <NativeSmartWallet {...multiOwnersSmartAccountParams} />
      <UserOperationsERC20 {...multiOwnersSmartAccountParams} />
    </div>
  )
}
