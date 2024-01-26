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

const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
// const ENTRYPOINT_ADDRESS = '0x0F46c65C17AA6b4102046935F33301f0510B163A'

const MULTI_OWNER_SMART_ACCOUNT_FACTORY_ADDRESS =
  "0x982aD0e19583BFac7c45A49721354D60F72d0B9f";
// const SIMPLE_ACCOUNT_FACTORY_ADDRESS = '0x9211bad5c19650a95b2dec3a5339621db2edf9b3'
// const SIMPLE_ACCOUNT_FACTORY_ADDRESS = '0x8d4A2cAf0c05DDA674720DD40D6Bf31BeC70514D'
// const SIMPLE_ACCOUNT_FACTORY_ADDRESS = '0x9406Cc6185a346906296840746125a0E44976454'
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
