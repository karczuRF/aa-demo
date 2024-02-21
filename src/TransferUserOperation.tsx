import React, { useState } from "react"
import { type TransactionRequest } from "@ethersproject/providers"

import { useERC20 } from "./useFakeUSD.tsx"
import { BigNumber, utils } from "ethers"

import { useAccountSigner } from "./aa/useAccountSigner.tsx"
import { useMultiOwnerSmartAccount } from "./MultiSigAccount/useMultiOwnerSmartAccount.tsx"
import { UserOperationsERC20Params } from "./UserOperationsERC20.types.ts"
import { Hex, encodeFunctionData, hexToBytes, parseEther, parseUnits } from "viem"
import { SMART_ACCOUNT_ADDRESS } from "../utils/const.ts"
import { useMultiSigTx } from "./aa/useMultiSigTx.tsx"
import { useSchnorrSigners } from "./aa/useSchnorrSigners.tsx"
import {
  UserOperationCallData,
  UserOperationRequest,
  UserOperationStruct,
  deepHexlify,
  getUserOperationHash,
} from "@alchemy/aa-core"
import SchnorrSigner from "aams-test/dist/utils/SchnorrSigner"
import MultiSigSchnorrTx from "./account-abstraction/MultiSigSchnorrTx.ts"
import { ERC20_abi } from "aams-test/dist/abi/index"
import { createSchnorrSigner } from "aams-test/dist/utils/schnorr-helpers"

// import { UserOperationStruct } from "aams-test/dist/typechain/contracts/MultiSigSmartAccount"
const pk1 = import.meta.env.VITE_SIGNER_PRIVATE_KEY
const pk2 = import.meta.env.VITE_SIGNER2_PK
const pk3 = import.meta.env.VITE_SIGNER3_PK
// export type SignersPerTxIndex = {
//   [id: number]: SchnorrSigner[]
// }
// export type TxsPerSigner = {
//   [address: string]: MultiSigSchnorrTx[]
// }

export interface Tx {
  tx: MultiSigSchnorrTx
  signers: SchnorrSigner[]
}

