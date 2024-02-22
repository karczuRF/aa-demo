import { Chain, Hex } from "viem"

export type MultiSigSmartAccountParams = { externalAccountAddress?: Hex } & ConnectionParams

export type ConnectionParams = { chainId: Chain["id"] }
