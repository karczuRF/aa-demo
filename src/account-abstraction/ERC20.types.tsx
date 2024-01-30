import { ConnectionParams } from "./MultiSigAccountAbstraction.types"

export type ERC20Params = ConnectionParams & { address: string; toAddress: string }
