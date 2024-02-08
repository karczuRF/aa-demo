import React, { useState } from "react"
import { SmartAccountFactoryParams } from "./SmartAccountFactory.types"
import { useAccountSigner } from "../aa/useAccountSigner"
import Schnorrkel from "aams-test/dist/schnorrkel"
import { Key } from "aams-test/dist/types"
import {
  createSchnorrSigner,
  generateCombinedPubAddress,
  getAllCombinedPubAddressXofY,
  pKeyString2Key,
} from "aams-test/dist/utils/schnorr-helpers"
import { useSmartAccountFactory } from "./useSmartAccountFactory"
import { Hex, hexToBytes, stringToBytes } from "viem"
import SchnorrSigner from "aams-test/dist/utils/SchnorrSigner"
import { useSchnorrSigners } from "../aa/useSchnorrSigners"
import { usePublicEthersProvider } from "../aa/usePublicEthersProvider"

export const CreateSmartAccount: React.FC<SmartAccountFactoryParams> = ({ chainId, factoryAddress }) => {
  const { isFactoryCreated, smartAccountFactory } = useSmartAccountFactory({ chainId, factoryAddress })

  const [owner, setOwner] = useState<string>("0x372A291A9cad69b0F5F231cf1885574e9De7fD33")
  const [schnorrSigner, setSchnorrSigner] = useState<SchnorrSigner[]>([])
  const [allComboAddresses, setAllComboAddresses] = useState<string[]>([])
  const [combinedPubKeys, setCombinedPubKeys] = useState<string[]>([
    "0x372A291A9cad69b0F5F231cf1885574e9De7fD33",
    "0x55a0a5Deb3AB0Eb280d34670EB27C5bbd54931FD",
    "0x5a50893a11d37bc12f0af0514883ff85dd224e20",
    "0xccec0a637cff7b18f7b53ca4b5fd7a13ebc438c7",
    "0x8507cccd2eb83b90b8ef92e7bdde6556b0508d7e",
  ])
  const [combinedSchnorrKey, setCombinedSchnorrKey] = useState<Key>()
  const [salt, setSalt] = useState<string>("salt")
  const [txHash, setTxHash] = useState<string>("")
  // const accountSigner = useAccountSigner({ chainId })
  const signers = useSchnorrSigners({ chainId })
  const provider = usePublicEthersProvider({ chainId })

  const handleGetSigners = async () => {
    setSchnorrSigner(signers)
    console.log(`AA SIG ${schnorrSigner.length} SIGNERS CREATED`)
  }

  const handleGetAllComboAddresses = async () => {
    const _combos = getAllCombinedPubAddressXofY(schnorrSigner, 1)
    setAllComboAddresses(_combos)
    console.log("AA COMBO ADDRESSES CREATED", _combos)
  }

  const handleGetCombinedPubKeys = async () => {
    console.log("get combined pub key")
    const _keys = combinedPubKeys.map((key) => pKeyString2Key(key))
    console.log("get combined pub key:", _keys)
    const _combined = Schnorrkel.getCombinedPublicKey(_keys)
    setCombinedSchnorrKey(_combined)
    return _combined
  }

  const handleCreateSmartAccount = async () => {
    console.log("SA CREATION", smartAccountFactory, owner, combinedPubKeys, salt, provider)
    if (smartAccountFactory && owner && allComboAddresses && salt && provider) {
      console.log("SA CREATION IN PROGRESS...", owner)
      const _saltBytes = stringToBytes(salt, { size: 32 })
      const _createTx = await smartAccountFactory.createAccount(owner, allComboAddresses, _saltBytes)
      const _receipt = await _createTx.wait()
      if (_receipt) {
        console.log("SASMART ACCOUNT SUCCESS")
        setTxHash(_receipt.transactionHash)
      }
      console.log("SA CREATION DONE")
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
      <h2 style={{ color: isFactoryCreated ? "green" : "red" }}>Factory Address: {smartAccountFactory?.address}</h2>

      <button onClick={handleGetSigners}>Generate Signers</button>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {schnorrSigner.map((signer) => {
          return schnorrSigner.length > 0 ? <text>Signer created {signer.getAddress()}</text> : <text>NO SIGNERS</text>
        })}
      </div>
      <h2></h2>
      <button onClick={handleGetAllComboAddresses}>Generate All COMBO ADDRESSES</button>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {allComboAddresses.map((combo) => {
          return allComboAddresses.length > 0 ? <text>{combo}</text> : <text>NO COMBOS</text>
        })}
      </div>
      <b>Create new account:</b>
      <input type="text" value={owner} onChange={(e) => setOwner(String(e.target.value))} />
      <input type="text" value={combinedPubKeys} onChange={(e) => setCombinedPubKeys(Array(e.target.value))} />
      <input type="text" value={salt} onChange={(e) => setSalt(String(e.target.value))} />
      <button onClick={handleCreateSmartAccount}>Create new smart account</button>
      <h4>combinedSchnorrKey: {txHash}</h4>
    </div>
  )
}
