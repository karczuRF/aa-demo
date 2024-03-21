import { getChain } from "@alchemy/aa-core"
import { AccountSigner, EthersProviderAdapter } from "@alchemy/aa-ethers"
import { Chain, Hex } from "viem"
import { useEffect, useState } from "react"
import { MUSIG_ACCOUNT_FACTORY_ADDRESS } from "../../utils/const.ts"
import { useAlchemyProvider } from "./useAlchemyProvider.ts"
import { useSchnorrSigners } from "./useSchnorrSigners.tsx"
import { MultiSigAccountAbstraction } from "aa-schnorr-multisig-sdk/dist/accountAbstraction/MultiSigAccountAbstraction"
import { getAllCombinedAddrFromSigners } from "aa-schnorr-multisig-sdk/dist/helpers/schnorr-helpers"

export function useAccountSigner({
  chainId,
  smartAccountAddress,
  salt,
}: {
  chainId: Chain["id"]
  smartAccountAddress?: Hex
  salt?: string
}) {
  const [accountSigner, setAccountSigner] = useState<AccountSigner<MultiSigAccountAbstraction> | undefined>()
  const _signers = useSchnorrSigners({ chainId })
  const chain = getChain(chainId)

  /* Note: publicProvider can be also created from Ethers Provider */
  // const publicProvider = usePublicEthersProvider({ chainId }) as providers.JsonRpcProvider
  const alchemyProvider = useAlchemyProvider(chain)

  useEffect(() => {
    async function getAccountSigner() {
      if (alchemyProvider && smartAccountAddress) {
        const accountProvider = EthersProviderAdapter.fromEthersProvider(alchemyProvider)

        const combinedAddresses = getAllCombinedAddrFromSigners(_signers, 1)
        const accountSigner = accountProvider.connectToAccount((rpcClient) => {
          const smartAccount = new MultiSigAccountAbstraction({
            chain,
            accountAddress: smartAccountAddress,
            factoryAddress: MUSIG_ACCOUNT_FACTORY_ADDRESS,
            rpcClient,
            combinedAddress: combinedAddresses,
            salt,
          })

          smartAccount.getDeploymentState().then((result: unknown) => {
            console.log("===> [useAccountSigner] deployment state", result)
          })
          smartAccount.isAccountDeployed().then((deployed: unknown) => {
            console.log("===> [useAccountSigner] deployed", deployed)
          })

          return smartAccount
        })

        setAccountSigner(accountSigner)
      }
    }
    getAccountSigner()
  }, [alchemyProvider, chainId, smartAccountAddress])

  console.log("===> [useAccountSigner] accountSigner", accountSigner)
  return accountSigner
}
