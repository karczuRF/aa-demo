import { useEthersSigner } from "../aa/useEthersSigner.tsx"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { ERC20_abi } from "../../utils/abi/index.ts"

export function useERC20({ address, chainId }: { address: string; chainId?: number }) {
  const [erc20, setERC20] = useState<any>()
  const [decimals, setDecimals] = useState<number>()
  const signer = useEthersSigner({ chainId })

  useEffect(() => {
    if (signer) {
      const erc20 = new ethers.Contract(address, ERC20_abi, signer)
      setERC20(erc20)
      setDecimals(6)
    }
  }, [signer])

  return { erc20, decimals }
}
