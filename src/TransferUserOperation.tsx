import React, { useState } from "react"
import { type TransactionRequest } from "@ethersproject/providers"

import { useERC20 } from "./useFakeUSD.tsx"
import { BigNumber } from "ethers"

import { useAccountSigner } from "./aa/useAccountSigner.tsx"
import { useMultiOwnerSmartAccount } from "./MultiSigAccount/useMultiOwnerSmartAccount.tsx"
import { UserOperationsERC20Params } from "./UserOperationsERC20.types.ts"
import { FAKE_USD_ADDRESS } from "../utils/const.ts"
import { useEOA } from "./eoa/useEOA.tsx"
import { Hex, encodeFunctionData, parseUnits } from "viem"
import { ERC20_abi } from "aams-test/dist/abi/index"

import { UserOperationCallData } from "@alchemy/aa-core"

export const TransferUserOperation: React.FC<UserOperationsERC20Params> = ({
  toAddress,
  address: erc20Address,
  ...accountParams
}) => {
  const [amount, setAmount] = useState<string>("0")
  const [txData, setTxData] = useState<string>("")
  const { erc20, decimals } = useERC20({ address: erc20Address, chainId: accountParams.chainId })
  // const accountSigner = useAccountOwner({ chainId: accountParams.chainId })
  const accountSigner = useAccountSigner({ chainId: accountParams.chainId })
  const { address: EOA } = useEOA(accountParams)
  const { multiOwnerSmartAccount: smartAccount, nonce } = useMultiOwnerSmartAccount({
    address: erc20Address,
    ...accountParams,
  })

  console.log("[TransferUserOperation] smartAccount", smartAccount)
  console.log("[TransferUserOperation] nextNonce", nonce)

  const handleTransfer = async () => {
    // const _provider = new AlchemyProvider({ apiKey: import.meta.env.VITE_MUMBAI_ALCHEMY_API_KEY, chain: polygonMumbai })
    // const _client = await getWalletClient({ chainId: accountParams.chainId })
    console.log("[TransferUserOperation] fakeUSD", erc20)
    console.log("[TransferUserOperation] accountSigner", accountSigner)
    if (erc20 && decimals && accountSigner) {
      console.log("[TransferUserOperation] accountAddress", EOA, toAddress)

      const _am = parseUnits(amount, decimals)
      // const amountBN = BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals)).toBigInt()

      // const transferData = erc20.interface.encodeFunctionData("transferFrom", [EOA, toAddress, amountBN]) as Hex
      const uoCallData: UserOperationCallData = encodeFunctionData({
        abi: ERC20_abi,
        args: [toAddress, _am],
        functionName: "transfer",
      })
      //   const userOperationStruct: TransactionRequest = {
      //     data: transferData as Hex,
      //     to: FAKE_USD_ADDRESS,
      //     value: amountBN,
      //   }
      const signature = await accountSigner.signMessage(uoCallData)

      console.log("[TransferUserOperation] siiiiiiiiiigned =>>>>", signature)
      const uo = await accountSigner.sendUserOperation({
        data: uoCallData,
        target: toAddress as Hex,
      })

      const txHash = await accountSigner.waitForUserOperationTransaction(uo.hash)

      console.log("[TransferUserOperation] userOperationTransaction", txHash)
      setTxData(txHash)
      setAmount("0")
    }
  }

  //0xaFe354bA3E06F58793772D10d6f8765EeA766Cc4
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "24px 0 24px 0" }}>
      <b>user operation: transfer to {toAddress}</b>
      <input value={amount} onChange={(e) => setAmount(String(e.target.value))} />
      <button onClick={handleTransfer}>TRANSFER</button>
      <b>user operation: transfer hash {txData}</b>
    </div>
  )
}
