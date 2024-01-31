import React, { useCallback, useEffect, useState } from "react"

import { usePaymaster } from "./paymaster/usePaymaster.tsx"
import { useEthersSigner } from "./aa/useEthersSigner.tsx"
import { ConnectionParams } from "./MultiSigAccount/MultiOwnersSmartAccount.types.ts"
import { utils } from "ethers"

export const Paymaster: React.FC<ConnectionParams> = (connectionParams) => {
  const paymasterAddress = "0x7e3794De2C9B9e2Ee47E4C4EeBAE192637026c24"
  const entrypointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"

  const [paymasterDeposit, setPaymasterDeposit] = useState<string>("0")
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [senderAddress, setSenderAddress] = useState<string>("")

  const [isWhitelisted, setIsWhitelisted] = useState<boolean | undefined>()
  const [senderAddress2, setSenderAddress2] = useState<string>("")

  const signer = useEthersSigner(connectionParams)

  const { paymaster } = usePaymaster({ paymasterAddress, ...connectionParams })

  useEffect(() => {
    async function checkOwner() {
      if (paymaster && signer) {
        const signerAddress = await signer.getAddress()
        const paymasterDeposit = await paymaster.getDeposit()
        const ownerAddress = await paymaster.owner()

        setPaymasterDeposit(utils.formatUnits(paymasterDeposit, 18))
        setIsOwner(ownerAddress === signerAddress)
      }
    }
    checkOwner()
  }, [paymaster, signer])

  const handleWhitelistSender = useCallback(async () => {
    if (paymaster) {
      const transaction = await paymaster.whitelistSender(senderAddress)

      await transaction.wait()

      setSenderAddress("")
    }
  }, [paymaster, senderAddress])

  const handleIsSenderWhitelist = useCallback(async () => {
    if (paymaster) {
      const isWhitelisted = await paymaster.isWhitelistedSender(senderAddress2)

      setIsWhitelisted(isWhitelisted)
    }
  }, [paymaster, senderAddress2])

  return (
    isOwner && (
      <div style={{ margin: "48px", padding: "12px", border: "1px solid black" }}>
        <h3 style={{ color: "blue" }}>Paymaster ({paymasterAddress})</h3>
        <h2>Balance: {paymasterDeposit}</h2>

        <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
          <b>Is Sender whitelisted</b>
          <input value={senderAddress2} onChange={(e) => setSenderAddress2(String(e.target.value))} />
          <button onClick={handleIsSenderWhitelist}>is whitelisted</button>
          {isWhitelisted !== undefined && (
            <span style={{ background: isWhitelisted ? "green" : "red" }}>
              {isWhitelisted ? "whitelisted" : "not whitelisted"}
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
          <b>Whitelist Sender</b>
          <input value={senderAddress} onChange={(e) => setSenderAddress(String(e.target.value))} />
          <button onClick={handleWhitelistSender}>whitelist</button>
        </div>
      </div>
    )
  )
}
