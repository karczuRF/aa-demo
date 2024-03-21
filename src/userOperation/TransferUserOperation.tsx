import React, { useState } from "react"

import { useERC20 } from "../erc20/useFakeUSD.tsx"

import { useAccountSigner } from "../aa/useAccountSigner.tsx"
import { useMultiOwnerSmartAccount } from "../MultiSigAccount/useMultiOwnerSmartAccount.tsx"
import { UserOperationsERC20Params } from "./UserOperationsERC20.types.ts"
import { Hex, encodeFunctionData, parseEther, parseUnits } from "viem"
import { FAKE_ERC20_USDC_ADDRESS, SMART_ACCOUNT_ADDRESS } from "../../utils/const.ts"

import { UserOperationCallData } from "@alchemy/aa-core"
import { SchnorrSigner } from "aa-schnorr-multisig-sdk/dist/signers/index"
import {
  MultiSigAccountSigner,
  createMultiSigAccountSigner,
} from "aa-schnorr-multisig-sdk/dist/accountAbstraction/index"
import { createSchnorrSigner } from "aa-schnorr-multisig-sdk/dist/helpers/schnorr-helpers"
import { ERC20_abi } from "aa-schnorr-multisig/dist/abi/index"
import { PublicNonces } from "aa-schnorr-multisig-sdk/dist/types/nonce"
import { Key } from "aa-schnorr-multisig-sdk/dist/types/key"
import { MultiSigUserOpWithSigners } from "aa-schnorr-multisig-sdk/dist/transaction/MultiSigUserOpWithSigners"
import { MultiSigUserOp } from "aa-schnorr-multisig-sdk/dist/transaction/MultiSigUserOp"

// TODO remove as this is for demo only
const pk1 = import.meta.env.VITE_SIGNER_PRIVATE_KEY
const pk2 = import.meta.env.VITE_SIGNER2_PK
const pk3 = import.meta.env.VITE_SIGNER3_PK

export interface Tx {
  tx: MultiSigUserOpWithSigners
  signers: SchnorrSigner[]
}

export interface MsUserOp {
  userOp: MultiSigUserOp
  publicKeys: Key[]
  publicNonces: PublicNonces[]
  submittedSigs: number
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

  // example usage of using MultiSigUserOpWithSigners
  // const [userOpInstance, setUserOpInstance] = useState<MsUserOp>()

  const { decimals } = useERC20({ address, chainId: accountParams.chainId })

  const accountSigner = useAccountSigner({
    chainId: accountParams.chainId,
    smartAccountAddress: SMART_ACCOUNT_ADDRESS as Hex,
  })
  const { multiOwnerSmartAccount: smartAccount, nonce } = useMultiOwnerSmartAccount({
    chainId: accountParams.chainId,
  })

  console.log("===> [TransferUserOperation] smartAccount", smartAccount)
  console.log("===> [TransferUserOperation] nextNonce", nonce)

  const handleGenerateOpHash = async () => {
    console.log("===> [TransferUserOperation] accountSigner", accountSigner)
    if (accountSigner && decimals) {
      const _signer = createMultiSigAccountSigner(accountSigner)
      setMusigSigner(_signer)

      // ======== SMART ACCOUNT DEPOSIT WITHDRAWAL ========
      // const _am = parseEther(amount)
      // const uoCallData: UserOperationCallData = encodeFunctionData({
      //   abi: MultiSigSmartAccount_abi,
      //   args: [toAddress, _am],
      //   functionName: "withdrawDepositTo",
      // })
      // const { opHash, request } = await _signer.buildUserOpWithGasEstimator(
      //   {
      //     data: uoCallData,
      //     target: SMART_ACCOUNT_ADDRESS as Hex,
      //   },
      //   {
      //     preVerificationGas: 2000000,
      //   }
      // )
      // ======== SMART ACCOUNT DEPOSIT WITHDRAWAL ========

      // ======== ETH TRANSFER ========
      // const _am = parseEther(amount)
      // const { opHash, request } = await _signer.buildUserOpWithGasEstimator(
      //   {
      //     data: "0x",
      //     target: SMART_ACCOUNT_ADDRESS as Hex,
      //     value: _am,
      //   },
      //   {
      //     preVerificationGas: 2000000,
      //   }
      // )
      // ======== ETH TRANSFER ========

      // ======== ERC20 TRANSFER ========
      const _am = parseUnits(amount, decimals)
      const uoCallData: UserOperationCallData = encodeFunctionData({
        abi: ERC20_abi,
        args: [toAddress, _am],
        functionName: "transfer",
      })
      const { opHash, request } = await _signer.buildUserOpWithGasEstimator(
        {
          data: uoCallData,
          target: FAKE_ERC20_USDC_ADDRESS as Hex,
        },
        {
          preVerificationGas: 2000000,
        }
      )
      // ======== ERC20 TRANSFER ========

      setOperationHash(opHash)

      console.log("===> [TransferUserOperation] OP HASH", opHash)

      /**
       * note!
       * for each transaction new Schnorr Signer needs to be created, because
       * each Signer has only 'one-time used' nonce for signle tx
       * other words - single instance of Schnorr Signer handles single nonces
       */

      const signer1 = createSchnorrSigner(pk1)
      const signer2 = createSchnorrSigner(pk2)
      const combo1 = [signer1, signer2]
      const ms1 = new MultiSigUserOpWithSigners(combo1, opHash, request)

      const tx0: Tx = {
        tx: ms1,
        signers: combo1,
      }

      /**
       * example usage of using MultiSigUserOpWithSigners
       * const _pk = combo1.map((signer) => {
       *   return signer.getPubKey()
       * })
       * const _pn = combo1.map((signer) => {
       *   return signer.generatePubNonces()
       * })
       * const msUserOp: MsUserOp = {
       *   userOp: new MultiSigUserOp(_pk, _pn, opHash, request),
       *   publicKeys: _pk,
       *   publicNonces: _pn,
       *   submittedSigs: 0,
       * }
       * setUserOpInstance(msUserOp)
       *
       */

      const signer3 = createSchnorrSigner(pk1)
      const signer4 = createSchnorrSigner(pk2)
      const combo2 = [signer3, signer4]
      const ms2 = new MultiSigUserOpWithSigners(combo2, opHash, request)

      const tx1: Tx = {
        tx: ms2,
        signers: combo2,
      }

      const signer5 = createSchnorrSigner(pk2)
      const signer6 = createSchnorrSigner(pk3)
      const signer7 = createSchnorrSigner(pk1)
      const combo3 = [signer5, signer6, signer7]
      const ms3 = new MultiSigUserOpWithSigners(combo3, opHash, request)

      const tx2: Tx = {
        tx: ms3,
        signers: combo3,
      }

      setTxInstances([tx0, tx1, tx2])
    }
  }

