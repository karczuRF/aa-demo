// Alchemy Entry Point addres is the same for each supported network
// https://docs.alchemy.com/reference/eth-supportedentrypoints
export const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"

// custom fake USDC for testing
export const FAKE_ERC20_USDC_ADDRESS = "0x64480f579af4771754dA03824100fF1099893141"

// erc1271 signature values
export const ERC1271_MAGICVALUE_BYTES32 = "0x1626ba7e"
export const ERC1271_INVALID_SIGNATURE = "0xffffffff"

// factory address taken from aa-schnorr-multisig package
export const MUSIG_ACCOUNT_FACTORY_ADDRESS = "0x9f0b89c7AEF51Af9F9579c2C873C828b887CBFBd"
// smart account address - this account was created by the Factory and can be changed to any other account
export const SMART_ACCOUNT_ADDRESS = "0x0587f83f1C5b9548cb98d3C83b82D160123141ef"
