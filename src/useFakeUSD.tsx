import { useEthersSigner } from "./aa/useEthersSigner.tsx"
import { useEffect, useState } from "react"
import { ERC20, ERC20__factory } from "aams-test/dist/typechain/index"

// console.log({ aams })
// const typechain = aams.typechain

export function useERC20({ address, chainId }: { address: string; chainId?: number }) {
  const [erc20, setERC20] = useState<ERC20>()
  const signer = useEthersSigner({ chainId })

  useEffect(() => {
    if (signer) {
      const erc20 = ERC20__factory.connect(address)
      setERC20(erc20)
    }
  }, [signer])

  return { erc20 }
}
