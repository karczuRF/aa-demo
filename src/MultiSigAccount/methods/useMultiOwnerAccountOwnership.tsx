import { useEffect, useState } from "react"

import { useAccountSigner } from "../../aa/useAccountSigner.tsx"
import { useMultiOwnerSmartAccount } from "../useMultiOwnerSmartAccount.tsx"
import { MultiOwnersSmartAccountParams } from "../MultiOwnersSmartAccount.types.ts"
import { useEOA } from "../../eoa/useEOA.tsx"

export const useMultiOwnerAccountOwnership = (multiOwnersSmartAccountParams: MultiOwnersSmartAccountParams) => {
  const { externalAccountAddress, chainId } = multiOwnersSmartAccountParams
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [accountAddress, setAccountAddress] = useState<string>("")

  const accountSigner = useAccountSigner(multiOwnersSmartAccountParams)

  const { address: eoaAddress } = useEOA(multiOwnersSmartAccountParams)

  const { multiOwnerSmartAccount } = useMultiOwnerSmartAccount(multiOwnersSmartAccountParams)

  console.log("[useMultiOwnerAccountOwnership] multiOwnerSmartAccount", multiOwnerSmartAccount)
  console.log("[useMultiOwnerAccountOwnership] accountSigner", accountSigner)
  console.log("[useMultiOwnerAccountOwnership] eoaAddress", eoaAddress)

  useEffect(() => {
    async function checkOwner() {
      if (multiOwnerSmartAccount && accountSigner) {
        console.log("[useMultiOwnerAccountOwnership] accountSigner", accountSigner)
        const accountAddresss = await accountSigner.getAddress()
        setAccountAddress(accountAddresss)

        console.log("[useMultiOwnerAccountOwnership] accountAddress", accountAddresss)
        const ownerRole = await multiOwnerSmartAccount.OWNER_ROLE()
        const isAccountOwner = await multiOwnerSmartAccount.hasRole(ownerRole, accountAddresss)

        console.log("[useMultiOwnerAccountOwnership] accountAddress", accountAddress)
        setIsOwner(isAccountOwner)
      }
    }

    checkOwner()
  }, [
    accountSigner,
    multiOwnerSmartAccount,
    externalAccountAddress,
    chainId,
    setAccountAddress,
    setIsOwner,
    accountAddress,
  ])

  console.log("[useMultiOwnerAccountOwnership] accountAddress", accountAddress)
  return { isOwner, accountAddress }
}
