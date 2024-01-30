import { useEffect, useState } from "react"
import { useEthersSigner } from "../aa/useEthersSigner.tsx"
import { typechain } from "../aams-contracts"
import { ConnectionParams } from "../account-abstraction/MultiSigAccountAbstraction.types.ts"

export function useEntrypoint({ entrypointAddress, chainId }: { entrypointAddress: string } & ConnectionParams) {
  const [entrypoint, setEntrypoint] = useState<typechain.EntryPoint>()
  const signer = useEthersSigner({ chainId })

  useEffect(() => {
    if (signer) {
      const Entrypoint = typechain.EntryPoint__factory.connect(entrypointAddress, signer)
      setEntrypoint(Entrypoint)
    }
  }, [signer])

  return { entrypoint }
}
