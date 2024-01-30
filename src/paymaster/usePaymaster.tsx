import { useEffect, useState } from "react"
import { useEthersSigner } from "../aa/useEthersSigner.tsx"
import { ConnectionParams } from "../account-abstraction/MultiSigAccountAbstraction.types.ts"
import { typechain } from "../aams-contracts/index.ts"

export function usePaymaster({ paymasterAddress, chainId }: { paymasterAddress: string } & ConnectionParams) {
  const [paymaster, setPaymaster] = useState<typechain.WhitelistPaymaster>()
  const signer = useEthersSigner({ chainId })

  useEffect(() => {
    if (signer) {
      const Paymaster = typechain.WhitelistPaymaster__factory.connect(paymasterAddress, signer)
      setPaymaster(Paymaster)
    }
  }, [signer])

  return { paymaster }
}
