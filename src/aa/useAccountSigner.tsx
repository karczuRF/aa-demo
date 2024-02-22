import { getChain } from "@alchemy/aa-core"
// import { withAlchemyGasFeeEstimator } from "@alchemy/aa-alchemy";
import {
  AccountSigner,
  EthersProviderAdapter,
  convertEthersSignerToAccountSigner,
  convertWalletToAccountSigner,
} from "@alchemy/aa-ethers"
import { useAccountOwner } from "./useAccountOwner.tsx"
import { Chain, Hex } from "viem"
import { MultiSigAccountAbstraction } from "../account-abstraction/MultiSigAccountAbstraction.tsx"
import { useEffect, useState } from "react"
import { ENTRYPOINT_ADDRESS, MUSIG_ACCOUNT_FACTORY_ADDRESS } from "../../utils/const.ts"
import { useAlchemyProvider } from "./useAlchemyProvider.ts"
import { providers, utils } from "ethers"
import { useSchnorrSigners } from "./useSchnorrSigners.tsx"
import { usePublicEthersProvider } from "./usePublicEthersProvider.tsx"

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
  const [accountOwner, setAccountOwner] = useState<string | undefined>()
  const _signer = useSchnorrSigners({ chainId })[accountIndex ?? 0]
  const _ownerSchnorrAccount = useAccountOwner({ signer: _signer })
  const chain = getChain(chainId)
  // const publicProvider = usePublicEthersProvider({ chainId }) as providers.JsonRpcProvider
  const publicProvider = useAlchemyProvider(chain)
  // console.log("===> [useAccountSigner] externalAccountAddress", externalAccountAddress)
  useEffect(() => {
    async function getAccountSigner() {
      if (publicProvider && _ownerSchnorrAccount && externalAccountAddress) {
        // console.log("===> [useAccountSigner] schnorr", { _ownerSchnorrAccount }, _ownerSchnorrAccount?.getAddress())
        const accountProvider = EthersProviderAdapter.fromEthersProvider(publicProvider)

        const accountSigner = accountProvider.connectToAccount((rpcClient) => {
          const smartAccount = new MultiSigAccountAbstraction({
            entryPointAddress: ENTRYPOINT_ADDRESS,
            chain,
            accountAddress: externalAccountAddress,
            owner: _ownerSchnorrAccount,
            factoryAddress: MUSIG_ACCOUNT_FACTORY_ADDRESS,
            rpcClient,
            combinedPubKeys: [
              "0x372A291A9cad69b0F5F231cf1885574e9De7fD33",
              "0x55a0a5Deb3AB0Eb280d34670EB27C5bbd54931FD",
              "0x5a50893a11d37bc12f0af0514883ff85dd224e20",
              "0xccec0a637cff7b18f7b53ca4b5fd7a13ebc438c7",
              "0x8507cccd2eb83b90b8ef92e7bdde6556b0508d7e",
            ],
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
        // accountSigner.withCustomMiddleware(async (userOperation) => {
        //   return Promise.resolve({
        //     ...userOperation,
        //     verificationGasLimit: Promise.resolve(2000000),
        //     // maxFeePerGas: Promise.resolve(utils.parseUnits("200", "gwei").toHexString() as Hex),
        //     // maxPriorityFeePerGas: Promise.resolve(utils.parseUnits("200", "gwei").toHexString() as Hex),
        //   })
        // })
        // console.log(
        //   "===> [useAccountSigner] accountSigner smart account",
        //   { accountSigner },
        //   await accountSigner.getAddress()
        // )
        setAccountSigner(accountSigner)
        setAccountOwner(await _ownerSchnorrAccount.getAddress())
      }
    }
    getAccountSigner()
  }, [publicProvider, _ownerSchnorrAccount, chainId, externalAccountAddress])

  // console.log("===> [useAccountSigner] accountSigner owner", accountOwner)
  console.log("===> [useAccountSigner] accountSigner", accountSigner)
  return accountSigner
}
