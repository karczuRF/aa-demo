import { usePublicEthersProvider } from "./usePublicEthersProvider"
import { SmartAccountSigner, getChain } from "@alchemy/aa-core"
// import { withAlchemyGasFeeEstimator } from "@alchemy/aa-alchemy";
import { AccountSigner, EthersProviderAdapter } from "@alchemy/aa-ethers"
import { ethers, providers } from "ethers"
import { useAccountOwner } from "./useAccountOwner.tsx"
import { Chain, Hex } from "viem"
// import {WHITELIST_PAYMASTER} from "./constants.ts";
import { MultiSigAccountAbstraction } from "../account-abstraction/MultiSigAccountAbstraction.tsx"
import { useEffect, useState } from "react"
import { ENTRYPOINT_ADDRESS, MUSIG_ACCOUNT_FACTORY_ADDRESS } from "../../utils/const.ts"
import { getSchnorrSigner } from "./getSchnorrSigner.ts"

export function useAccountSigner({
  chainId,
  externalAccountAddress,
}: {
  chainId: Chain["id"]
  externalAccountAddress?: Hex
}) {
  const [accountSigner, setAccountSigner] = useState<AccountSigner<MultiSigAccountAbstraction> | undefined>()
  const [accountOwner, setAccountOwner] = useState<string | undefined>()
  const _schnorrSigner = getSchnorrSigner()
  const publicProvider = usePublicEthersProvider({ chainId })

  console.log("[useAccountSigner] externalAccountAddress", externalAccountAddress)
  useEffect(() => {
    async function getAccountSigner() {
      if (publicProvider instanceof providers.JsonRpcProvider) {
        const accountProvider = EthersProviderAdapter.fromEthersProvider(publicProvider)
        //     .withPaymasterMiddleware({
        //     dummyPaymasterDataMiddleware: async () => { return { paymasterAndData: WHITELIST_PAYMASTER } },
        //     paymasterDataMiddleware: async () => { return { paymasterAndData: WHITELIST_PAYMASTER } },
        // })

        const accountSigner = accountProvider.connectToAccount((rpcClient) => {
          const smartAccount = new MultiSigAccountAbstraction({
            entryPointAddress: ENTRYPOINT_ADDRESS,
            chain: getChain(publicProvider.network.chainId),
            owner: _schnorrSigner,
            factoryAddress: MUSIG_ACCOUNT_FACTORY_ADDRESS,
            rpcClient,
            accountAddress: externalAccountAddress,
          })

          smartAccount.getDeploymentState().then((result: unknown) => {
            console.log("[useAccountSigner] deployment state", result)
          })
          smartAccount.isAccountDeployed().then((deployed: unknown) => {
            console.log("[useAccountSigner] deployed", deployed)
          })

          return smartAccount
        })
        // accountSigner.withCustomMiddleware(async (userOperation) => {
        //   console.log("[custom middleware]")
        //   console.log("[custom middleware]", await userOperation.nonce)
        //   console.log("[custom middleware]", ethers.utils.parseUnits("200", "gwei"))

        //   return Promise.resolve({
        //     ...userOperation,
        //     maxFeePerGas: Promise.resolve(ethers.utils.parseUnits("200", "gwei").toHexString()),
        //     maxPriorityFeePerGas: Promise.resolve(ethers.utils.parseUnits("200", "gwei").toHexString()),
        //   })
        // })
        setAccountSigner(accountSigner)
        setAccountOwner(await _schnorrSigner.getAddress())
      }
    }
    getAccountSigner()
  }, [publicProvider, _schnorrSigner, chainId, externalAccountAddress])

  console.log("[useAccountSigner] accountSigner owner", accountOwner)
  console.log("[useAccountSigner] accountSigner", accountSigner)
  return accountSigner
}
