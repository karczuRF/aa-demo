import { useEffect, useState } from "react"
import { useEthersSigner } from "../aa/useEthersSigner.tsx"
import { ConnectionParams } from "../account-abstraction/MultiSigAccountAbstraction.types.ts"
import { typechain } from "aams-test"

export function useEntrypoint({ entrypointAddress, chainId }: { entrypointAddress: string } & ConnectionParams) {
  const [entrypoint, setEntrypoint] = useState<typechain.EntryPoint>()
  const signer = useEthersSigner({ chainId })

  useEffect(() => {
    if (signer) {
      const Entrypoint = typechain.EntryPoint__factory.connect(entrypointAddress)
      setEntrypoint(Entrypoint)
    }
  }, [signer])

  return { entrypoint }
}
