import React, { useState } from "react"

import { ConnectionParams } from "../MultiSigAccount/MultiOwnersSmartAccount.types.ts"
import { Hex } from "viem"
import { CreateSmartAccount } from "./CreateSmartAccount.tsx"
import { MUSIG_ACCOUNT_FACTORY_ADDRESS } from "../../utils/const.ts"

export const SmartAccountFactory: React.FC<ConnectionParams> = ({ chainId }) => {
  const [factoryAddress, setFactoryAddress] = useState<Hex | undefined>(MUSIG_ACCOUNT_FACTORY_ADDRESS)

  const handleChangeAccountAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (value.startsWith("0x") && value.length === 42) {
      setFactoryAddress(value as Hex)
    }

    if (value.length === 0) {
      setFactoryAddress(undefined)
    }
  }

  return (
    <div style={{ margin: "24px", padding: "12px" }}>
      <h2>
        Smart Account Factory:{" "}
        <input type="text" style={{ width: "500px" }} value={factoryAddress} onChange={handleChangeAccountAddress} />
      </h2>
      <>
        <CreateSmartAccount chainId={chainId} factoryAddress={factoryAddress} />
      </>
    </div>
  )
}
