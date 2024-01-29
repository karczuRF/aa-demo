import { FallbackTransport, Transport, isHex } from "viem"

import { Address } from "abitype/zod"
import z from "zod"
import {
  BaseSmartAccountParams,
  ChainSchema,
  SmartAccountSigner,
  SupportedTransports,
  createPublicErc4337ClientSchema,
  isSigner,
} from "@alchemy/aa-core"

import type { Address as AddressType } from "abitype"

export const createBaseSmartAccountParamsSchema = <
  TTransport extends SupportedTransports = Transport,
  TOwner extends SmartAccountSigner | undefined = SmartAccountSigner | undefined
>() =>
  z.object({
    rpcClient: z.union([z.string(), createPublicErc4337ClientSchema<TTransport>()]),
    factoryAddress: Address,
    owner: z.custom<TOwner>((owner) => (owner ? isSigner(owner) : undefined)).optional(),
    entryPointAddress: Address.optional(),
    chain: ChainSchema,
    accountAddress: Address.optional().describe("Optional override for the account address."),
    initCode: z
      .string()
      .refine(isHex, "initCode must be a valid hex.")
      .optional()
      .describe("Optional override for the account init code."),
  })

export const MultiSigAccountAbstractionParamsSchema = <
  TTransport extends SupportedTransports = Transport,
  TOwner extends SmartAccountSigner = SmartAccountSigner
>() =>
  createBaseSmartAccountParamsSchema<TTransport, TOwner>().extend({
    owner: z.custom<TOwner>(isSigner),
    index: z.bigint().optional(),
  })

export type MultiSigAccountAbstractionParamsType<
  TTransport extends SupportedTransports = Transport,
  TOwner extends SmartAccountSigner = SmartAccountSigner
> = z.input<ReturnType<typeof MultiSigAccountAbstractionParamsSchema<TTransport, TOwner>>>

export interface MultiSigAccountAbstractionParams<TTransport extends Transport | FallbackTransport = Transport>
  extends BaseSmartAccountParams<TTransport> {
  owner: SmartAccountSigner
  factoryAddress: AddressType
  index?: bigint
}
