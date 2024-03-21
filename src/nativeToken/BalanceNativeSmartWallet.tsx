import React, { useEffect, useState } from "react"

import { useAccountSigner } from "../aa/useAccountSigner.tsx"
import { MultiSigSmartAccountParams } from "../aa/MultiSigSmartAccountParams.types.ts"
import { utils } from "ethers"

export const BalanceNativeSmartWallet: React.FC<MultiSigSmartAccountParams> = (accountParams) => {
  const [balance, setBalance] = useState<string>("0")
  const [address, setAddress] = useState<string>("0x")

  const accountSigner = useAccountSigner(accountParams)

  useEffect(() => {
    async function balanceOf() {
      if (accountSigner) {
        const address = await accountSigner.getAddress()
        setAddress(address)
        const balance = await accountSigner.getBalance()
        setBalance(balance.toString())
      }
    }

    balanceOf()
  }, [accountSigner])

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>Balance of Account: {address}</b>
      <span>{utils.formatUnits(balance, 18)}</span>
    </div>
  )
}
