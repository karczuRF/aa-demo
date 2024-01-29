import type { Address } from "abitype"
import { concatHex, encodeFunctionData, hexToBytes, type Hex, FallbackTransport, Transport } from "viem"

import { BaseSmartContractAccount, BatchUserOperationCallData, SmartAccountSigner } from "@alchemy/aa-core"

import { abi } from "../aams-contracts"
import { MultiSigAccountAbstractionParams, MultiSigAccountAbstractionParamsSchema } from "./schema"

export class MultiSigAccountAbstraction<
  TTransport extends Transport | FallbackTransport = Transport
> extends BaseSmartContractAccount<TTransport> {
  protected owner: SmartAccountSigner
  protected factoryAddress: Address
  protected index: bigint

  constructor(params: MultiSigAccountAbstractionParams<TTransport>) {
    MultiSigAccountAbstractionParamsSchema<TTransport>().parse(params)

    super(params)
    this.index = params.index ?? 0n
    this.owner = params.owner
    this.factoryAddress = params.factoryAddress
  }

  getDummySignature(): `0x${string}` {
    return "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c"
  }

  async encodeExecute(target: Hex, value: bigint, data: Hex): Promise<`0x${string}`> {
    return encodeFunctionData({
      abi: abi.MultiSigSmartAccount_abi,
      functionName: "execute",
      args: [target, value, data],
    })
  }

  override async encodeBatchExecute(_txs: BatchUserOperationCallData): Promise<`0x${string}`> {
    const [targets, datas] = _txs.reduce(
      (accum, curr) => {
        accum[0].push(curr.target)
        accum[1].push(curr.data)

        return accum
      },
      [[], []] as [Address[], Hex[]]
    )

    return encodeFunctionData({
      abi: abi.MultiSigSmartAccount_abi,
      functionName: "executeBatch",
      args: [targets, datas],
    })
  }

  signMessage(msg: Uint8Array | string): Promise<`0x${string}`> {
    if (typeof msg === "string" && msg.startsWith("0x")) {
      msg = hexToBytes(msg as Hex)
    } else if (typeof msg === "string") {
      msg = new TextEncoder().encode(msg)
    }

    return this.owner.signMessage(msg)
  }

  protected async getAccountInitCode(): Promise<`0x${string}`> {
    return concatHex([
      this.factoryAddress,
      encodeFunctionData({
        abi: abi.MultiSigSmartAccountFactory_abi,
        functionName: "createAccount",
        args: [await this.owner.getAddress(), this.index],
      }),
    ])
  }
}
