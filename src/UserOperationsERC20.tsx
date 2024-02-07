import React, { useState } from "react"
import { Hex } from "viem"
import { MultiOwnersSmartAccountParams } from "./account-abstraction/MultiSigAccountAbstraction.types.ts"
import { TransferUserOperation } from "./TransferUserOperation.tsx"

export const UserOperationsERC20: React.FC<MultiOwnersSmartAccountParams> = ({ address, ...accountParams }) => {
  const [toAddress, setToAddress] = useState<Hex | undefined>("0x75a12C0550fd620388bcdD7B0c2b8133Be53dEb4")
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
      <h3 style={{ color: "yellow" }}>User Operations ERC20</h3>
      <h2>
        {" "}
        To address: <input style={{ width: "500px" }} value={toAddress} onChange={handleChangeAddress} />{" "}
      </h2>
      {toAddress && (
        <>
          <TransferUserOperation address={address} {...accountParams} toAddress={toAddress} />
        </>
      )}
    </div>
  )
}
