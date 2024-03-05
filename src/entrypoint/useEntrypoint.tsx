import { useEffect, useState } from "react"
import { useEthersSigner } from "../aa/useEthersSigner.tsx"
import { ConnectionParams } from "../aa/MultiSigSmartAccountParams.types.ts"
import { ethers } from "ethers"
import { EntryPointAbi } from "@alchemy/aa-core"
import { EntryPoint } from "aa-schnorr-multisig/dist/typechain/index"

export function useEntrypoint({ entrypointAddress, chainId }: { entrypointAddress: string } & ConnectionParams) {
  const [entrypoint, setEntrypoint] = useState<EntryPoint>()
  const signer = useEthersSigner({ chainId })

  useEffect(() => {
    if (signer) {
      // const Entrypoint = typechain.EntryPoint__factory.connect(entrypointAddress)
      const _entrypoint = new ethers.Contract(entrypointAddress, EntryPointAbi, signer) as unknown as EntryPoint

      setEntrypoint(_entrypoint)
    }
  }, [signer])

  return { entrypoint }
}
