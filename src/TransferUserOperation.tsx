import React, { useState } from "react"
import { type TransactionRequest } from "@ethersproject/providers"

import { useERC20 } from "./useFakeUSD.tsx"
import { BigNumber, utils } from "ethers"

import { useAccountSigner } from "./aa/useAccountSigner.tsx"
import { useMultiOwnerSmartAccount } from "./MultiSigAccount/useMultiOwnerSmartAccount.tsx"
import { UserOperationsERC20Params } from "./UserOperationsERC20.types.ts"
import { Hex, parseEther, parseUnits } from "viem"
import { SMART_ACCOUNT_ADDRESS } from "../utils/const.ts"

export const TransferUserOperation: React.FC<UserOperationsERC20Params> = ({
  toAddress,
  address,
  ...accountParams
}) => {
  const [amount, setAmount] = useState<string>("0")
  const [txData, setTxData] = useState<string>("")
  const { erc20, decimals } = useERC20({ address, chainId: accountParams.chainId })
  // const accountSigner = useAccountOwner({ chainId: accountParams.chainId })
  // const _provider = useAlchemyProvider(_chain)
  const accountSigner = useAccountSigner({
    chainId: accountParams.chainId,
    externalAccountAddress: SMART_ACCOUNT_ADDRESS as Hex,
  })
  const { multiOwnerSmartAccount: smartAccount, nonce } = useMultiOwnerSmartAccount({
    chainId: accountParams.chainId,
  })

  console.log("===> [TransferUserOperation] smartAccount", smartAccount)
  console.log("===> [TransferUserOperation] nextNonce", nonce)

  const handleTransfer = async () => {
    // const _provider = new AlchemyProvider({ apiKey: import.meta.env.VITE_MUMBAI_ALCHEMY_API_KEY, chain: polygonMumbai })
    // const _client = await getWalletClient({ chainId: accountParams.chainId })
    console.log("===> [TransferUserOperation] fakeUSD", erc20)
    console.log("===> [TransferUserOperation] accountSigner", accountSigner)
    if (erc20 && decimals && accountSigner) {
      const _am = parseEther(amount)
      // const amountBN = BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals)).toBigInt()

      // const transferData = erc20.interface.encodeFunctionData("transferFrom", [EOA, toAddress, amountBN]) as Hex
      //   const userOperationStruct: TransactionRequest = {
      //     data: transferData as Hex,
      //     to: FAKE_USD_ADDRESS,
      //     value: amountBN,
      //   }

      // const uoCallData: UserOperationCallData = encodeFunctionData({
      //   abi: FakeUSD_abi,
      //   args: [toAddress, _am],
      //   functionName: "mintTo",
      // })
      // const signature = await accountSigner.signMessage(uoCallData)
      // console.log("===> [TransferUserOperation] siiiiiiiiiigned =>>>>", signature)

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

      const uo = await aaSignerWithMiddle.sendUserOperation({
        target: toAddress as Hex,
        value: _am,
        data: "0x",
      })

      const txHash = await accountSigner.waitForUserOperationTransaction(uo.hash)

      console.log("===> [TransferUserOperation] userOperationTransaction", txHash)
      setTxData(txHash)
      setAmount("0")
    }
  }

  //0xaFe354bA3E06F58793772D10d6f8765EeA766Cc4
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>user operation: transfer to {toAddress}</b>
      <input value={amount} onChange={(e) => setAmount(String(e.target.value))} />
      <button onClick={handleTransfer}>SEND USER OP</button>
      <b>user operation: transfer hash {txData}</b>
    </div>
  )
}
