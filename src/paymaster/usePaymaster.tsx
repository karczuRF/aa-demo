import { useEffect, useState } from "react"
import { useEthersSigner } from "../aa/useEthersSigner.tsx"
import { ConnectionParams } from "../account-abstraction/MultiSigAccountAbstraction.types.ts"
import { WhitelistPaymaster, WhitelistPaymaster__factory } from "aams-test/src/typechain/index.ts"

export function usePaymaster({ paymasterAddress, chainId }: { paymasterAddress: string } & ConnectionParams) {
  const [paymaster, setPaymaster] = useState<WhitelistPaymaster>()
  const signer = useEthersSigner({ chainId })

  useEffect(() => {
    if (signer) {
      const Paymaster = WhitelistPaymaster__factory.connect(paymasterAddress)
      setPaymaster(Paymaster)
    }
  }, [signer])

  return { paymaster }
}
