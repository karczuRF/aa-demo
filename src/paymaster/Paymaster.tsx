import React, { useCallback, useEffect, useState } from "react"

import { usePaymaster } from "./usePaymaster.tsx"
import { useEthersSigner } from "../aa/useEthersSigner.tsx"
import { ConnectionParams } from "../MultiSigAccount/MultiOwnersSmartAccount.types.ts"
import { utils } from "ethers"
import { useEntrypoint } from "../entrypoint/useEntrypoint.tsx"
import { UserOperationEventEvent } from "aa-schnorr-multisig/dist/typechain/contracts/erc4337/core/EntryPoint"
import { ENTRYPOINT_ADDRESS } from "../../utils/const.ts"

export const Paymaster: React.FC<ConnectionParams> = (connectionParams) => {
  const paymasterAddress = "0x"
  const entrypointAddress = ENTRYPOINT_ADDRESS

  const [paymasterDeposit, setPaymasterDeposit] = useState<string>("0")
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [senderAddress, setSenderAddress] = useState<string>("")
  const [signerAddress, setSignerAddress] = useState<string>("")
  const [events, setEvents] = useState<UserOperationEventEvent[]>([])

  const [isWhitelisted, setIsWhitelisted] = useState<boolean | undefined>()
  const [senderAddress2, setSenderAddress2] = useState<string>("")

  const signer = useEthersSigner(connectionParams)

  const { paymaster } = usePaymaster({ paymasterAddress, ...connectionParams })
  const { entrypoint } = useEntrypoint({ entrypointAddress, ...connectionParams })

  useEffect(() => {
    async function checkOwner() {
      if (paymaster && signer) {
        const _signerAddress = await signer.getAddress()
        const paymasterDeposit = await paymaster.getDeposit()
        const ownerAddress = await paymaster.owner()

        setPaymasterDeposit(utils.formatUnits(paymasterDeposit, 18))
        setIsOwner(ownerAddress == _signerAddress)
        setSignerAddress(_signerAddress)
      }
    }
    checkOwner()
  }, [paymaster, signer])

  useEffect(() => {
    async function getPaymasterEvents() {
      if (entrypoint && signer) {
        const event = entrypoint.filters.UserOperationEvent(undefined, undefined, paymasterAddress)
        const events = await entrypoint.queryFilter(event, 45385057)
        setEvents(events)
      }
    }
    getPaymasterEvents()
  }, [entrypoint, signer])

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
    <div style={{ margin: "48px", padding: "12px", border: "1px solid black" }}>
      <h2 style={{ color: "red" }}>Notice! Paymaster not currently supported! </h2>
      <h3 style={{ color: "yellow" }}>Paymaster {paymasterAddress}</h3>
      <h4 style={{ color: "yellow" }}>Signer {signerAddress}</h4>
      <h4 style={{ color: isOwner ? "green" : "red" }}>Is owner? {isOwner ? "yes" : "no"}</h4>
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
      <div>
        {events.map((event) => {
          return (
            <div
              key={event.transactionHash}
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "4px 0 8px 0",
                borderBottom: "1px solid black",
              }}
            >
              <div>Tx hash: {event.transactionHash}</div>
              <div>Sender: {event.args[1]}</div>
              <div>Amount paid: {utils.formatUnits(event.args[5], 18)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
