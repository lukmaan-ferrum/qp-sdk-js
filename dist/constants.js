"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portalABI = exports.feeConverterABI = exports.networkConfigs = exports.portalContractAddresses = exports.feeConverterAddresses = exports.rpcUrls = void 0;
exports.rpcUrls = {
    "1": "https://eth.llamarpc.com",
    "56": "https://bsc-dataseed.binance.org/",
    "43114": "https://api.avax.network/ext/bc/C/rpc",
    "42161": "https://nd-829-997-700.p2pify.com/790712c620e64556719c7c9f19ef56e3",
    "31337": "http://localhost:8545",
    "8453": "https://base-mainnet.core.chainstack.com/e7aa01c976c532ebf8e2480a27f18278"
};
exports.feeConverterAddresses = {
    "1": "0xEthereumFeeConverterAddress",
    "56": "0xBinanceFeeConverterAddress",
    "43114": "0xAvalancheFeeConverterAddress",
    "42161": "0x8fDFd4F67a0E67452A957e1D9290bb4DC53c2DA5",
    "31337": "0xTestFeeConverterAddress",
    "8453": "0x27A90Bb08A9BdB7ffb68199c89c9CeC1f0832c76"
};
exports.portalContractAddresses = {
    "1": "0xEthereumPortalContractAddress",
    "56": "0xBinancePortalContractAddress",
    "43114": "0xAvalanchePortalContractAddress",
    "42161": "0x1a24916551ed9c208d28dECa7e353178422E55D8",
    "31337": "0xTestPortalContractAddress",
    "8453": "0xC591FBCba0B5EFCdF85805FB9d928Bf4B2Fd96B0"
};
exports.networkConfigs = {
    "1": { rpcUrl: exports.rpcUrls["1"], feeConverterAddress: exports.feeConverterAddresses["1"], portalContractAddress: exports.portalContractAddresses["1"] },
    "56": { rpcUrl: exports.rpcUrls["56"], feeConverterAddress: exports.feeConverterAddresses["56"], portalContractAddress: exports.portalContractAddresses["56"] },
    "43114": { rpcUrl: exports.rpcUrls["43114"], feeConverterAddress: exports.feeConverterAddresses["43114"], portalContractAddress: exports.portalContractAddresses["43114"] },
    "42161": { rpcUrl: exports.rpcUrls["42161"], feeConverterAddress: exports.feeConverterAddresses["42161"], portalContractAddress: exports.portalContractAddresses["42161"] },
    "31337": { rpcUrl: exports.rpcUrls["31337"], feeConverterAddress: exports.feeConverterAddresses["31337"], portalContractAddress: exports.portalContractAddresses["31337"] },
    "8453": { rpcUrl: exports.rpcUrls["8453"], feeConverterAddress: exports.feeConverterAddresses["8453"], portalContractAddress: exports.portalContractAddresses["8453"] }
};
exports.feeConverterABI = [
    "function targetChainFixedFee(uint256 targetChainId, uint256 size) view returns (uint256)",
    "function targetChainGasTokenPriceX128(uint256 targetChainId) view returns (uint256)"
];
exports.portalABI = [
    "function estimateGasForRemoteTransaction(uint256 remoteChainId, address sourceMsgSender, address remoteContract, address beneficiary, bytes memory method, address token, uint256 amount)"
];
