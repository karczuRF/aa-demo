import { useEthersSigner } from "../aa/useEthersSigner.tsx"
import { useEffect, useState } from "react"
import { useAccountSigner } from "../aa/useAccountSigner.tsx"
import { MultiOwnersSmartAccountParams } from "./MultiOwnersSmartAccount.types.ts"
import { usePublicEthersProvider } from "../aa/usePublicEthersProvider.tsx"
import * as aams from "aams-test"

const { typechain } = aams

export function useMultiOwnerSmartAccount(multiOwnersSmartAccountParams: MultiOwnersSmartAccountParams) {
  const { chainId, externalAccountAddress } = multiOwnersSmartAccountParams
  const [multiOwnerSmartAccount, setMultiOwnerSmartAccount] = useState<typechain.MultiSigSmartAccount>()
  const [isAccountCreated, setIsAccountCreated] = useState<boolean>(false)
  const [nonce, setNonce] = useState<string | undefined>()

  const signer = useEthersSigner({ chainId })
  const provider = usePublicEthersProvider({ chainId })
  const accountSigner = useAccountSigner(multiOwnersSmartAccountParams)

  useEffect(() => {
    async function connectMultiOwnerSmartAccount() {
      if (accountSigner) {
        const accountAddress = await accountSigner.getAddress()
        console.log("useMultiOwnerSmartAccount account address", accountAddress)
        if (signer && accountAddress && provider) {
          const accountCode = await provider.getCode(accountAddress)
          console.log("useMultiOwnerSmartAccount accountCode", accountCode)
          const isAccountCreated = accountCode.length > 2
          console.log("useMultiOwnerSmartAccount isAccountCreated", isAccountCreated)
          setIsAccountCreated(isAccountCreated)
          if (isAccountCreated) {
            const multiOwnerSmartAccount = typechain.MultiSigSmartAccount__factory.connect(accountAddress)

            const nonce = await multiOwnerSmartAccount.getNonce()
            setNonce(nonce.toString())
            setMultiOwnerSmartAccount(multiOwnerSmartAccount)
          }
        }
      }
    }

    connectMultiOwnerSmartAccount()
  }, [accountSigner, signer, setMultiOwnerSmartAccount, chainId, externalAccountAddress, setIsAccountCreated])

  return { multiOwnerSmartAccount, isAccountCreated, nonce }
}
