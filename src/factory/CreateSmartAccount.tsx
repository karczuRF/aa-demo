import React, { useState } from "react"
import { SmartAccountFactoryParams } from "./SmartAccountFactory.types"
import { useAccountSigner } from "../aa/useAccountSigner"
import Schnorrkel from "aams-test/dist/schnorrkel"
import { Key } from "aams-test/dist/types"
import { generateCombinedPubAddress, pKeyString2Key } from "aams-test/dist/utils/schnorr-helpers"

export const CreateSmartAccount: React.FC<SmartAccountFactoryParams> = ({ chainId }) => {
  const [owner, setOwner] = useState<string>("0x372A291A9cad69b0F5F231cf1885574e9De7fD33")
  const [combinedPubKeys, setCombinedPubKeys] = useState<string[]>([
    "0x372A291A9cad69b0F5F231cf1885574e9De7fD33",
    "0x55a0a5Deb3AB0Eb280d34670EB27C5bbd54931FD",
  ])
  const [combinedSchnorrKey, setCombinedSchnorrKey] = useState<Key>()
  const [salt, setSalt] = useState<string>("salt")
  const [smartAccount, setSmartAccount] = useState<string>("")
  const accountSigner = useAccountSigner({ chainId })

  const handleGetCombinedPubKeys = async () => {
    console.log("get combined pub key")
    const _keys = combinedPubKeys.map((key) => pKeyString2Key(key))
    console.log("get combined pub key:", _keys)
    const _combined = Schnorrkel.getCombinedPublicKey(_keys)
    setCombinedSchnorrKey(_combined)
    return _combined
  }

  const handleCreateSmartAccount = async () => {
    console.log("verify smartAccount", chainId)
    if (owner && combinedPubKeys && salt) {
      console.log("create account")
      // const _hash = await accountSigner?.signMessage(msg)

      // const transferData = MultiSigSmartAccount.encodeFunctionData("grantRole", [])
      // const transferUserOperation: TransactionRequest = {
      //   data: transferData as Hex,
      //   to: address,
      // }
      // const userOperationTransaction = await accountSigner.sendTransaction(transferUserOperation)

      // if (_hash) setSmartAccount(_hash)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>Type message to be signed:</b>
      <input type="text" value={owner} onChange={(e) => setOwner(String(e.target.value))} />
      <input type="text" value={combinedPubKeys} onChange={(e) => setCombinedPubKeys(Array(e.target.value))} />
      <input type="text" value={salt} onChange={(e) => setSalt(String(e.target.value))} />
      <button onClick={handleGetCombinedPubKeys}>Get Combined Pub Key</button>
      <h4>combinedSchnorrKey: {combinedSchnorrKey?.toHex()}</h4>
    </div>
  )
}
