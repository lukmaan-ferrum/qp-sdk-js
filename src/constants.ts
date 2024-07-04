export const rpcUrls = {
	"1": "https://eth.llamarpc.com",
	"56": "https://bsc-dataseed.binance.org/",
	"43114": "https://api.avax.network/ext/bc/C/rpc",
	"42161": "https://arb1.arbitrum.io/rpc",
	"31337": "http://localhost:8545"
}

export let feeConverterAddresses = {
	"1": "0xEthereumFeeConverterAddress",
	"56": "0xBinanceFeeConverterAddress",
	"43114": "0xAvalancheFeeConverterAddress",
	"42161": "0xArbitrumFeeConverterAddress",
	"31337": "0xTestFeeConverterAddress"
}

export let portalContractAddresses = {
	"1": "0xEthereumPortalContractAddress",
	"56": "0xBinancePortalContractAddress",
	"43114": "0xAvalanchePortalContractAddress",
	"42161": "0xArbitrumPortalContractAddress",
	"31337": "0xTestPortalContractAddress"
}

export const setTestAddresses = (feeConverter: string, portal: string) => {
	feeConverterAddresses = { ...feeConverterAddresses, "31337": feeConverter }
	portalContractAddresses = { ...portalContractAddresses, "31337": portal }
}

export const networkConfigs = {
	"1": { rpcUrl: rpcUrls["1"], feeConverterAddress: feeConverterAddresses["1"], portalContractAddress: portalContractAddresses["1"] },
	"56": { rpcUrl: rpcUrls["56"], feeConverterAddress: feeConverterAddresses["56"], portalContractAddress: portalContractAddresses["56"] },
	"43114": { rpcUrl: rpcUrls["43114"], feeConverterAddress: feeConverterAddresses["43114"], portalContractAddress: portalContractAddresses["43114"] },
	"42161": { rpcUrl: rpcUrls["42161"], feeConverterAddress: feeConverterAddresses["42161"], portalContractAddress: portalContractAddresses["42161"] },
	"31337": { rpcUrl: rpcUrls["31337"], feeConverterAddress: feeConverterAddresses["31337"], portalContractAddress: portalContractAddresses["31337"] }
} as const

export const feeConverterABI = [
	"function targetChainFixedFee(uint256 targetChainId, uint256 size) view returns (uint256)",
	"function targetChainGasTokenPriceX128(uint256 targetChainId) view returns (uint256)"
]

export const portalABI = [
	"function estimateGasForRemoteTransaction(uint256 remoteChainId, address sourceMsgSender, address remoteContract, address beneficiary, bytes memory method, address token, uint256 amount)"
]

export type SupportedChainIds = keyof typeof networkConfigs
