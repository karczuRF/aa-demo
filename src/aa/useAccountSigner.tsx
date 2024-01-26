import { usePublicEthersProvider } from "./usePublicEthersProvider.tsx";
import { getChain } from "@alchemy/aa-core";
// import { withAlchemyGasFeeEstimator } from "@alchemy/aa-alchemy";
import { AccountSigner, EthersProviderAdapter } from "@alchemy/aa-ethers";
import { ethers, providers } from "ethers";
import { useAccountOwner } from "./useAccountOwner.tsx";
import { Chain, Hex } from "viem";
// import {WHITELIST_PAYMASTER} from "./constants.ts";
import { MultiOwnerSmartContractAccount } from "./account-abstraction/MultiOwnerSmartContractAccount.tsx";
import { useEffect, useState } from "react";

export function useAccountSigner({
  chainId,
  externalAccountAddress,
}: {
  chainId: Chain["id"];
  externalAccountAddress?: Hex;
}) {
  const [accountSigner, setAccountSigner] = useState<
    AccountSigner | undefined
  >();
  const owner = useAccountOwner({ chainId });
  const publicProvider = usePublicEthersProvider({ chainId });

  console.log(
    "[useAccountSigner] externalAccountAddress",
    externalAccountAddress
  );
  useEffect(() => {
    async function getAccountSigner() {
      if (publicProvider instanceof providers.JsonRpcProvider && owner) {
        const accountProvider = EthersProviderAdapter.fromEthersProvider(
          publicProvider,
          ENTRYPOINT_ADDRESS
        );
        //     .withPaymasterMiddleware({
        //     dummyPaymasterDataMiddleware: async () => { return { paymasterAndData: WHITELIST_PAYMASTER } },
        //     paymasterDataMiddleware: async () => { return { paymasterAndData: WHITELIST_PAYMASTER } },
        // })

        const accountSigner = accountProvider.connectToAccount((rpcClient) => {
          const smartAccount = new MultiOwnerSmartContractAccount({
            entryPointAddress: ENTRYPOINT_ADDRESS,
            chain: getChain(publicProvider.network.chainId),
            owner,
            factoryAddress: MULTI_OWNER_SMART_ACCOUNT_FACTORY_ADDRESS,
            rpcClient,
            accountAddress: externalAccountAddress,
          });

          smartAccount.getDeploymentState().then((result) => {
            console.log("[useAccountSigner] deployment state", result);
          });
          smartAccount.isAccountDeployed().then((deployed) => {
            console.log("[useAccountSigner] deployed", deployed);
          });

          return smartAccount;
        });
        accountSigner.withCustomMiddleware(async (userOperation) => {
          console.log("[custom middleware]");
          console.log("[custom middleware]", await userOperation.nonce);
          console.log(
            "[custom middleware]",
            ethers.utils.parseUnits("200", "gwei")
          );

          return Promise.resolve({
            ...userOperation,
            maxFeePerGas: Promise.resolve(
              ethers.utils.parseUnits("200", "gwei").toHexString()
            ),
            maxPriorityFeePerGas: Promise.resolve(
              ethers.utils.parseUnits("200", "gwei").toHexString()
            ),
          });
        });
        setAccountSigner(accountSigner);
      }
    }
    getAccountSigner();
  }, [publicProvider, owner, chainId, externalAccountAddress]);

  console.log("[useAccountSigner] accountSigner", accountSigner);
  return accountSigner;
}
