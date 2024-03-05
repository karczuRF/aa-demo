import { useEffect, useState } from "react"
import { useEthersSigner } from "../aa/useEthersSigner.tsx"
import { ConnectionParams } from "../aa/MultiSigSmartAccountParams.types.ts"

import { Contract, ethers } from "ethers"

export function usePaymaster({ paymasterAddress, chainId }: { paymasterAddress: string } & ConnectionParams) {
  const [paymaster, setPaymaster] = useState<any>()
  const signer = useEthersSigner({ chainId })

  useEffect(() => {
    if (signer) {
      // const _paymaster = new ethers.Contract(
      //   paymasterAddress,
      //   WhitelistPaymaster_abi,
      //   signer
      // ) as unknown as WhitelistPaymaster
      // const Paymaster = WhitelistPaymaster__factory.connect(paymasterAddress)
      setPaymaster(undefined)
    }
  }, [signer])

  return { paymaster }
}
