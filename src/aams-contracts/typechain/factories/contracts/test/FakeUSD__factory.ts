/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  BigNumberish,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  FakeUSD,
  FakeUSDInterface,
} from "../../../contracts/test/FakeUSD";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
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
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mintTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620017bb380380620017bb8339818101604052810190620000379190620003df565b6040518060400160405280600781526020017f46616b65555344000000000000000000000000000000000000000000000000008152506040518060400160405280600481526020017f55534446000000000000000000000000000000000000000000000000000000008152508160039081620000b4919062000681565b508060049081620000c6919062000681565b505050620000db3382620000e260201b60201c565b506200089f565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603620001575760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016200014e9190620007ad565b60405180910390fd5b6200016b600083836200016f60201b60201c565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603620001c5578060026000828254620001b89190620007f9565b925050819055506200029b565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508181101562000254578381836040517fe450d38c0000000000000000000000000000000000000000000000000000000081526004016200024b9392919062000845565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603620002e6578060026000828254039250508190555062000333565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405162000392919062000882565b60405180910390a3505050565b600080fd5b6000819050919050565b620003b981620003a4565b8114620003c557600080fd5b50565b600081519050620003d981620003ae565b92915050565b600060208284031215620003f857620003f76200039f565b5b60006200040884828501620003c8565b91505092915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200049357607f821691505b602082108103620004a957620004a86200044b565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620005137fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620004d4565b6200051f8683620004d4565b95508019841693508086168417925050509392505050565b6000819050919050565b6000620005626200055c6200055684620003a4565b62000537565b620003a4565b9050919050565b6000819050919050565b6200057e8362000541565b620005966200058d8262000569565b848454620004e1565b825550505050565b600090565b620005ad6200059e565b620005ba81848462000573565b505050565b5b81811015620005e257620005d6600082620005a3565b600181019050620005c0565b5050565b601f8211156200063157620005fb81620004af565b6200060684620004c4565b8101602085101562000616578190505b6200062e6200062585620004c4565b830182620005bf565b50505b505050565b600082821c905092915050565b6000620006566000198460080262000636565b1980831691505092915050565b600062000671838362000643565b9150826002028217905092915050565b6200068c8262000411565b67ffffffffffffffff811115620006a857620006a76200041c565b5b620006b482546200047a565b620006c1828285620005e6565b600060209050601f831160018114620006f95760008415620006e4578287015190505b620006f0858262000663565b86555062000760565b601f1984166200070986620004af565b60005b8281101562000733578489015182556001820191506020850194506020810190506200070c565b868310156200075357848901516200074f601f89168262000643565b8355505b6001600288020188555050505b505050505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620007958262000768565b9050919050565b620007a78162000788565b82525050565b6000602082019050620007c460008301846200079c565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006200080682620003a4565b91506200081383620003a4565b92508282019050808211156200082e576200082d620007ca565b5b92915050565b6200083f81620003a4565b82525050565b60006060820190506200085c60008301866200079c565b6200086b602083018562000834565b6200087a604083018462000834565b949350505050565b600060208201905062000899600083018462000834565b92915050565b610f0c80620008af6000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c8063449a52f811610066578063449a52f81461015d57806370a082311461017957806395d89b41146101a9578063a9059cbb146101c7578063dd62ed3e146101f75761009e565b806306fdde03146100a3578063095ea7b3146100c157806318160ddd146100f157806323b872dd1461010f578063313ce5671461013f575b600080fd5b6100ab610227565b6040516100b89190610b60565b60405180910390f35b6100db60048036038101906100d69190610c1b565b6102b9565b6040516100e89190610c76565b60405180910390f35b6100f96102dc565b6040516101069190610ca0565b60405180910390f35b61012960048036038101906101249190610cbb565b6102e6565b6040516101369190610c76565b60405180910390f35b610147610315565b6040516101549190610d2a565b60405180910390f35b61017760048036038101906101729190610c1b565b61031e565b005b610193600480360381019061018e9190610d45565b61032c565b6040516101a09190610ca0565b60405180910390f35b6101b1610374565b6040516101be9190610b60565b60405180910390f35b6101e160048036038101906101dc9190610c1b565b610406565b6040516101ee9190610c76565b60405180910390f35b610211600480360381019061020c9190610d72565b610429565b60405161021e9190610ca0565b60405180910390f35b60606003805461023690610de1565b80601f016020809104026020016040519081016040528092919081815260200182805461026290610de1565b80156102af5780601f10610284576101008083540402835291602001916102af565b820191906000526020600020905b81548152906001019060200180831161029257829003601f168201915b5050505050905090565b6000806102c46104b0565b90506102d18185856104b8565b600191505092915050565b6000600254905090565b6000806102f16104b0565b90506102fe8582856104ca565b61030985858561055e565b60019150509392505050565b60006012905090565b6103288282610652565b5050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606004805461038390610de1565b80601f01602080910402602001604051908101604052809291908181526020018280546103af90610de1565b80156103fc5780601f106103d1576101008083540402835291602001916103fc565b820191906000526020600020905b8154815290600101906020018083116103df57829003601f168201915b5050505050905090565b6000806104116104b0565b905061041e81858561055e565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b6104c583838360016106d4565b505050565b60006104d68484610429565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146105585781811015610548578281836040517ffb8f41b200000000000000000000000000000000000000000000000000000000815260040161053f93929190610e21565b60405180910390fd5b610557848484840360006106d4565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036105d05760006040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016105c79190610e58565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036106425760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016106399190610e58565b60405180910390fd5b61064d8383836108ab565b505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036106c45760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016106bb9190610e58565b60405180910390fd5b6106d0600083836108ab565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16036107465760006040517fe602df0500000000000000000000000000000000000000000000000000000000815260040161073d9190610e58565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036107b85760006040517f94280d620000000000000000000000000000000000000000000000000000000081526004016107af9190610e58565b60405180910390fd5b81600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555080156108a5578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258460405161089c9190610ca0565b60405180910390a35b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036108fd5780600260008282546108f19190610ea2565b925050819055506109d0565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610989578381836040517fe450d38c00000000000000000000000000000000000000000000000000000000815260040161098093929190610e21565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610a195780600260008282540392505081905550610a66565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610ac39190610ca0565b60405180910390a3505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610b0a578082015181840152602081019050610aef565b60008484015250505050565b6000601f19601f8301169050919050565b6000610b3282610ad0565b610b3c8185610adb565b9350610b4c818560208601610aec565b610b5581610b16565b840191505092915050565b60006020820190508181036000830152610b7a8184610b27565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610bb282610b87565b9050919050565b610bc281610ba7565b8114610bcd57600080fd5b50565b600081359050610bdf81610bb9565b92915050565b6000819050919050565b610bf881610be5565b8114610c0357600080fd5b50565b600081359050610c1581610bef565b92915050565b60008060408385031215610c3257610c31610b82565b5b6000610c4085828601610bd0565b9250506020610c5185828601610c06565b9150509250929050565b60008115159050919050565b610c7081610c5b565b82525050565b6000602082019050610c8b6000830184610c67565b92915050565b610c9a81610be5565b82525050565b6000602082019050610cb56000830184610c91565b92915050565b600080600060608486031215610cd457610cd3610b82565b5b6000610ce286828701610bd0565b9350506020610cf386828701610bd0565b9250506040610d0486828701610c06565b9150509250925092565b600060ff82169050919050565b610d2481610d0e565b82525050565b6000602082019050610d3f6000830184610d1b565b92915050565b600060208284031215610d5b57610d5a610b82565b5b6000610d6984828501610bd0565b91505092915050565b60008060408385031215610d8957610d88610b82565b5b6000610d9785828601610bd0565b9250506020610da885828601610bd0565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610df957607f821691505b602082108103610e0c57610e0b610db2565b5b50919050565b610e1b81610ba7565b82525050565b6000606082019050610e366000830186610e12565b610e436020830185610c91565b610e506040830184610c91565b949350505050565b6000602082019050610e6d6000830184610e12565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610ead82610be5565b9150610eb883610be5565b9250828201905080821115610ed057610ecf610e73565b5b9291505056fea264697066735822122048f64e2a9f935d8021edda674c032c5cace2baefaf35a3b4e1a2dbe035bb8e6564736f6c63430008140033";

type FakeUSDConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FakeUSDConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FakeUSD__factory extends ContractFactory {
  constructor(...args: FakeUSDConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    amount_: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(amount_, overrides || {});
  }
  override deploy(
    amount_: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(amount_, overrides || {}) as Promise<
      FakeUSD & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): FakeUSD__factory {
    return super.connect(runner) as FakeUSD__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FakeUSDInterface {
    return new Interface(_abi) as FakeUSDInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): FakeUSD {
    return new Contract(address, _abi, runner) as unknown as FakeUSD;
  }
}
