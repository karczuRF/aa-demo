import * as aams from "aams-test"
import { useEthersSigner } from "./aa/useEthersSigner.tsx"
import { useEffect, useState } from "react"

console.log({ aams })
const typechain = aams.typechain

export function useERC20({ address, chainId }: { address: string; chainId?: number }) {
  const [erc20, setERC20] = useState<typechain.ERC20>()
  const signer = useEthersSigner({ chainId })

  useEffect(() => {
    if (signer) {
      const erc20 = typechain.ERC20__factory.connect(address)
      setERC20(erc20)
    }
  }, [signer])

  return { erc20 }
}
