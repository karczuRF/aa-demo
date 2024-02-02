import { useEthersSigner } from "../aa/useEthersSigner.tsx"
import { useEffect, useState } from "react"
import { useAccountSigner } from "../aa/useAccountSigner.tsx"
import { MultiSigSmartAccountFactory } from "aams-test/dist/typechain/index"
import { ethers } from "ethers"
import { MultiSigSmartAccountFactory_abi } from "aams-test/dist/abi/index"
import { SmartAccountFactoryParams } from "./SmartAccountFactory.types.ts"
import { MUSIG_ACCOUNT_FACTORY_ADDRESS } from "../../utils/const.ts"

export function useSmartAccountFactory(smartAccountFactoryParams: SmartAccountFactoryParams) {
  const { chainId, factoryAddress } = smartAccountFactoryParams
  const [smartAccountFactory, setSmartAccountFactory] = useState<MultiSigSmartAccountFactory>()
  const [isFactoryCreated, setIsFactoryCreated] = useState<boolean>()

  const signer = useEthersSigner({ chainId })
  const accountSigner = useAccountSigner(smartAccountFactoryParams)

  useEffect(() => {
    async function connectSmartAccountFactory() {
      if (signer) {
        console.log("banan useSmartAccountFactory isFactoryCreated", isFactoryCreated)
        if (!isFactoryCreated) {
          // const smartAccountFactory = MultiSigSmartAccount__factory.connect(accountAddress)
          const _smartAccountFactory = new ethers.Contract(
            factoryAddress ?? MUSIG_ACCOUNT_FACTORY_ADDRESS,
            MultiSigSmartAccountFactory_abi,
            signer
          ) as unknown as MultiSigSmartAccountFactory

          setIsFactoryCreated(true)
          setSmartAccountFactory(_smartAccountFactory)
          console.log("banan useSmartAccountFactory account set", { _smartAccountFactory })
        }
      }
    }

    connectSmartAccountFactory()
  }, [accountSigner, signer, chainId, setIsFactoryCreated])

  return { smartAccountFactory, isFactoryCreated }
}
