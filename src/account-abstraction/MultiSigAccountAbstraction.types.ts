import { Chain, Hex } from "viem"
import { ERC20Params } from "./ERC20.types"

export type MultiOwnersSmartAccountParams = { externalAccountAddress?: Hex } & Omit<ERC20Params, "toAddress">

export type ConnectionParams = { chainId: Chain["id"] }
