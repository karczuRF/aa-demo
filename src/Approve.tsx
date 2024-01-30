import React, { useState } from "react"

import { useERC20 } from "./useFakeUSD.tsx"
import { BigNumber } from "ethers"
import { ERC20Params } from "./ERC20.types.tsx"

export const Approve: React.FC<ERC20Params> = ({ address, toAddress, ...connectionParams }) => {
  const [amount, setAmount] = useState<number>(0)
  const { erc20 } = useERC20({ address, ...connectionParams })

  const handleApprove = async () => {
    if (erc20) {
      const amountBN = BigNumber.from(amount).mul(BigNumber.from(10).pow(18))
      const transaction = await erc20.approve(toAddress, amountBN)
      await transaction.wait()
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>approve to {toAddress}</b>
      <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <button onClick={handleApprove}>approve</button>
    </div>
  )
}
