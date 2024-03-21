import React, { useState } from "react"

import { useERC20 } from "./useFakeUSD.tsx"
import { BigNumber } from "ethers"
import { ERC20Params } from "./ERC20.types.tsx"

export const Transfer: React.FC<ERC20Params> = ({ address, toAddress, ...connectionParams }) => {
  const [amount, setAmount] = useState<number>(0)
  const { erc20, decimals } = useERC20({ address, ...connectionParams })

  const handleTransfer = async () => {
    if (erc20 && decimals) {
      const amountBN = BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals)).toNumber()
      const transaction = await erc20.transfer(toAddress, amountBN)

      const transactionReceipt = await transaction.wait()

      console.log("[ERC20] transfer", transactionReceipt)

      setAmount(0)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>transfer to {toAddress}</b>
      <input value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <button onClick={handleTransfer}>transfer</button>
    </div>
  )
}
