import { useEffect, useState } from "react"
import { useEthersSigner } from "../aa/useEthersSigner.tsx"
import { ConnectionParams } from "../account-abstraction/MultiSigAccountAbstraction.types.ts"
import { EntryPoint, EntryPoint__factory } from "aams-test/src/typechain"

export function useEntrypoint({ entrypointAddress, chainId }: { entrypointAddress: string } & ConnectionParams) {
  const [entrypoint, setEntrypoint] = useState<EntryPoint>()
  const signer = useEthersSigner({ chainId })

  useEffect(() => {
    if (signer) {
      const Entrypoint = EntryPoint__factory.connect(entrypointAddress)
      setEntrypoint(Entrypoint)
    }
  }, [signer])

  return { entrypoint }
}
