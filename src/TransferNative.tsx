import React, { useState } from "react"

import { polygonMumbai } from "wagmi/chains"

import { utils } from "ethers"
import { useEthersSigner } from "./aa/useEthersSigner.tsx"
import { Hex, encodeFunctionData } from "viem"
import { FakeUSD_abi } from "aams-test/dist/abi/index"

// example account 0x75a12C0550fd620388bcdD7B0c2b8133Be53dEb4

export const TransferNative: React.FC = () => {
  const [amount, setAmount] = useState<number>(0)
  const [address, setAddress] = useState<Hex | undefined>()

  const handleChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (value.startsWith("0x") && value.length === 42) {
      setAddress(value as Hex)
    }

    if (value.length === 0) {
      setAddress(undefined)
    }
  }
  const signer = useEthersSigner({ chainId: polygonMumbai.id })

  const handleTransfer = async () => {
    if (signer) {
      const amountBN = utils.parseUnits(String(amount), 18)
      const transaction = await signer.sendTransaction({
        value: amountBN,
        to: address,
      })
      await transaction.wait()

      setAmount(0)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>
        Transfer native to address: <input style={{ width: "320px" }} value={address} onChange={handleChangeAddress} />
      </b>
      <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <button onClick={handleTransfer} style={{ color: signer ? "green" : "red" }}>
        Transfer
      </button>
    </div>
  )
}
