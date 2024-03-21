import React, { useEffect, useState } from "react"

import { useERC20 } from "./useFakeUSD.tsx"
import { useEOA } from "../eoa/useEOA.tsx"
import { ERC20Params } from "./ERC20.types.tsx"
import { utils } from "ethers"

export const Balance: React.FC<Omit<ERC20Params, "toAddress"> & { account?: string }> = ({
  address: erc20Address,
  account,
  ...connectionParams
}) => {
  const [balance, setBalance] = useState<string>("0")
  const { erc20, decimals } = useERC20({ address: erc20Address, ...connectionParams })

  const accountAddress = account ?? useEOA(connectionParams).address

  useEffect(() => {
    async function balanceOf() {
      if (erc20) {
        const balance = await erc20.balanceOf(accountAddress)
        setBalance(utils.formatUnits(balance, decimals))
      }
    }

    balanceOf()
  }, [erc20, setBalance, accountAddress])

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>Balance of {accountAddress}</b>
      <span>{balance}</span>
    </div>
  )
}
