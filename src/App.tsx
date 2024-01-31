import { configureChains, createConfig, WagmiConfig } from "wagmi"
import { polygonMumbai } from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { Connect } from "./Connect.tsx"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { ERC20 } from "./ERC20.tsx"
import { NativeWallet } from "./NativeWallet.tsx"
import { ExternalSmartAccount } from "./MultiSigAccount/ExternalSmartAccount.tsx"
import { Paymaster } from "./Paymaster.tsx"
import { Tabs } from "./Tabs.tsx"
import { FAKE_FAKE_USD_ADDRESS, FAKE_USD_ADDRESS } from "../utils/const.ts"

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
                  <ERC20 address={FAKE_USD_ADDRESS} chainId={chainId} />
                  <ERC20 address={FAKE_FAKE_USD_ADDRESS} chainId={chainId} />
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
          ]}
        />
      </div>
    </WagmiConfig>
  )
}

export default App
