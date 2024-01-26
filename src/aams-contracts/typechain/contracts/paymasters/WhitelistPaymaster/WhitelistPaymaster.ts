/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export type UserOperationStruct = {
  sender: AddressLike;
  nonce: BigNumberish;
  initCode: BytesLike;
  callData: BytesLike;
  callGasLimit: BigNumberish;
  verificationGasLimit: BigNumberish;
  preVerificationGas: BigNumberish;
  maxFeePerGas: BigNumberish;
  maxPriorityFeePerGas: BigNumberish;
  paymasterAndData: BytesLike;
  signature: BytesLike;
};

export type UserOperationStructOutput = [
  sender: string,
  nonce: bigint,
  initCode: string,
  callData: string,
  callGasLimit: bigint,
  verificationGasLimit: bigint,
  preVerificationGas: bigint,
  maxFeePerGas: bigint,
  maxPriorityFeePerGas: bigint,
  paymasterAndData: string,
  signature: string
] & {
  sender: string;
  nonce: bigint;
  initCode: string;
  callData: string;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymasterAndData: string;
  signature: string;
};

export interface WhitelistPaymasterInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addStake"
      | "deposit"
      | "entryPoint"
      | "getDeposit"
      | "isWhitelistedSender"
      | "isWhitelistedTarget"
      | "owner"
      | "postOp"
      | "renounceOwnership"
      | "senderWhitelist"
      | "setEntryPoint"
      | "targetWhitelist"
      | "transferOwnership"
      | "unlockStake"
      | "validatePaymasterUserOp"
      | "whitelistSender"
      | "whitelistTarget"
      | "withdrawStake"
      | "withdrawTo"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Accepted"
      | "OwnershipTransferred"
      | "WhitelistedSenderAddressAdded"
      | "WhitelistedSenderAddressRemoved"
      | "WhitelistedTargetAddressAdded"
      | "WhitelistedTargetAddressRemoved"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "addStake",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "deposit", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "entryPoint",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getDeposit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isWhitelistedSender",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isWhitelistedTarget",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "postOp",
    values: [BigNumberish, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "senderWhitelist",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setEntryPoint",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "targetWhitelist",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "unlockStake",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "validatePaymasterUserOp",
    values: [UserOperationStruct, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "whitelistSender",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "whitelistTarget",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawStake",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawTo",
    values: [AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "addStake", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "entryPoint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getDeposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isWhitelistedSender",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isWhitelistedTarget",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "postOp", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "senderWhitelist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setEntryPoint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "targetWhitelist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unlockStake",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validatePaymasterUserOp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "whitelistSender",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "whitelistTarget",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawStake",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdrawTo", data: BytesLike): Result;
}

export namespace AcceptedEvent {
  export type InputTuple = [
    onBehlafOf: AddressLike,
    to: AddressLike,
    gas: BigNumberish
  ];
  export type OutputTuple = [onBehlafOf: string, to: string, gas: bigint];
  export interface OutputObject {
    onBehlafOf: string;
    to: string;
    gas: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WhitelistedSenderAddressAddedEvent {
  export type InputTuple = [addr: AddressLike];
  export type OutputTuple = [addr: string];
  export interface OutputObject {
    addr: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WhitelistedSenderAddressRemovedEvent {
  export type InputTuple = [addr: AddressLike];
  export type OutputTuple = [addr: string];
  export interface OutputObject {
    addr: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WhitelistedTargetAddressAddedEvent {
  export type InputTuple = [addr: AddressLike];
  export type OutputTuple = [addr: string];
  export interface OutputObject {
    addr: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WhitelistedTargetAddressRemovedEvent {
  export type InputTuple = [addr: AddressLike];
  export type OutputTuple = [addr: string];
  export interface OutputObject {
    addr: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface WhitelistPaymaster extends BaseContract {
  connect(runner?: ContractRunner | null): WhitelistPaymaster;
  waitForDeployment(): Promise<this>;

  interface: WhitelistPaymasterInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  addStake: TypedContractMethod<
    [unstakeDelaySec: BigNumberish],
    [void],
    "payable"
  >;

  deposit: TypedContractMethod<[], [void], "payable">;

  entryPoint: TypedContractMethod<[], [string], "view">;

  getDeposit: TypedContractMethod<[], [bigint], "view">;

  isWhitelistedSender: TypedContractMethod<
    [sender: AddressLike],
    [boolean],
    "view"
  >;

  isWhitelistedTarget: TypedContractMethod<
    [target: AddressLike],
    [boolean],
    "view"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  postOp: TypedContractMethod<
    [mode: BigNumberish, context: BytesLike, actualGasCost: BigNumberish],
    [void],
    "nonpayable"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  senderWhitelist: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  setEntryPoint: TypedContractMethod<
    [_entryPoint: AddressLike],
    [void],
    "nonpayable"
  >;

  targetWhitelist: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  unlockStake: TypedContractMethod<[], [void], "nonpayable">;

  validatePaymasterUserOp: TypedContractMethod<
    [
      userOp: UserOperationStruct,
      arg1: BytesLike,
      requiredPreFund: BigNumberish
    ],
    [[string, bigint] & { context: string; validationData: bigint }],
    "view"
  >;

  whitelistSender: TypedContractMethod<
    [sender: AddressLike],
    [void],
    "nonpayable"
  >;

  whitelistTarget: TypedContractMethod<
    [target: AddressLike],
    [void],
    "nonpayable"
  >;

  withdrawStake: TypedContractMethod<
    [withdrawAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  withdrawTo: TypedContractMethod<
    [withdrawAddress: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addStake"
  ): TypedContractMethod<[unstakeDelaySec: BigNumberish], [void], "payable">;
  getFunction(
    nameOrSignature: "deposit"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "entryPoint"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getDeposit"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "isWhitelistedSender"
  ): TypedContractMethod<[sender: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isWhitelistedTarget"
  ): TypedContractMethod<[target: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "postOp"
  ): TypedContractMethod<
    [mode: BigNumberish, context: BytesLike, actualGasCost: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "senderWhitelist"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "setEntryPoint"
  ): TypedContractMethod<[_entryPoint: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "targetWhitelist"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "unlockStake"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "validatePaymasterUserOp"
  ): TypedContractMethod<
    [
      userOp: UserOperationStruct,
      arg1: BytesLike,
      requiredPreFund: BigNumberish
    ],
    [[string, bigint] & { context: string; validationData: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "whitelistSender"
  ): TypedContractMethod<[sender: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "whitelistTarget"
  ): TypedContractMethod<[target: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawStake"
  ): TypedContractMethod<[withdrawAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawTo"
  ): TypedContractMethod<
    [withdrawAddress: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "Accepted"
  ): TypedContractEvent<
    AcceptedEvent.InputTuple,
    AcceptedEvent.OutputTuple,
    AcceptedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "WhitelistedSenderAddressAdded"
  ): TypedContractEvent<
    WhitelistedSenderAddressAddedEvent.InputTuple,
    WhitelistedSenderAddressAddedEvent.OutputTuple,
    WhitelistedSenderAddressAddedEvent.OutputObject
  >;
  getEvent(
    key: "WhitelistedSenderAddressRemoved"
  ): TypedContractEvent<
    WhitelistedSenderAddressRemovedEvent.InputTuple,
    WhitelistedSenderAddressRemovedEvent.OutputTuple,
    WhitelistedSenderAddressRemovedEvent.OutputObject
  >;
  getEvent(
    key: "WhitelistedTargetAddressAdded"
  ): TypedContractEvent<
    WhitelistedTargetAddressAddedEvent.InputTuple,
    WhitelistedTargetAddressAddedEvent.OutputTuple,
    WhitelistedTargetAddressAddedEvent.OutputObject
  >;
  getEvent(
    key: "WhitelistedTargetAddressRemoved"
  ): TypedContractEvent<
    WhitelistedTargetAddressRemovedEvent.InputTuple,
    WhitelistedTargetAddressRemovedEvent.OutputTuple,
    WhitelistedTargetAddressRemovedEvent.OutputObject
  >;

  filters: {
    "Accepted(address,address,uint256)": TypedContractEvent<
      AcceptedEvent.InputTuple,
      AcceptedEvent.OutputTuple,
      AcceptedEvent.OutputObject
    >;
    Accepted: TypedContractEvent<
      AcceptedEvent.InputTuple,
      AcceptedEvent.OutputTuple,
      AcceptedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "WhitelistedSenderAddressAdded(address)": TypedContractEvent<
      WhitelistedSenderAddressAddedEvent.InputTuple,
      WhitelistedSenderAddressAddedEvent.OutputTuple,
      WhitelistedSenderAddressAddedEvent.OutputObject
    >;
    WhitelistedSenderAddressAdded: TypedContractEvent<
      WhitelistedSenderAddressAddedEvent.InputTuple,
      WhitelistedSenderAddressAddedEvent.OutputTuple,
      WhitelistedSenderAddressAddedEvent.OutputObject
    >;

    "WhitelistedSenderAddressRemoved(address)": TypedContractEvent<
      WhitelistedSenderAddressRemovedEvent.InputTuple,
      WhitelistedSenderAddressRemovedEvent.OutputTuple,
      WhitelistedSenderAddressRemovedEvent.OutputObject
    >;
    WhitelistedSenderAddressRemoved: TypedContractEvent<
      WhitelistedSenderAddressRemovedEvent.InputTuple,
      WhitelistedSenderAddressRemovedEvent.OutputTuple,
      WhitelistedSenderAddressRemovedEvent.OutputObject
    >;

    "WhitelistedTargetAddressAdded(address)": TypedContractEvent<
      WhitelistedTargetAddressAddedEvent.InputTuple,
      WhitelistedTargetAddressAddedEvent.OutputTuple,
      WhitelistedTargetAddressAddedEvent.OutputObject
    >;
    WhitelistedTargetAddressAdded: TypedContractEvent<
      WhitelistedTargetAddressAddedEvent.InputTuple,
      WhitelistedTargetAddressAddedEvent.OutputTuple,
      WhitelistedTargetAddressAddedEvent.OutputObject
    >;

    "WhitelistedTargetAddressRemoved(address)": TypedContractEvent<
      WhitelistedTargetAddressRemovedEvent.InputTuple,
      WhitelistedTargetAddressRemovedEvent.OutputTuple,
      WhitelistedTargetAddressRemovedEvent.OutputObject
    >;
    WhitelistedTargetAddressRemoved: TypedContractEvent<
      WhitelistedTargetAddressRemovedEvent.InputTuple,
      WhitelistedTargetAddressRemovedEvent.OutputTuple,
      WhitelistedTargetAddressRemovedEvent.OutputObject
    >;
  };
}
