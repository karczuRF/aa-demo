import React, { useState } from "react"

import { useERC20 } from "./useFakeUSD.tsx"

import { useAccountSigner } from "./aa/useAccountSigner.tsx"
import { useMultiOwnerSmartAccount } from "./MultiSigAccount/useMultiOwnerSmartAccount.tsx"
import { UserOperationsERC20Params } from "./UserOperationsERC20.types.ts"
import { Hex, encodeFunctionData, hexToBytes, parseUnits } from "viem"
import { SMART_ACCOUNT_ADDRESS } from "../utils/const.ts"

import { UserOperationCallData } from "@alchemy/aa-core"
import { SchnorrSigner } from "aams-test/dist/signers/SchnorrSigner"
import { SchnorrMultiSigTx } from "aams-test/dist/transaction/SchnorrMultiSigTx"
import { ERC20_abi } from "aams-test/dist/abi/index"
import { createSchnorrSigner } from "aams-test/dist/utils/schnorr-helpers"
import {
  MultiSigAccountSigner,
  createMultiSigAccountSigner,
} from "aams-test/dist/accountAbstraction/MultiSigAccountSigner"

// TODO remove as this is for demo only
const pk1 = import.meta.env.VITE_SIGNER_PRIVATE_KEY
const pk2 = import.meta.env.VITE_SIGNER2_PK
const pk3 = import.meta.env.VITE_SIGNER3_PK

export interface Tx {
  tx: SchnorrMultiSigTx
  signers: SchnorrSigner[]
}

export const TransferUserOperation: React.FC<UserOperationsERC20Params> = ({
  toAddress,
  address,
  ...accountParams
}) => {
  const [amount, setAmount] = useState<string>("0")
  const [musigSigner, setMusigSigner] = useState<MultiSigAccountSigner>()
  const [idSigner, setIdSigner] = useState<number>(0)
  const [txId, setTxId] = useState<number>(0)
  const [txHash, setTxHash] = useState<string>("")
  const [operationHash, setOperationHash] = useState<Hex>("0x")
  const [txInstances, setTxInstances] = useState<Tx[]>([])

  const { decimals } = useERC20({ address, chainId: accountParams.chainId })

  const accountSigner = useAccountSigner({
    chainId: accountParams.chainId,
    externalAccountAddress: SMART_ACCOUNT_ADDRESS as Hex,
  })
  const { multiOwnerSmartAccount: smartAccount, nonce } = useMultiOwnerSmartAccount({
    chainId: accountParams.chainId,
  })

  console.log("===> [TransferUserOperation] smartAccount", smartAccount)
  console.log("===> [TransferUserOperation] nextNonce", nonce)

  const handleSingleSign = async () => {
    if (txInstances) {
      const _tx = txInstances[txId]
      const signer = _tx.signers[idSigner]
      console.log("[musigtx] handle single sign user ====>>>>", signer.getAddress())
      console.log("[musigtx] handle single sign txInstances ====>>>>", { txInstances })
      txInstances[txId].tx.signMultiSigHash(signer)
      console.log("[musigtx] handle sign sig  done ====>>>>")
    }
  }

  const handleGenerateOpHash = async () => {
    console.log("===> [TransferUserOperation] accountSigner", accountSigner)
    if (accountSigner && decimals) {
      const _signer = createMultiSigAccountSigner(accountSigner)
      setMusigSigner(_signer)
      const _am = parseUnits(amount, decimals)

      const uoCallData: UserOperationCallData = encodeFunctionData({
        abi: ERC20_abi,
        args: [toAddress, _am],
        functionName: "transfer",
      })

      const { opHash, request } = await _signer.buildUserOpWithGasEstimator(
        {
          data: uoCallData,
          target: address as Hex,
        },
        {
          preVerificationGas: 2000000,
        }
      )
      setOperationHash(opHash)

      console.log("===> [TransferUserOperation] OP HASH", opHash)

      const signer1 = createSchnorrSigner(hexToBytes(pk1))
      const signer2 = createSchnorrSigner(hexToBytes(pk2))
      const combo1 = [signer1, signer2]
      const ms1 = new SchnorrMultiSigTx(combo1, opHash, request)

      const tx1: Tx = {
        tx: ms1,
        signers: combo1,
      }

      const signer3 = createSchnorrSigner(hexToBytes(pk1))
      const signer4 = createSchnorrSigner(hexToBytes(pk2))
      const combo2 = [signer3, signer4]
      const ms2 = new SchnorrMultiSigTx(combo2, opHash, request)

      const tx2: Tx = {
        tx: ms2,
        signers: combo2,
      }

      const signer5 = createSchnorrSigner(hexToBytes(pk2))
      const signer6 = createSchnorrSigner(hexToBytes(pk3))
      const signer7 = createSchnorrSigner(hexToBytes(pk1))
      const combo3 = [signer5, signer6, signer7]
      const ms3 = new SchnorrMultiSigTx(combo3, opHash, request)

      const tx3: Tx = {
        tx: ms3,
        signers: combo3,
      }

      setTxInstances([tx1, tx2, tx3])
    }
  }

  const handleTransfer = async () => {
    console.log("===> [TransferUserOperation] accountSigner", accountSigner)
    if (musigSigner && txInstances) {
      const _multiSigTx = txInstances[txId].tx
      const _tx = await musigSigner.sendMultiSigTransaction(_multiSigTx)

      console.log("===> [TransferUserOperation] userOperationTransaction", _tx)
      setTxHash(_tx)
      setAmount("0")
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <h2>
        Tx ID: <input style={{ width: "500px" }} value={txId} onChange={(e) => setTxId(Number(e.target.value))} />{" "}
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
