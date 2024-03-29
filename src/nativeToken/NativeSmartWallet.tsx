import { BalanceNativeSmartWallet } from "./BalanceNativeSmartWallet.tsx"
import { MultiSigSmartAccountParams } from "../aa/MultiSigSmartAccountParams.types.ts"

export const NativeSmartWallet: React.FC<MultiSigSmartAccountParams> = (accountParams) => {
  return (
    <div style={{ margin: "48px", padding: "12px", border: "1px solid black" }}>
      <h3 style={{ color: "yellow" }}>Native Token Smart Wallet</h3>
      <BalanceNativeSmartWallet {...accountParams} />
    </div>
  )
}
