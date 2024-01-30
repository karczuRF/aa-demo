import { BalanceNative } from "./BalanceNative.tsx"
import { TransferNative } from "./TransferNative.tsx"

export const NativeWallet = () => {
  return (
    <div style={{ margin: "48px", padding: "12px", border: "1px solid black" }}>
      <h3 style={{ color: "blue" }}>Native Wallet</h3>
      <BalanceNative />
      <TransferNative />
    </div>
  )
}
