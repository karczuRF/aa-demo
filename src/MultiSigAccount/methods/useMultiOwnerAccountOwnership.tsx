import { useEffect, useState } from "react"

import { useAccountSigner } from "../../aa/useAccountSigner.tsx"
import { useMultiOwnerSmartAccount } from "../useMultiOwnerSmartAccount.tsx"
import { MultiSigSmartAccountParams } from "../MultiOwnersSmartAccount.types.ts"
import { useEOA } from "../../eoa/useEOA.tsx"

export const useMultiOwnerAccountOwnership = (multiOwnersSmartAccountParams: MultiSigSmartAccountParams) => {
  const { smartAccountAddress, chainId } = multiOwnersSmartAccountParams
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [isSigner, setIsSigner] = useState<boolean>(false)
  const [accountSignerAddress, setAccountSignerAddress] = useState<string>("")

  const accountSigner = useAccountSigner(multiOwnersSmartAccountParams)

  const { address: eoaAddress } = useEOA(multiOwnersSmartAccountParams)

  const { multiOwnerSmartAccount } = useMultiOwnerSmartAccount(multiOwnersSmartAccountParams)

  useEffect(() => {
    async function checkOwnerSigner() {
      if (multiOwnerSmartAccount && accountSigner) {
        const _signerAddress = await accountSigner.getAddress()
        setAccountSignerAddress(_signerAddress)

        const ownerRole = await multiOwnerSmartAccount.OWNER_ROLE()
        const isAccountOwner = await multiOwnerSmartAccount.hasRole(ownerRole, eoaAddress)
        setIsOwner(isAccountOwner)
      }
    }

    checkOwnerSigner()
  }, [accountSigner, multiOwnerSmartAccount, smartAccountAddress, chainId, setIsOwner, setIsSigner])

  return { isOwner, isSigner, accountSignerAddress, eoaAddress }
}
