import React from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { polygonMumbai } from "wagmi/chains"
export const Connect: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {connectors.map((connector) => {
        return isConnected ? (
          <button onClick={() => disconnect()}>Disconnect {address}</button>
        ) : (
          <button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector, chainId: polygonMumbai.id })}
          >
            Connect {connector.name}
          </button>
        )
      })}
    </div>
  )
}
