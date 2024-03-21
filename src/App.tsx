import { configureChains, createConfig, WagmiConfig } from "wagmi"
import { polygonMumbai } from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { Connect } from "./Connect.tsx"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { ERC20 } from "./erc20/ERC20.tsx"
import { NativeWallet } from "./nativeToken/NativeWallet.tsx"
import { ExternalSmartAccount } from "./MultiSigAccount/ExternalSmartAccount.tsx"
import { Paymaster } from "./paymaster/Paymaster.tsx"
import { Tabs } from "./Tabs.tsx"
import { FAKE_ERC20_USDC_ADDRESS } from "../utils/const.ts"
import { SmartAccountFactory } from "./factory/SmartAccountFactory.tsx"

if (!import.meta.env.VITE_MUMBAI_ALCHEMY_API_KEY) throw new Error("missing ALCHEMY_API_KEY")

const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [alchemyProvider({ apiKey: import.meta.env.VITE_MUMBAI_ALCHEMY_API_KEY })]
)

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
    }),
  ],
  publicClient,
})

function App() {
  const chainId = polygonMumbai.id
  return (
    <WagmiConfig config={wagmiConfig}>
      <Connect />
      <div style={{ marginTop: "24px" }}>
        <Tabs
          tabs={[
            {
              id: "account",
              name: "Account",
              component: <NativeWallet />,
            },

            {
              id: "erc20",
              name: "ERC20",
              component: (
                <>
                  <ERC20 address={FAKE_ERC20_USDC_ADDRESS} chainId={chainId} />
                </>
              ),
            },
            {
              id: "paymaster",
              name: "Paymaster",
              component: <Paymaster chainId={chainId} />,
            },
            {
              id: "smart-account",
              name: "SmartAccount",
              component: <ExternalSmartAccount chainId={chainId} />,
            },
            {
              id: "factory",
              name: "Factory",
              component: <SmartAccountFactory chainId={chainId} />,
            },
          ]}
        />
      </div>
    </WagmiConfig>
  )
}

export default App
