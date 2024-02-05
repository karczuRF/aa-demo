import { useEffect, useState } from "react"

import { useAccountSigner } from "../../aa/useAccountSigner.tsx"
import { useMultiOwnerSmartAccount } from "../useMultiOwnerSmartAccount.tsx"
import { MultiOwnersSmartAccountParams } from "../MultiOwnersSmartAccount.types.ts"
import { useEOA } from "../../eoa/useEOA.tsx"

export const useMultiOwnerAccountOwnership = (multiOwnersSmartAccountParams: MultiOwnersSmartAccountParams) => {
  const { externalAccountAddress, chainId } = multiOwnersSmartAccountParams
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [isSigner, setIsSigner] = useState<boolean>(false)
  const [accountSignerAddress, setAccountSignerAddress] = useState<string>("")

  const accountSigner = useAccountSigner(multiOwnersSmartAccountParams)

  const { address: eoaAddress } = useEOA(multiOwnersSmartAccountParams)

  const { multiOwnerSmartAccount } = useMultiOwnerSmartAccount(multiOwnersSmartAccountParams)

  console.log("[useMultiOwnerAccountOwnership] multiOwnerSmartAccount params", { multiOwnersSmartAccountParams })
  console.log("[useMultiOwnerAccountOwnership] multiOwnerSmartAccount", multiOwnerSmartAccount)
  console.log("[useMultiOwnerAccountOwnership] accountSigner", accountSigner)
  console.log("[useMultiOwnerAccountOwnership] eoaAddress", eoaAddress)

  useEffect(() => {
    async function checkOwnerSigner() {
      if (multiOwnerSmartAccount && accountSigner) {
        console.log("[useMultiOwnerAccountOwnership] accountSigner", accountSigner)
        const _signerAddress = await accountSigner.getAddress()
        setAccountSignerAddress(_signerAddress)

        console.log("[useMultiOwnerAccountOwnership] accountAddress", _signerAddress)
        const ownerRole = await multiOwnerSmartAccount.OWNER_ROLE()
        const isAccountOwner = await multiOwnerSmartAccount.hasRole(ownerRole, eoaAddress)
        console.log("[useMultiOwnerAccountOwnership] accountAddress", _signerAddress)
        setIsOwner(isAccountOwner)

        const signerRole = await multiOwnerSmartAccount.SIGNER_ROLE()
        const isAccountSigner = await multiOwnerSmartAccount.hasRole(signerRole, eoaAddress)
        console.log("[useMultiOwnerAccountOwnership] accountAddress", _signerAddress)
        setIsSigner(isAccountSigner)
      }
    }

    checkOwnerSigner()
  }, [accountSigner, multiOwnerSmartAccount, externalAccountAddress, chainId, setIsOwner, setIsSigner])

  return { isOwner, isSigner, accountSignerAddress, eoaAddress }
}
