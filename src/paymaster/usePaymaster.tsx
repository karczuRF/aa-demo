import { useEffect, useState } from "react"
import { useEthersSigner } from "../aa/useEthersSigner.tsx"
import { ConnectionParams } from "../account-abstraction/MultiSigAccountAbstraction.types.ts"

import { Contract, ethers } from "ethers"
import { WhitelistPaymaster_abi } from "aams-test/dist/abi/index"
import { WhitelistPaymaster } from "aams-test/dist/typechain/index"

export function usePaymaster({ paymasterAddress, chainId }: { paymasterAddress: string } & ConnectionParams) {
  const [paymaster, setPaymaster] = useState<WhitelistPaymaster>()
  const signer = useEthersSigner({ chainId })

  useEffect(() => {
    if (signer) {
      const _paymaster = new ethers.Contract(
        paymasterAddress,
        WhitelistPaymaster_abi,
        signer
      ) as unknown as WhitelistPaymaster
      // const Paymaster = WhitelistPaymaster__factory.connect(paymasterAddress)
      setPaymaster(_paymaster)
    }
  }, [signer])

  return { paymaster }
}
