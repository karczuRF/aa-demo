import { ConnectionParams } from "../aa/MultiSigSmartAccountParams.types"

export type ERC20Params = ConnectionParams & { address: string; toAddress: string }
