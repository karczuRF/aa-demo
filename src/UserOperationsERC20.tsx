import React, { useState } from "react"
import { Hex } from "viem"
import { MultiOwnersSmartAccountParams } from "./account-abstraction/MultiSigAccountAbstraction.types.ts"
import { TransferUserOperation } from "./TransferUserOperation.tsx"
import { FAKE_USD_ADDRESS, SMART_ACCOUNT_ADDRESS } from "../utils/const.ts"
import { Balance } from "./Balance.tsx"

export const UserOperationsERC20: React.FC<MultiOwnersSmartAccountParams> = ({ ...accountParams }) => {
  const [toAddress, setToAddress] = useState<Hex | undefined>("0x75a12C0550fd620388bcdD7B0c2b8133Be53dEb4")
  const [erc20Address, setERC20Address] = useState<string>(FAKE_USD_ADDRESS)
  const handleChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (value.startsWith("0x") && value.length === 42) {
      setToAddress(value as Hex)
    }
    if (value.length === 0) {
      setToAddress(undefined)
    }
  }

  const handleChangeERC20 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setERC20Address(event.target.value as Hex)
  }

  return (
    <div style={{ margin: "48px", padding: "12px", border: "1px solid black" }}>
      <h3 style={{ color: "yellow" }}>User Operations ERC20</h3>
      <Balance address={erc20Address} account={SMART_ACCOUNT_ADDRESS} {...accountParams} />
      <Balance address={erc20Address} account={toAddress} {...accountParams} />

      <h2>
        To address: <input style={{ width: "500px" }} value={toAddress} onChange={handleChangeAddress} />
      </h2>
      <h2>
        ERC20 address: <input style={{ width: "500px" }} value={erc20Address} onChange={handleChangeERC20} />{" "}
      </h2>
      {toAddress && (
        <>
          <TransferUserOperation {...accountParams} toAddress={toAddress} address={erc20Address} />
        </>
      )}
    </div>
  )
}
