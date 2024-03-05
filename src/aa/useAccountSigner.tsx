import { getChain, getDefaultEntryPointAddress } from "@alchemy/aa-core"
import { AccountSigner, EthersProviderAdapter } from "@alchemy/aa-ethers"
import { useAccountOwner } from "./useAccountOwner.tsx"
import { Chain, Hex } from "viem"
import { useEffect, useState } from "react"
import { MUSIG_ACCOUNT_FACTORY_ADDRESS } from "../../utils/const.ts"
import { useAlchemyProvider } from "./useAlchemyProvider.ts"
import { utils } from "ethers"
import { useSchnorrSigners } from "./useSchnorrSigners.tsx"
import { MultiSigAccountAbstraction } from "aa-schnorr-multisig-sdk/dist/accountAbstraction/MultiSigAccountAbstraction"

export function useAccountSigner({
  chainId,
  externalAccountAddress,
  accountIndex,
}: {
  chainId: Chain["id"]
  externalAccountAddress?: Hex
  accountIndex?: number
}) {
  const [accountSigner, setAccountSigner] = useState<AccountSigner<MultiSigAccountAbstraction> | undefined>()
  const _signer = useSchnorrSigners({ chainId })[accountIndex ?? 0]
  const _ownerSchnorrAccount = useAccountOwner({ signer: _signer })
  const chain = getChain(chainId)

  /* Note: publicProvider can be also created from Ethers Provider */
  // const publicProvider = usePublicEthersProvider({ chainId }) as providers.JsonRpcProvider
  const alchemyProvider = useAlchemyProvider(chain)

  useEffect(() => {
    async function getAccountSigner() {
      if (alchemyProvider && _ownerSchnorrAccount && externalAccountAddress) {
        // console.log("===> [useAccountSigner] schnorr", { _ownerSchnorrAccount }, _ownerSchnorrAccount?.getAddress())
        const accountProvider = EthersProviderAdapter.fromEthersProvider(alchemyProvider)
        const combinedPubAddress: string[] = [
          "0x372A291A9cad69b0F5F231cf1885574e9De7fD33",
          "0x55a0a5Deb3AB0Eb280d34670EB27C5bbd54931FD",
          "0x5a50893a11d37bc12f0af0514883ff85dd224e20",
          "0xccec0a637cff7b18f7b53ca4b5fd7a13ebc438c7",
          "0x8507cccd2eb83b90b8ef92e7bdde6556b0508d7e",
        ]
        const accountSigner = accountProvider.connectToAccount((rpcClient) => {
          const smartAccount = new MultiSigAccountAbstraction({
            chain,
            accountAddress: externalAccountAddress,
            factoryAddress: MUSIG_ACCOUNT_FACTORY_ADDRESS,
            rpcClient,
            combinedPubKeys: combinedPubAddress,
            salt: utils.formatBytes32String("salt"),
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
  }, [alchemyProvider, _ownerSchnorrAccount, chainId, externalAccountAddress])

  console.log("===> [useAccountSigner] accountSigner", accountSigner)
  return accountSigner
}
