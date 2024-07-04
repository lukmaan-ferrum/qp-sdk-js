import { ethers } from 'ethers'
import { feeConverterABI, portalABI, networkConfigs, SupportedChainIds } from './constants'

interface MethodCallData {
    functionName: string
    types: string[]
    values: any[]
}

class QuantumPortalSDK {
    private providers: { [key in SupportedChainIds]: ethers.JsonRpcProvider }
    private abiCoder: ethers.AbiCoder

    constructor() {
        this.providers = {} as { [key in SupportedChainIds]: ethers.JsonRpcProvider }
        for (const chainId in networkConfigs) {
            const config = networkConfigs[chainId as SupportedChainIds]
            this.providers[chainId as SupportedChainIds] = new ethers.JsonRpcProvider(config.rpcUrl)
        }
        this.abiCoder = new ethers.AbiCoder()
    }

    async calculateFixedFee(sourceChainId: SupportedChainIds, targetChainId: SupportedChainIds, size: number): Promise<bigint> {
        const provider = this.providers[sourceChainId]
        const feeConverterAddress = networkConfigs[sourceChainId].feeConverterAddress
        const feeConverterContract = new ethers.Contract(feeConverterAddress, feeConverterABI, provider)
        const adjustedSize = size + 9 * 32
        const fee = await feeConverterContract.targetChainFixedFee(targetChainId, adjustedSize)
        return fee.toBigInt()
    }

    encodeFunctionData(types: string[], values: any[]): string {
        const encodedData = this.abiCoder.encode(types, values)
        return encodedData
    }

    getPayloadSize(encodedData: string): number {
        const functionSelectorSize = 4 // 4 bytes for the function selector
        const dataSize = (encodedData.length - 2) / 2 // Exclude '0x' prefix and calculate byte length
        return functionSelectorSize + dataSize
    }

    async estimateGasForRemoteTransaction(
        sourceChainId: SupportedChainIds,
        targetChainId: SupportedChainIds,
        composerContract: string,
        remoteContract: string,
        beneficiary: string,
        methodCallData: MethodCallData
    ): Promise<number> {
        const provider = this.providers[sourceChainId]
        const encodedMethod = this.encodeFunctionData(methodCallData.types, methodCallData.values)
        const portalContractAddress = networkConfigs[targetChainId].portalContractAddress
        const portalContract = new ethers.Contract(portalContractAddress, portalABI, provider)

        const estimateMethodCall = portalContract.interface.encodeFunctionData(
            'estimateGasForRemoteTransaction',
            [
                targetChainId,
                composerContract,
                remoteContract,
                beneficiary,
                encodedMethod,
                ethers.ZeroAddress,
                0
            ]
        )

        return this.estimateGasUsingEthCall(sourceChainId, portalContractAddress, estimateMethodCall)
    }

    async estimateGasUsingEthCall(chainId: SupportedChainIds, contract: string, encodedAbiForEstimateGas: string): Promise<number> {
        const provider = this.providers[chainId]
        const res = await provider.call({
            data: encodedAbiForEstimateGas,
            to: contract,
        })

        if (res.startsWith("0x08c379a0")) {
            const errorMessage = ethers.AbiCoder.defaultAbiCoder().decode(['string'], '0x' + res.substring(10))
            return Number.parseInt(errorMessage[0], 10)
        } else {
            throw new Error('Estimate gas method call must fail, but this call will succeed')
        }
    }

    async getBaseGasFee(targetChainId: SupportedChainIds): Promise<bigint> {
        const provider = this.providers[targetChainId]
        const block = await provider.getBlock('latest')
        return block!.baseFeePerGas ?? 0n
    }

    async getTargetChainGasTokenPrice(targetChainId: SupportedChainIds): Promise<bigint> {
        const provider = this.providers[targetChainId]
        const feeConverterAddress = networkConfigs[targetChainId].feeConverterAddress
        const feeConverterContract = new ethers.Contract(feeConverterAddress, feeConverterABI, provider)
        const price = await feeConverterContract.targetChainGasTokenPriceX128(targetChainId)
        return price.toBigInt()
    }

    async calculateVariableFee(
        sourceChainId: SupportedChainIds,
        targetChainId: SupportedChainIds,
        composerContract: string,
        remoteContract: string,
        beneficiary: string,
        methodCallData: MethodCallData
    ): Promise<bigint> {
        const gasUsed = await this.estimateGasForRemoteTransaction(
            sourceChainId,
            targetChainId,
            composerContract,
            remoteContract,
            beneficiary,
            methodCallData
        )
        const baseGasFee = await this.getBaseGasFee(targetChainId)
        const gasTokenPrice = await this.getTargetChainGasTokenPrice(targetChainId)
        const gasTokenPriceInFRM = (gasTokenPrice * baseGasFee) / (2n ** 128n)
        return BigInt(gasUsed) * gasTokenPriceInFRM
    }

    async calculateFeeForTransaction(
        sourceChainId: SupportedChainIds,
        targetChainId: SupportedChainIds,
        methodCallData: MethodCallData,
        composerContract: string,
        remoteContract: string,
        beneficiary: string
    ): Promise<bigint> {
        const encodedData = this.encodeFunctionData(methodCallData.types, methodCallData.values)
        const payloadSize = this.getPayloadSize(encodedData)
        const fixedFee = await this.calculateFixedFee(sourceChainId, targetChainId, payloadSize)
        const variableFee = await this.calculateVariableFee(
            sourceChainId,
            targetChainId,
            composerContract,
            remoteContract,
            beneficiary,
            methodCallData
        )
        return fixedFee + variableFee
    }
}

export { QuantumPortalSDK, MethodCallData, SupportedChainIds }
