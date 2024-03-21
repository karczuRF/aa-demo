import { Transfer } from "./Transfer.tsx"
import { Balance } from "./Balance.tsx"
import { Approve } from "./Approve.tsx"
import { Allowance } from "./Allowance.tsx"

import { ConnectionParams } from "../aa/MultiSigSmartAccountParams.types.ts"
import React, { useState } from "react"
import { Hex } from "viem"

export const ERC20: React.FC<ConnectionParams & { address: string }> = ({ address, ...connectionParams }) => {
  const [toAddress, setToAddress] = useState<Hex | undefined>()
  const handleChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (value.startsWith("0x") && value.length === 42) {
      setToAddress(value as Hex)
    }

    if (value.length === 0) {
      setToAddress(undefined)
    }
  }

  return (
    <div style={{ margin: "48px", padding: "12px", border: "1px solid black" }}>
      <h3 style={{ color: "yellow" }}>ERC20 (address: {address}) contract interactions</h3>
      <h2>
        {" "}
        To address: <input value={toAddress} onChange={handleChangeAddress} />{" "}
      </h2>
      <Balance address={address} {...connectionParams} />
      {toAddress && (
        <>
          <Allowance {...connectionParams} address={address} toAddress={toAddress} />
          <Approve {...connectionParams} address={address} toAddress={toAddress} />
          <Transfer {...connectionParams} address={address} toAddress={toAddress} />
        </>
      )}
    </div>
  )
}
