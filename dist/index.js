"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuantumPortalSDK = void 0;
const ethers_1 = require("ethers");
const constants_1 = require("./constants");
class QuantumPortalSDK {
    constructor() {
        this.providers = {};
        this.feeConverterAddresses = {};
        this.portalContractAddresses = {};
        for (const chainId in constants_1.networkConfigs) {
            const config = constants_1.networkConfigs[chainId];
            this.providers[chainId] = new ethers_1.ethers.JsonRpcProvider(config.rpcUrl);
            this.feeConverterAddresses[chainId] = config.feeConverterAddress;
            this.portalContractAddresses[chainId] = config.portalContractAddress;
        }
        this.abiCoder = new ethers_1.ethers.AbiCoder();
    }
    setFeeConverterAddress(chainId, feeConverter) {
        this.feeConverterAddresses[chainId] = feeConverter;
    }
    getFeeConverterAddress(chainId) {
        return this.feeConverterAddresses[chainId];
    }
    getPortalContractAddress(chainId) {
        return this.portalContractAddresses[chainId];
    }
    setPortalContractAddress(chainId, portal) {
        this.portalContractAddresses[chainId] = portal;
    }
    setAddresses(chainId, feeConverter, portal) {
        this.setFeeConverterAddress(chainId, feeConverter);
        this.setPortalContractAddress(chainId, portal);
    }
    async calculateFixedFee(sourceChainId, targetChainId, size) {
        const provider = this.providers[sourceChainId];
        const feeConverterContract = new ethers_1.ethers.Contract(this.feeConverterAddresses[sourceChainId], constants_1.feeConverterABI, provider);
        const adjustedSize = size + 9 * 32;
        const fee = await feeConverterContract.targetChainFixedFee(targetChainId, adjustedSize);
        return fee;
    }
    encodeFunctionData(methodCallData) {
        const encodedParameters = this.abiCoder.encode(methodCallData.types, methodCallData.values);
        const functionSignature = `${methodCallData.functionName}(${methodCallData.types.join(',')})`;
        const functionSelector = ethers_1.ethers.keccak256(ethers_1.ethers.toUtf8Bytes(functionSignature)).substring(0, 10);
        const encodedFunctionCall = functionSelector + encodedParameters.substring(2);
        return encodedFunctionCall;
    }
    getPayloadSize(encodedData) {
        const functionSelectorSize = 4; // 4 bytes for the function selector
        const dataSize = (encodedData.length - 2) / 2; // Exclude '0x' prefix and calculate byte length
        return functionSelectorSize + dataSize;
    }
    async estimateGasForRemoteTransaction(sourceChainId, targetChainId, composerContract, remoteContract, beneficiary, methodCallData) {
        const provider = this.providers[targetChainId];
        const calldataTarget = this.encodeFunctionData(methodCallData);
        const portalContractAddress = this.portalContractAddresses[targetChainId];
        const portalContract = new ethers_1.ethers.Contract(portalContractAddress, constants_1.portalABI, provider);
        const calldataPortal = portalContract.interface.encodeFunctionData('estimateGasForRemoteTransaction', [
            sourceChainId,
            composerContract,
            remoteContract,
            beneficiary,
            calldataTarget,
            ethers_1.ethers.ZeroAddress,
            0
        ]);
        return this.estimateGasUsingEthCall(targetChainId, portalContractAddress, calldataPortal);
    }
    async estimateGasUsingEthCall(chainId, contract, estimateMethodCall) {
        const provider = this.providers[chainId];
        try {
            await provider.call({
                data: estimateMethodCall,
                to: contract,
            });
            // This should not succeed
            throw new Error('Estimate gas method call must fail, but this call succeeded');
        }
        catch (error) {
            // Handle the revert reason
            const revertReason = error.data;
            // Extract the gas used from the revert reason
            if (revertReason && revertReason.startsWith("0x08c379a0")) {
                const decodedReason = ethers_1.ethers.AbiCoder.defaultAbiCoder().decode(['string'], '0x' + revertReason.substring(10));
                const gasUsed = Number(decodedReason[0]);
                return gasUsed;
            }
            else {
                throw error;
            }
        }
    }
    async getBaseGasFee(targetChainId) {
        const provider = this.providers[targetChainId];
        const block = await provider.getBlock('latest');
        return block.baseFeePerGas ?? 0n;
    }
    async getTargetChainGasTokenPrice(targetChainId) {
        const feeConverterContract = new ethers_1.ethers.Contract(this.feeConverterAddresses[targetChainId], constants_1.feeConverterABI, this.providers[targetChainId]);
        const price = await feeConverterContract.targetChainGasTokenPriceX128(targetChainId);
        return price;
    }
    async calculateVariableFee(sourceChainId, targetChainId, composerContract, remoteContract, beneficiary, methodCallData) {
        const gasUsed = await this.estimateGasForRemoteTransaction(sourceChainId, targetChainId, composerContract, remoteContract, beneficiary, methodCallData);
        const baseGasFee = await this.getBaseGasFee(targetChainId);
        const gasCostInTargetNative = BigInt(gasUsed) * baseGasFee * 105n / 100n;
        const targetNativeToFRMPrice = await this.getTargetChainGasTokenPrice(sourceChainId);
        const gasCostInFRM = (gasCostInTargetNative * targetNativeToFRMPrice) / (2n ** 128n);
        return gasCostInFRM;
    }
    async calculateFeeForTransaction(sourceChainId, targetChainId, methodCallData, composerContract, remoteContract, beneficiary) {
        const encodedData = this.encodeFunctionData(methodCallData);
        const payloadSize = this.getPayloadSize(encodedData);
        const fixedFee = await this.calculateFixedFee(sourceChainId, targetChainId, payloadSize);
        const variableFee = await this.calculateVariableFee(sourceChainId, targetChainId, composerContract, remoteContract, beneficiary, methodCallData);
        return fixedFee + variableFee;
    }
}
exports.QuantumPortalSDK = QuantumPortalSDK;
