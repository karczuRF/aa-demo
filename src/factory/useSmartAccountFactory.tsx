import { useEthersSigner } from "../aa/useEthersSigner.tsx"
import { useEffect, useState } from "react"
import { useAccountSigner } from "../aa/useAccountSigner.tsx"
import { SmartAccountFactoryParams } from "./SmartAccountFactory.types.ts"
import { MUSIG_ACCOUNT_FACTORY_ADDRESS } from "../../utils/const.ts"
import {
  MultiSigSmartAccountFactory,
  MultiSigSmartAccountFactory__factory,
} from "aa-schnorr-multisig/dist/typechain/index"

export function useSmartAccountFactory(smartAccountFactoryParams: SmartAccountFactoryParams) {
  const { chainId } = smartAccountFactoryParams
  const [smartAccountFactory, setSmartAccountFactory] = useState<MultiSigSmartAccountFactory>()
  const [isFactoryCreated, setIsFactoryCreated] = useState<boolean>()

  const signer = useEthersSigner({ chainId })
  const accountSigner = useAccountSigner(smartAccountFactoryParams)

  useEffect(() => {
    async function connectSmartAccountFactory() {
      if (signer) {
        console.log("banan useSmartAccountFactory isFactoryCreated", isFactoryCreated)
        if (!isFactoryCreated) {
          const _smartAccountFactory = MultiSigSmartAccountFactory__factory.connect(
            MUSIG_ACCOUNT_FACTORY_ADDRESS,
            signer
          )

          setIsFactoryCreated(true)
          if (_smartAccountFactory) setSmartAccountFactory(_smartAccountFactory)
          console.log("banan useSmartAccountFactory account set", { _smartAccountFactory })
        }
      }
    }

    connectSmartAccountFactory()
  }, [accountSigner, signer, chainId, setIsFactoryCreated])

  return { smartAccountFactory, isFactoryCreated }
}