export const TransferUserOperation: React.FC<UserOperationsERC20Params> = ({
  toAddress,
  address,
  ...accountParams
}) => {
  const [amount, setAmount] = useState<string>("0")
  const [id, setId] = useState<number>(0)
  const [idSigner, setIdSigner] = useState<number>(0)
  const [txHash, setTxHash] = useState<string>("")
  const [operationHash, setOperationHash] = useState<Hex>("0x")
  const [opRequest, setOpRequest] = useState<UserOperationRequest>()
  const [opStruct, setOpStruct] = useState<UserOperationStruct | undefined>()
  const { erc20, decimals } = useERC20({ address, chainId: accountParams.chainId })
  // let signersPerTxIndex = new Map<number, SchnorrSigner[]>([[0, []]])
  // let txsPerSigner = new Map<string, MultiSigSchnorrTx[]>([
  //   ["0x2f21aafed209d8ccb8cecba6850743fde645de08", []],
  //   ["0x75b731e25ffe4bad233356e4bf40168e5f35aa0d", []],
  //   ["0x8507cccd2eb83b90b8ef92e7bdde6556b0508d7e", []],
  // ])
  // const [combinedPk, signers] = useMap<string, SchnorrSigner[]>()
  // const [signer, multisigTxs] = useMap<string, MultiSigSchnorrTx[]>()

  // const [muSigTx, setMuSigTx] = useState<MultiSigSchnorrTx[]>()
  // const [signersTx, setSignersTx] = useState<SchnorrSigner[][]>()
  const [txInstances, setTxInstances] = useState<Tx[]>([])
  // const accountSigner = useAccountOwner({ chainId: accountParams.chainId })
  // const _provider = useAlchemyProvider(_chain)
  const accountSigner = useAccountSigner({
    chainId: accountParams.chainId,
    externalAccountAddress: SMART_ACCOUNT_ADDRESS as Hex,
  })
  const { multiOwnerSmartAccount: smartAccount, nonce } = useMultiOwnerSmartAccount({
    chainId: accountParams.chainId,
  })

  // const schnorrSigners = useSchnorrSigners({ chainId: accountParams.chainId })

  // const muSigTx = useMultiSigTx({ signers: schnorrSigners, opHash: operationHash })

  console.log("===> [TransferUserOperation] smartAccount", smartAccount)
  console.log("===> [TransferUserOperation] nextNonce", nonce)

  const handleSingleSign = async () => {
    if (txInstances) {
      const _tx = txInstances[id]
      const signer = _tx.signers[idSigner]
      console.log("[musigtx] handle single sign user ====>>>>", signer.getAddress())
      console.log("[musigtx] handle single sign txInstances ====>>>>", { txInstances })
      txInstances[id].tx.singleSignHash(signer)
      // const _sig = muSigTx.singleSignHash(signer)
      console.log("[musigtx] handle sign sig  done ====>>>>")
    }
  }

  function createInstance<A extends MultiSigSchnorrTx>(c: new (...[]) => A): A {
    return new c()
  }
  const handleGenerateOpHash = async () => {
    console.log("===> [TransferUserOperation] accountSigner", accountSigner)
    if (accountSigner && decimals) {
      const _am = parseUnits(amount, decimals)
      const aaSignerWithMiddle = accountSigner.withGasEstimator(async (userOperation) => {
        return Promise.resolve({
          ...userOperation,
          verificationGasLimit: 2000000,
          callGasLimit: 2000000,
          preVerificationGas: 2000000,
          // maxFeePerGas: Promise.resolve(utils.parseUnits("200", "gwei").toHexString() as Hex),
          // maxPriorityFeePerGas: Promise.resolve(utils.parseUnits("200", "gwei").toHexString() as Hex),
        })
      })

      const provider = accountSigner.provider.accountProvider

      const uoCallData: UserOperationCallData = encodeFunctionData({
        abi: ERC20_abi,
        args: [toAddress, _am],
        functionName: "transfer",
      })

      const uoStruct = await provider.buildUserOperation({ target: address as Hex, data: uoCallData })
      const request = deepHexlify(uoStruct)
      const operationHash = getUserOperationHash(
        request,
        provider.getEntryPointAddress(),
        BigInt(await accountSigner.getChainId())
      )
      setOpRequest(request)
      setOperationHash(operationHash)

      console.log("===> [TransferUserOperation] OP HASH", operationHash)

      // const allSignersCombos: SchnorrSigner[][] = getAllCombos(schnorrSigners).filter((combo) => combo.length >= 2)

      const signer1 = createSchnorrSigner(hexToBytes(pk1), 1)
      const signer2 = createSchnorrSigner(hexToBytes(pk2), 2)
      const combo1 = [signer1, signer2]
      const ms1 = new MultiSigSchnorrTx(combo1, operationHash, 1)

      const tx1: Tx = {
        tx: ms1,
        signers: combo1,
      }
      // tx?.push(tx1)

      const signer3 = createSchnorrSigner(hexToBytes(pk1), 3)
      const signer4 = createSchnorrSigner(hexToBytes(pk2), 4)
      const combo2 = [signer3, signer4]
      const ms2 = new MultiSigSchnorrTx(combo2, operationHash, 2)

      const tx2: Tx = {
        tx: ms2,
        signers: combo2,
      }
      // tx?.push(tx1)

      const signer5 = createSchnorrSigner(hexToBytes(pk2), 5)
      const signer6 = createSchnorrSigner(hexToBytes(pk3), 6)
      const signer7 = createSchnorrSigner(hexToBytes(pk1), 7)
      const combo3 = [signer5, signer6, signer7]
      const ms3 = new MultiSigSchnorrTx(combo3, operationHash)

      const tx3: Tx = {
        tx: ms3,
        signers: combo3,
      }
      // tx?.push(tx3)

      // const _pk = combo1.map((signer) => signer.getPublicKey())
      // const combinedPubKey = Schnorrkel.getCombinedPublicKey(_pk)

      ms1.setOpHash(operationHash)
      ms2.setOpHash(operationHash)
      ms3.setOpHash(operationHash)

      setTxInstances([tx1, tx2, tx3])
    }
  }

  const handleTransfer = async () => {
    // const _provider = new AlchemyProvider({ apiKey: import.meta.env.VITE_MUMBAI_ALCHEMY_API_KEY, chain: polygonMumbai })
    // const _client = await getWalletClient({ chainId: accountParams.chainId })
    console.log("===> [TransferUserOperation] accountSigner", accountSigner)
    if (erc20 && decimals && accountSigner && opRequest) {
      const aaSignerWithMiddle = accountSigner.withGasEstimator(async (userOperation) => {
        return Promise.resolve({
          ...userOperation,
          verificationGasLimit: 2000000,
          callGasLimit: 2000000,
          preVerificationGas: 2000000,
          // maxFeePerGas: Promise.resolve(utils.parseUnits("200", "gwei").toHexString() as Hex),
          // maxPriorityFeePerGas: Promise.resolve(utils.parseUnits("200", "gwei").toHexString() as Hex),
        })
      })

      const provider = accountSigner.provider.accountProvider
      // const uoStruct = await provider.buildUserOperation({
      //   target: toAddress as Hex,
      //   value: _am,
      //   data: "0x",
      // })
      // const request = deepHexlify(uoStruct)
      // const operationHash = getUserOperationHash(
      //   request,
      //   provider.getEntryPointAddress(),
      //   BigInt(await aaSignerWithMiddle.getChainId())
      // )
      // setOperationHash(operationHash)
      // dla kazddego signera generujemy podpois operationHash
      // sumujemy je

      // muSigTx.setMsg(operationHash)
      // const _sig1 = muSigTx.singleSignMessage(schnorrSigners[0])
      // const _sig2 = muSigTx.singleSignMessage(schnorrSigners[1])
      // console.log("===> [TransferUserOperation] signers", _sig1, _sig2)

      if (!txInstances) return
      const _multiSigTx = txInstances[id].tx
      console.log("===> [TransferUserOperation][musigtx] single sign done", { _multiSigTx })
      const sumSignature = _multiSigTx.getMultiSign()
      console.log("===> [TransferUserOperation][musigtx] sum sig", sumSignature)
      console.log("===> [TransferUserOperation][musigtx] nonce", smartAccount?.getNonce())
      opRequest.signature = sumSignature as Hex
      console.log("===> [TransferUserOperation][musigtx] opRequest", { opRequest })
      // console.log("===> [TransferUserOperation] request", { request })
      const txHash = await provider.rpcClient.sendUserOperation(opRequest, provider.getEntryPointAddress())
      const _tx = await provider.waitForUserOperationTransaction(txHash)

      console.log("===> [TransferUserOperation] userOperationTransaction", _tx)
      setTxHash(_tx)
      setAmount("0")
    }
  }

  //0xaFe354bA3E06F58793772D10d6f8765EeA766Cc4
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <h2>
        ID: <input style={{ width: "500px" }} value={id} onChange={(e) => setId(Number(e.target.value))} />{" "}
      </h2>
      <h2>
        signer:{" "}
        <input style={{ width: "500px" }} value={idSigner} onChange={(e) => setIdSigner(Number(e.target.value))} />{" "}
      </h2>
      <button onClick={handleSingleSign}>SIGN</button>
      <b>user operation: transfer to {toAddress}</b>
      <input value={amount} onChange={(e) => setAmount(String(e.target.value))} />
      <button onClick={handleGenerateOpHash}>GENERATE OP HASH</button>
      <b>operation hash {operationHash}</b>
      <button onClick={handleTransfer}>SEND USER OP</button>
      <b>user operation: transfer hash {txHash}</b>
    </div>
  )
}
