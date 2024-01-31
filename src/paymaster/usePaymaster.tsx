import { useEffect, useState } from "react"
import { useEthersSigner } from "../aa/useEthersSigner.tsx"
import { ConnectionParams } from "../account-abstraction/MultiSigAccountAbstraction.types.ts"
import * as aams from "aams-test"

const { WhitelistPaymaster__factory } = aams.typechain

export function usePaymaster({ paymasterAddress, chainId }: { paymasterAddress: string } & ConnectionParams) {
  const [paymaster, setPaymaster] = useState<ReturnType<typeof WhitelistPaymaster__factory.connect>>()
  const signer = useEthersSigner({ chainId })

  useEffect(() => {
    if (signer) {
      const Paymaster = WhitelistPaymaster__factory.connect(paymasterAddress)
      setPaymaster(Paymaster)
    }
  }, [signer])

  return { paymaster }
}
