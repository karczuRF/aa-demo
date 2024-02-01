import React, { useState } from "react"

import { MultiOwnersSmartAccountParams } from "../MultiOwnersSmartAccount.types.ts"

import { _hashMessage } from "aams-test/dist/core/index"
import DefaultSigner from "aams-test/dist/utils/DefaultSigner"
import { generateCombinedSigDataAndHash } from "aams-test/dist/utils/schnorr-helpers"

export const CreateSignature: React.FC<MultiOwnersSmartAccountParams> = (accountParams) => {
  const { chainId } = accountParams
  const [msg, setMsg] = useState<string>("")
  const [msgHash, setMsgHash] = useState<string>("")
  const [signature, setSignature] = useState<string>("")

  const signer1 = new DefaultSigner(1)
  const signer2 = new DefaultSigner(2)

  const handleVerifySignature = async () => {
    console.log("verify signature", chainId)
    if (msg) {
      console.log("SCHNORR create", msg)
      // const _sig = await accountSigner?.signMessage(_hash)
      const _sig = await generateCombinedSigDataAndHash([signer1, signer2], msg)

      // const transferData = MultiSigSmartAccount.encodeFunctionData("grantRole", [])
      // const transferUserOperation: TransactionRequest = {
      //   data: transferData as Hex,
      //   to: address,
      // }
      // const userOperationTransaction = await accountSigner.sendTransaction(transferUserOperation)
      console.log("SCHNORR create signers", signer1.getAddress(), signer2.getAddress())
      if (_sig) {
        setMsgHash(_sig.msgHash)
        setSignature(_sig.sigData)
      }
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>Type message to be signed:</b>
      <input type="text" value={msg} onChange={(e) => setMsg(String(e.target.value))} />
      <button onClick={handleVerifySignature}>Generate Combined Signature</button>
      <h4>Message hash: {msgHash}</h4>
      <h5>Signature: {signature}</h5>
    </div>
  )
}
