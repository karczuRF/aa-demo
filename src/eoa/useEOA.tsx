import { useEffect, useState } from "react"

import { useEthersSigner } from "../aa/useEthersSigner.tsx"
import { ConnectionParams } from "../account-abstraction/MultiSigAccountAbstraction.types.ts"

export const useEOA = ({ chainId }: ConnectionParams) => {
  const [eoaAddress, setEOAddress] = useState<string>("")

  const eoaSigner = useEthersSigner({ chainId })

  useEffect(() => {
    async function getEOAaddress() {
      if (eoaSigner) {
        const eoaAddress = await eoaSigner.getAddress()

        setEOAddress(eoaAddress)
      }
    }

    getEOAaddress()
  }, [eoaSigner])

  return { address: eoaAddress }
}
