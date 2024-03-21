import { Chain, Hex } from "viem"

export type MultiSigSmartAccountParams = { smartAccountAddress?: Hex } & ConnectionParams

export type ConnectionParams = { chainId: Chain["id"] }
