import { Chain, Hex } from "viem"

export type SmartAccountFactoryParams = { factoryAddress?: Hex } & ConnectionParams

export type ConnectionParams = { chainId: Chain["id"] }
