import { Chain } from "viem"

export type SmartAccountFactoryParams = ConnectionParams

export type ConnectionParams = { chainId: Chain["id"] }
