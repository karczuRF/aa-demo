import { Chain, Hex } from "viem"

export type MultiOwnersSmartAccountParams = { externalAccountAddress?: Hex } & ConnectionParams

export type ConnectionParams = { chainId: Chain["id"] }
