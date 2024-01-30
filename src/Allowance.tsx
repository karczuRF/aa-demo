import React, { useEffect, useState } from "react"

import { useEOA } from "./eoa/useEOA.tsx"
import { ERC20Params } from "./ERC20.types.tsx"
import { useERC20 } from "./useFakeUSD.tsx"

export const Allowance: React.FC<ERC20Params> = ({ address, toAddress, ...connectionParams }) => {
  const [allowance, setAllowance] = useState<string>("0")
  const { erc20 } = useERC20({ address, ...connectionParams })

  const { address: eoaAddress } = useEOA(connectionParams)

  useEffect(() => {
    async function allowance() {
      if (erc20) {
        const allowance = await erc20.allowance(eoaAddress, toAddress)
        setAllowance(allowance.toString())
      }
    }

    allowance()
  }, [erc20, setAllowance, eoaAddress])

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>
        Allowance of {eoaAddress} to {toAddress}
      </b>
      <span>{allowance}</span>
    </div>
  )
}
