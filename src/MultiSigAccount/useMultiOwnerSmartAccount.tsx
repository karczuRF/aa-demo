import { useEthersSigner } from "../aa/useEthersSigner.tsx"
import { useEffect, useState } from "react"
import { useAccountSigner } from "../aa/useAccountSigner.tsx"
import { MultiOwnersSmartAccountParams } from "./MultiOwnersSmartAccount.types.ts"
import { usePublicEthersProvider } from "../aa/usePublicEthersProvider.tsx"
import { MultiSigSmartAccount, MultiSigSmartAccount__factory } from "aams-test/dist/typechain/index"

export function useMultiOwnerSmartAccount(multiOwnersSmartAccountParams: MultiOwnersSmartAccountParams) {
  const { chainId } = multiOwnersSmartAccountParams

  const [multiOwnerSmartAccount, setMultiOwnerSmartAccount] = useState<MultiSigSmartAccount>()
  const [isAccountCreated, setIsAccountCreated] = useState<boolean>(false)
  const [nonce, setNonce] = useState<string | undefined>()

  const signer = useEthersSigner({ chainId })
  const provider = usePublicEthersProvider({ chainId })
  const accountSigner = useAccountSigner(multiOwnersSmartAccountParams)

  useEffect(() => {
    async function connectMultiOwnerSmartAccount() {
      const accountAddress = await accountSigner?.getAddress()
      console.log("[create contract useMultiOwnerSmartAccount] account address", accountAddress)
      if (accountSigner && accountAddress) {
        if (signer && accountAddress && provider) {
          const accountCode = await provider.getCode(accountAddress)
          console.log("[create contract] accountCode", accountCode)
          const isAccountCreated = accountCode.length > 2
          console.log("[create contract useMultiOwnerSmartAccount] isAccountCreated", isAccountCreated)
          setIsAccountCreated(isAccountCreated)
          if (isAccountCreated) {
            const _aaContract = MultiSigSmartAccount__factory.connect(accountAddress, accountSigner)

            const nonce = await _aaContract.getNonce()
            setNonce(nonce.toString())
            setMultiOwnerSmartAccount(_aaContract)
            console.log("[create contract useMultiOwnerSmartAccount] account set", { _aaContract })
          }
        }
      }
    }

    connectMultiOwnerSmartAccount()
  }, [accountSigner, chainId, setIsAccountCreated])

  return { multiOwnerSmartAccount, isAccountCreated, nonce }
}
