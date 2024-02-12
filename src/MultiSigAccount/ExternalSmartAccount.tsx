import React, { useState } from "react"

import { ConnectionParams } from "./MultiOwnersSmartAccount.types.ts"
import { Hex } from "viem"
import { MultiOwnerSmartAccount } from "./MultiOwnerSmartAccount.tsx"

export const ExternalSmartAccount: React.FC<ConnectionParams> = ({ chainId }) => {
  const [externalAccountAddress, setExternalAccountAddress] = useState<Hex | undefined>(
    "0xBbFf50974d9DF31cb4CeB41026cC041cbe4F8FD0"
  )

  const handleChangeAccountAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (value.startsWith("0x") && value.length === 42) {
      setExternalAccountAddress(value as Hex)
    }

    if (value.length === 0) {
      setExternalAccountAddress(undefined)
    }
  }

  return (
    <div style={{ margin: "24px", padding: "12px" }}>
      <h2>
        Smart Account Address:{" "}
        <input style={{ width: "500px" }} value={externalAccountAddress} onChange={handleChangeAccountAddress} />
      </h2>
      <MultiOwnerSmartAccount externalAccountAddress={externalAccountAddress} chainId={chainId} />
    </div>
  )
}
