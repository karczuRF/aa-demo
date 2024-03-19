import { Chain, Hex } from "viem"

export type SmartAccountFactoryParams = { factoryAddress?: string } & ConnectionParams

export type ConnectionParams = { chainId: Chain["id"] }
