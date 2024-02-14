import React, { useState } from "react"
import { type TransactionRequest } from "@ethersproject/providers"

import { useERC20 } from "./useFakeUSD.tsx"
import { BigNumber, utils } from "ethers"

import { useAccountSigner } from "./aa/useAccountSigner.tsx"
import { useMultiOwnerSmartAccount } from "./MultiSigAccount/useMultiOwnerSmartAccount.tsx"
import { UserOperationsERC20Params } from "./UserOperationsERC20.types.ts"
import { Hex, parseEther, parseUnits } from "viem"
import { SMART_ACCOUNT_ADDRESS } from "../utils/const.ts"
import { useMultiSigTx } from "./aa/useMultiSigTx.tsx"
import { useSchnorrSigners } from "./aa/useSchnorrSigners.tsx"
import {
  UserOperationRequest,
  UserOperationStruct,
  deepHexlify,
  getUserOperationHash,
  isValidRequest,
} from "@alchemy/aa-core"
import SchnorrSigner from "aams-test/dist/utils/SchnorrSigner"
import MultiSigSchnorrTx from "./account-abstraction/MultiSigSchnorrTx.ts"
// import { UserOperationStruct } from "aams-test/dist/typechain/contracts/MultiSigSmartAccount"

export const TransferUserOperation: React.FC<UserOperationsERC20Params> = ({
  toAddress,
  address,
  ...accountParams
}) => {
  const [amount, setAmount] = useState<string>("0")
  const [txHash, setTxHash] = useState<string>("")
  const [operationHash, setOperationHash] = useState<Hex>("0x")
  const [opRequest, setOpRequest] = useState<UserOperationRequest>()
  const [opStruct, setOpStruct] = useState<UserOperationStruct | undefined>()
  const { erc20, decimals } = useERC20({ address, chainId: accountParams.chainId })
  const [muSigTx, setMuSigTx] = useState<MultiSigSchnorrTx>()

  // const accountSigner = useAccountOwner({ chainId: accountParams.chainId })
  // const _provider = useAlchemyProvider(_chain)
  const accountSigner = useAccountSigner({
    chainId: accountParams.chainId,
    externalAccountAddress: SMART_ACCOUNT_ADDRESS as Hex,
  })
  const { multiOwnerSmartAccount: smartAccount, nonce } = useMultiOwnerSmartAccount({
    chainId: accountParams.chainId,
  })

  const schnorrSigners = useSchnorrSigners({ chainId: accountParams.chainId })
  // const muSigTx = useMultiSigTx({ signers: schnorrSigners, opHash: operationHash })

  console.log("===> [TransferUserOperation] smartAccount", smartAccount)
  console.log("===> [TransferUserOperation] nextNonce", nonce)
  console.log("===> [TransferUserOperation] musigtx", muSigTx)

  const handleSingleSign = async (signer: SchnorrSigner) => {
    console.log("[musigtx] handle single sign ====>>>>", signer.getAddress(), { signer })
    console.log("[musigtx] handle musig tx ====>>>>", muSigTx)

    if (operationHash && muSigTx && signer) {
      const _sig = muSigTx.singleSignHash(signer)
      console.log("[musigtx] handle sign sig ====>>>>", _sig)
    }
  }

  const handleGenerateOpHash = async () => {
    console.log("===> [TransferUserOperation] accountSigner", accountSigner)
    if (accountSigner) {
      const _am = parseEther(amount)
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
      const uoStruct = await provider.buildUserOperation({
        target: toAddress as Hex,
        value: _am,
        data: "0x",
      })
      const request = deepHexlify(uoStruct)
      const operationHash = getUserOperationHash(
        request,
        provider.getEntryPointAddress(),
        BigInt(await accountSigner.getChainId())
      )
      setOpRequest(request)
      setOperationHash(operationHash)

      if (!muSigTx) {
        const ms = new MultiSigSchnorrTx(schnorrSigners, operationHash)
        setMuSigTx(ms)
      }
      muSigTx?.setOpHash(operationHash)
      console.log("===> [TransferUserOperation] OP HASH", operationHash)
      console.log("===> [TransferUserOperation] muSig", { muSigTx })
      console.log("===> [TransferUserOperation] muSig combined", muSigTx?.combinedPubKey?.toHex())
    }
  }

  const handleTransfer = async () => {
    // const _provider = new AlchemyProvider({ apiKey: import.meta.env.VITE_MUMBAI_ALCHEMY_API_KEY, chain: polygonMumbai })
    // const _client = await getWalletClient({ chainId: accountParams.chainId })
    console.log("===> [TransferUserOperation] accountSigner", accountSigner)
    if (erc20 && decimals && accountSigner && muSigTx && opRequest) {
      const _am = parseEther(amount)

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

      console.log("===> [TransferUserOperation][musigtx] single sign done", { muSigTx })
      const sumSignature = muSigTx.getMultiSign()
      console.log("===> [TransferUserOperation][musigtx] sum sig", sumSignature)
      opRequest.signature = sumSignature as Hex
      console.log("===> [TransferUserOperation][musigtx] opRequest", { opRequest })
      // console.log("===> [TransferUserOperation] request", { request })
      const txHash = await provider.rpcClient.sendUserOperation(opRequest, provider.getEntryPointAddress())
      const tx = await provider.waitForUserOperationTransaction(txHash)

      console.log("===> [TransferUserOperation] userOperationTransaction", tx)
      setTxHash(tx)
      setAmount("0")
    }
  }

  //0xaFe354bA3E06F58793772D10d6f8765EeA766Cc4
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      {schnorrSigners.map((signer) => {
        return schnorrSigners.length > 0 ? (
          <button onClick={() => handleSingleSign(signer)}>SIGN with account {signer.getAddress()}</button>
        ) : (
          <h2>NO SIGNERS</h2>
        )
      })}
      <b>user operation: transfer to {toAddress}</b>
      <input value={amount} onChange={(e) => setAmount(String(e.target.value))} />
      <button onClick={handleGenerateOpHash}>GENERATE OP HASH</button>
      <b>operation hash {operationHash}</b>
      <button onClick={handleTransfer}>SEND USER OP</button>
      <b>user operation: transfer hash {txHash}</b>
    </div>
  )
}
