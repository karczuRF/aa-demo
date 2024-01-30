import { ConnectionParams } from "./account-abstraction/MultiSigAccountAbstraction.types"

export type ERC20Params = ConnectionParams & { address: string; toAddress: string }
