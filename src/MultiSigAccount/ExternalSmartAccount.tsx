import React, { useState } from "react"

import { ConnectionParams } from "./MultiOwnersSmartAccount.types.ts"
import { Hex } from "viem"
import { MultiOwnerSmartAccount } from "./MultiOwnerSmartAccount.tsx"
import { FAKE_USD_ADDRESS } from "../../utils/const.ts"

export const ExternalSmartAccount: React.FC<ConnectionParams> = ({ chainId }) => {
  const [externalAccountAddress, setExternalAccountAddress] = useState<Hex | undefined>(
    "0x3183b5C72Fc2d9FaC2984c624Ff9cEeB677De98D"
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
      <MultiOwnerSmartAccount
        address={FAKE_USD_ADDRESS}
        externalAccountAddress={externalAccountAddress}
        chainId={chainId}
      />
    </div>
  )
}
