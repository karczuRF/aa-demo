// import { getDefaultLightAccountFactoryAddress } from "@alchemy/aa-accounts"
// import { AlchemyProvider } from "@alchemy/aa-alchemy"
// import { LocalAccountSigner, type Hex, getChain } from "@alchemy/aa-core"
// import { Chain, polygonMumbai, sepolia } from "viem/chains"
// import { MultiSigAccountAbstraction } from "../account-abstraction/MultiSigAccountAbstraction"
// import { ENTRYPOINT_ADDRESS, MUSIG_ACCOUNT_FACTORY_ADDRESS } from "../../utils/const"
// import { useAccountOwner } from "./useAccountOwner"
// import { useEffect, useState } from "react"
// import { AccountSigner } from "@alchemy/aa-ethers"

// export function useMultiSigAccountProvider({
//   chainId,
//   externalAccountAddress,
// }: {
//   chainId: Chain["id"]
//   externalAccountAddress?: Hex
// }) {
//   const [accountProvider, setAccountProvider] = useState<AlchemyProvider | undefined>()
//   const owner = useAccountOwner({ chainId })
//   const chain = getChain(chainId)

//   useEffect(() => {
//     async function getAccountProvider() {
//       if (owner) {
//         const provider = new AlchemyProvider({
//           // get your Alchemy API key at https://dashboard.alchemy.com
//           apiKey: import.meta.env.VITE_MUMBAI_ALCHEMY_API_KEY,
//           chain,
//         }).connect((rpcClient) => {
//           const smartAccount = new MultiSigAccountAbstraction({
//             entryPointAddress: ENTRYPOINT_ADDRESS,
//             chain,
//             owner,
//             factoryAddress: MUSIG_ACCOUNT_FACTORY_ADDRESS,
//             rpcClient,
//             accountAddress: externalAccountAddress,
//           })

//           smartAccount.getDeploymentState().then((result: unknown) => {
//             console.log("[useAccountSigner] deployment state", result)
//           })
//           smartAccount.isAccountDeployed().then((deployed: unknown) => {
//             console.log("[useAccountSigner] deployed", deployed)
//           })

//           return smartAccount
//         })
//         setAccountProvider(provider)
//       }
//     }
//     getAccountProvider()
//   }, [chain, chainId, externalAccountAddress])

//   return accountProvider
// }