  const handleSingleSign = async () => {
    if (txInstances) {
      const _tx = txInstances[txId]
      const _signer = _tx.signers[idSigner]
      console.log(" ===>[musigtx] handle single sign user", _signer.getAddress())
      console.log(" ===>[musigtx] handle single sign txInstances", { txInstances })
      txInstances[txId].tx.signMultiSigHash(_signer)

      /**
       * example usage of using MultiSigUserOpWithSigners
       *
       * userOpInstance?.userOp.signMultiSigHash(_signer)
       * const sig = userOpInstance?.userOp._getSignatures()
       * console.log(" ===>[musigtx] handle sign sig done! Sig:", sig)
       * const submitted = userOpInstance?.userOp._getSignatures().length ?? 0
       * console.log(" ===>[musigtx] submitted Sigs for this UserOp:", submitted)
       */
    }
  }

  const handleTransfer = async () => {
    console.log("===> [TransferUserOperation] accountSigner:", accountSigner)
    if (musigSigner && txInstances) {
      const _multiSigTx = txInstances[txId].tx
      const _tx = await musigSigner.sendMultiSigTransaction(_multiSigTx)
      console.log("===> [TransferUserOperation] userOperation in progress...")

      //example usage of using MultiSigUserOpWithSigners
      // const _tx = await musigSigner.sendMultiSigUserOp(userOpInstance?.userOp)

      console.log("===> [TransferUserOperation] userOperationTransaction", _tx)
      setTxHash(_tx)
      setAmount("0")
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <h3 style={{ color: "yellow" }}>Schnorr MultiSig Transaction</h3>
      <b>UserOperation transfer to address: {toAddress}</b>
      <b>Enter decimal amount (value will be converted to ETH/ERC20 decimals accordingly):</b>
      <input value={amount} onChange={(e) => setAmount(String(e.target.value))} />
      <button onClick={handleGenerateOpHash}>INITIALIZE USER OP & GENERATE HASH</button>
      <b>opHash: {operationHash}</b>
      <h3>Created Transaction Instances IDs:</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {txInstances.map((tx, index) => {
          return txInstances.length > 0 ? (
            <text>
              Tx Index: {index} (Signers needed: {tx.signers.length})
            </text>
          ) : (
            <text>NO SIGNERS</text>
          )
        })}
      </div>
      <h3>
        Tx index: <input style={{ width: "500px" }} value={txId} onChange={(e) => setTxId(Number(e.target.value))} />{" "}
      </h3>
      <h3>
        Signer index (0/1/2):{" "}
        <input style={{ width: "500px" }} value={idSigner} onChange={(e) => setIdSigner(Number(e.target.value))} />{" "}
      </h3>
      <button onClick={handleSingleSign}>SIGN with Signer nr {idSigner}</button>
      <h2></h2>
      <button onClick={handleTransfer}>SEND USER OP</button>
      <b>userOperation tx hash: {txHash}</b>
    </div>
  )
}
