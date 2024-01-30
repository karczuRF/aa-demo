import React, { useEffect, useState } from "react"

import { polygonMumbai } from "wagmi/chains"
import { useEthersSigner } from "./aa/useEthersSigner.tsx"
import { utils } from "ethers"

export const BalanceNative: React.FC = () => {
  const [balance, setBalance] = useState<string>("0")
  const [address, setAddress] = useState<string>("0x")

  const signer = useEthersSigner({ chainId: polygonMumbai.id })

  useEffect(() => {
    async function balanceOf() {
      if (signer) {
        const address = await signer.getAddress()
        setAddress(address)
        const balance = await signer.getBalance()
        setBalance(utils.formatUnits(balance, 18))
      }
    }

    balanceOf()
  }, [signer])

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>Native Balance of {address}</b>
      <span>{balance}</span>
    </div>
  )
}
