import React, { useState } from "react"
import { SmartAccountFactoryParams } from "./SmartAccountFactory.types"

import { useSmartAccountFactory } from "./useSmartAccountFactory"
import { Hex } from "viem"
import { useSchnorrSigners } from "../aa/useSchnorrSigners"
import { usePublicEthersProvider } from "../aa/usePublicEthersProvider"
import { SchnorrSigner } from "aa-schnorr-multisig-sdk/dist/signers"
import { getAllCombinedAddrFromSigners } from "aa-schnorr-multisig-sdk/dist/helpers/schnorr-helpers"
import {
  getAccountImplementationAddress,
  predictAccountAddrOffchain,
  predictAccountAddrOnchain,
  predictAccountImplementationAddrOffchain,
  predictFactoryAddrOffchain,
  saltToHex,
} from "aa-schnorr-multisig-sdk/dist/helpers/create2"
import { useEthersSigner } from "../aa/useEthersSigner"
import { Signer } from "ethers"
import { ENTRYPOINT_ADDRESS } from "../../utils/const"
import { getAllCombinedAddrFromKeys } from "aa-schnorr-multisig-sdk/dist/helpers/schnorr-helpers"

export const CreateSmartAccount: React.FC<SmartAccountFactoryParams> = ({ chainId, factoryAddress }) => {
  const { isFactoryCreated, smartAccountFactory } = useSmartAccountFactory({ chainId, factoryAddress })

  const [schnorrSigner, setSchnorrSigner] = useState<SchnorrSigner[]>([])
  const [combinedAddress, setCombinedAddress] = useState<string[]>([])
  const [predictedImplAddress, setPredictedImplAddress] = useState<string>()
  const [predictedFactoryAddress, setPredictedFactoryAddress] = useState<string>()
  const [predictedAddress, setPredictedAddress] = useState<string>()

  // example of combined Schnorr Signers addresses
  // const [combinedAddr, setCombinedAddr] = useState<string[]>([
  //   "0x86bdff71227301d3d1d13cf0538f23bf555a4265",
  //   "0x957a802ccb5a918ba137bf9f795ebd65fa1f1f46",
  //   "0xf659f67e7b203b8e2d5585a736aba13ad55217b1",
  //   "0x2f21aafed209d8ccb8cecba6850743fde645de08",
  //   "0xe3ca21f9f9e4b21ed2f3bcbebf82e9be7b75b4a5",
  //   "0x75b731e25ffe4bad233356e4bf40168e5f35aa0d",
  //   "0x8507cccd2eb83b90b8ef92e7bdde6556b0508d7e",
  // ])

  const [salt, setSalt] = useState<string>("salt")
  const [txHash, setTxHash] = useState<string>("")
  const [x, setX] = useState<number>(3)
  // const accountSigner = useAccountSigner({ chainId })
  const signers = useSchnorrSigners({ chainId })
  const provider = usePublicEthersProvider({ chainId })
  const ethsigner = useEthersSigner({ chainId: 80001 }) as unknown as Signer

  const handlePredict = async () => {
    // predict Factory address using salt
    const saltFactory = saltToHex("aafactorysalttest") // used the same for Factory contract deploy
    const predictedFactory = predictFactoryAddrOffchain(saltFactory, ENTRYPOINT_ADDRESS)
    console.log(`AA PREDICTED FACTORY OFFCHAIN :`, predictedFactory)
    // predict Implementation Address
    const predictedImplementation = predictAccountImplementationAddrOffchain(
      saltFactory,
      predictedFactory,
      ENTRYPOINT_ADDRESS
    )
    console.log(`AA PREDICTED AA IMPLEMETATION OFFCHAIN :`, predictedImplementation)

    const _factoryAddress: Hex = (smartAccountFactory?.address ?? "0x") as Hex
    const implementationAddr = await getAccountImplementationAddress(_factoryAddress, ethsigner)
    const saltHash = saltToHex(salt)
    // predict address onchain
    const predictedOnchain = await predictAccountAddrOnchain(_factoryAddress, combinedAddress, saltHash, ethsigner)
    // predict address offchain
    const predictedOffchain = predictAccountAddrOffchain(_factoryAddress, implementationAddr, combinedAddress, saltHash)

    console.log(`AA PREDICTED ADDRESS ONCHAIN :`, predictedOnchain)
    console.log(`AA PREDICTED ADDRESS OFFCHAIN:`, predictedOffchain)
    setPredictedFactoryAddress(predictedFactory)
    setPredictedImplAddress(predictedImplementation)
    setPredictedAddress(predictedOffchain)
  }

  const handleGetSigners = async () => {
    setSchnorrSigner(signers)
    console.log(`AA SIG ${schnorrSigner.length} SIGNERS CREATED`)
  }

  const handleGetAllComboAddresses = async () => {
    const _combos = getAllCombinedAddrFromSigners(schnorrSigner, x)
    const _pk = schnorrSigner.map((signer) => {
      return signer.getPubKey()
    })
    const _combosFromPk = getAllCombinedAddrFromKeys(_pk)

    setCombinedAddress(_combos)
    console.log("AA COMBO ADDRESSES CREATED FROM SIGNERS", _combos)
    console.log("AA COMBO ADDRESSES CREATED FROM PUB KEY", _combosFromPk)
  }

  const handleCreateSmartAccount = async () => {
    if (smartAccountFactory && combinedAddress && salt && provider) {
      console.log("SA CREATION IN PROGRESS...")
      const saltHash = saltToHex(salt)
      const _createTx = await smartAccountFactory.createAccount(combinedAddress, saltHash)
      const _receipt = await _createTx.wait()
      if (_receipt) {
        console.log("SASMART ACCOUNT SUCCESS")
        setTxHash(_receipt.transactionHash)
      }
      console.log("SA CREATION DONE")
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <h2 style={{ color: isFactoryCreated ? "green" : "red" }}>Factory Address: {smartAccountFactory?.address}</h2>

      <button onClick={handleGetSigners}>Generate Signers</button>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {schnorrSigner.map((signer) => {
          return schnorrSigner.length > 0 ? (
            <text>Schnorr Signer address: {signer.getAddress()}</text>
          ) : (
            <text>NO SIGNERS</text>
          )
        })}
      </div>
      <h2></h2>
      <b>Set X value (X out of Y signers used for creating combined addresses)</b>
      <input type="number" value={x} onChange={(e) => setX(Number(e.target.value))} />
      <h2></h2>
      <button onClick={handleGetAllComboAddresses}>
        Generate COMBO ADDRESSES: {x} out of {schnorrSigner.length}
      </button>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {combinedAddress.map((combo) => {
          return combinedAddress.length > 0 ? <text>{combo}</text> : <text>NO COMBOS</text>
        })}
      </div>

      <h2></h2>
      <b>Create new Account with params (combinedAddress[], salt: string)</b>
      <input type="text" value={combinedAddress} onChange={(e) => setCombinedAddress(Array(e.target.value))} />
      <input
        type="text"
        value={salt}
        onChange={(e) => {
          setSalt(String(e.target.value))
        }}
      />
      <button onClick={handlePredict}>Predict Account Address</button>
      <b>Predicted Factory Address: {predictedFactoryAddress}</b>
      <b>Predicted AA Impl Address: {predictedImplAddress}</b>
      <b>Predicted Account Address: {predictedAddress}</b>
      <button onClick={handleCreateSmartAccount}>Create new MultiSig Smart Account</button>
      <h4>Create Account Tx Hash: {txHash}</h4>
    </div>
  )
}
