import { useEffect, useState } from "react"

import { Alchemy, Network, AlchemyProvider } from "alchemy-sdk"
import { Chain } from "viem/chains"

export function useAlchemyProvider(chain: Chain) {
  const [provider, setProvider] = useState<AlchemyProvider>()

  useEffect(() => {
    async function getAlchemyProvider() {
      const alchemy = new Alchemy({
        apiKey: import.meta.env.VITE_MUMBAI_ALCHEMY_API_KEY,
        network: Network.MATIC_MUMBAI,
      })
      const _provider = await alchemy.config.getProvider()
      setProvider(_provider)
    }

    getAlchemyProvider()
  }, [chain])

  return provider
}
