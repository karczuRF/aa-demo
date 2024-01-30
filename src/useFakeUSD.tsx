import { useEthersSigner } from "./aa/useEthersSigner.tsx"
import { useEffect, useState } from "react"
import { typechain } from "./aams-contracts/index.ts"

export function useERC20({ address, chainId }: { address: string; chainId?: number }) {
  const [erc20, setERC20] = useState<typechain.IERC20>()
  const signer = useEthersSigner({ chainId })

  useEffect(() => {
    if (signer) {
      const erc20 = typechain.IERC20__factory.connect(address, signer)
      setERC20(erc20)
    }
  }, [signer])

  return { erc20 }
}
