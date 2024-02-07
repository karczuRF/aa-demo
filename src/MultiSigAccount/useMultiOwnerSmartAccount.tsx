import { useEthersSigner } from "../aa/useEthersSigner.tsx"
import { useEffect, useState } from "react"
import { useAccountSigner } from "../aa/useAccountSigner.tsx"
import { MultiOwnersSmartAccountParams } from "./MultiOwnersSmartAccount.types.ts"
import { usePublicEthersProvider } from "../aa/usePublicEthersProvider.tsx"
import { ethers } from "ethers"
import { MultiSigSmartAccount_abi } from "aams-test/dist/abi/index"
import { MultiSigSmartAccount } from "aams-test/dist/typechain/index"

export function useMultiOwnerSmartAccount(multiOwnersSmartAccountParams: MultiOwnersSmartAccountParams) {
  const { chainId, externalAccountAddress } = multiOwnersSmartAccountParams

  const [multiOwnerSmartAccount, setMultiOwnerSmartAccount] = useState<MultiSigSmartAccount>()
  const [isAccountCreated, setIsAccountCreated] = useState<boolean>(false)
  const [nonce, setNonce] = useState<string | undefined>()

  const signer = useEthersSigner({ chainId })
  const provider = usePublicEthersProvider({ chainId })
  const accountSigner = useAccountSigner(multiOwnersSmartAccountParams)

  useEffect(() => {
    async function connectMultiOwnerSmartAccount() {
      if (accountSigner) {
        const accountAddress = await accountSigner.getAddress()
        console.log("banan useMultiOwnerSmartAccount account address", accountAddress)
        if (signer && accountAddress && provider) {
          const accountCode = await provider.getCode(accountAddress)
          console.log("useMultiOwnerSmartAccount accountCode", accountCode)
          const isAccountCreated = accountCode.length > 2
          console.log("banan useMultiOwnerSmartAccount isAccountCreated", isAccountCreated)
          setIsAccountCreated(isAccountCreated)
          if (isAccountCreated) {
            // const multiOwnerSmartAccount = MultiSigSmartAccount__factory.connect(accountAddress)
            const _smartAccount = new ethers.Contract(
              accountAddress,
              MultiSigSmartAccount_abi,
              signer
            ) as unknown as MultiSigSmartAccount

            const nonce = await _smartAccount.getNonce()
            setNonce(nonce.toString())
            setMultiOwnerSmartAccount(_smartAccount)
            console.log("banan useMultiOwnerSmartAccount account set", { _smartAccount })
          }
        }
      }
    }

    connectMultiOwnerSmartAccount()
  }, [accountSigner, signer, chainId, externalAccountAddress, setIsAccountCreated])

  return { multiOwnerSmartAccount, isAccountCreated, nonce }
}
