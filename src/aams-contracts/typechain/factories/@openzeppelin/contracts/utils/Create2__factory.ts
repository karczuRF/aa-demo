/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type {
  Create2,
  Create2Interface,
} from "../../../../@openzeppelin/contracts/utils/Create2";

const _abi = [
  {
    inputs: [],
    name: "Create2EmptyBytecode",
    type: "error",
  },
  {
    inputs: [],
    name: "Create2FailedDeployment",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "Create2InsufficientBalance",
    type: "error",
  },
] as const;

const _bytecode =
  "0x60566050600b82828239805160001a6073146043577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220c890b3d727f49898c49d0774a44ba2cb6ceaaef8f7ef0283ef1e8702e4c10d3964736f6c63430008140033";

type Create2ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: Create2ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Create2__factory extends ContractFactory {
  constructor(...args: Create2ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Create2 & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Create2__factory {
    return super.connect(runner) as Create2__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): Create2Interface {
    return new Interface(_abi) as Create2Interface;
  }
  static connect(address: string, runner?: ContractRunner | null): Create2 {
    return new Contract(address, _abi, runner) as unknown as Create2;
  }
}
