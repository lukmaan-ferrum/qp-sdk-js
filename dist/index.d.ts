import { SupportedChainIds } from './constants';
interface MethodCallData {
    functionName: string;
    types: string[];
    values: any[];
}
declare class QuantumPortalSDK {
    private providers;
    private feeConverterAddresses;
    private portalContractAddresses;
    private abiCoder;
    constructor();
    setFeeConverterAddress(chainId: SupportedChainIds, feeConverter: string): void;
    getFeeConverterAddress(chainId: SupportedChainIds): string;
    getPortalContractAddress(chainId: SupportedChainIds): string;
    setPortalContractAddress(chainId: SupportedChainIds, portal: string): void;
    setAddresses(chainId: SupportedChainIds, feeConverter: string, portal: string): void;
    calculateFixedFee(sourceChainId: SupportedChainIds, targetChainId: SupportedChainIds, size: number): Promise<bigint>;
    encodeFunctionData(methodCallData: any): string;
    getPayloadSize(encodedData: string): number;
    estimateGasForRemoteTransaction(sourceChainId: SupportedChainIds, targetChainId: SupportedChainIds, composerContract: string, remoteContract: string, beneficiary: string, methodCallData: MethodCallData): Promise<number>;
    estimateGasUsingEthCall(chainId: SupportedChainIds, contract: string, estimateMethodCall: string): Promise<number>;
    getBaseGasFee(targetChainId: SupportedChainIds): Promise<bigint>;
    getTargetChainGasTokenPrice(targetChainId: SupportedChainIds): Promise<bigint>;
    calculateVariableFee(sourceChainId: SupportedChainIds, targetChainId: SupportedChainIds, composerContract: string, remoteContract: string, beneficiary: string, methodCallData: MethodCallData): Promise<bigint>;
    calculateFeeForTransaction(sourceChainId: SupportedChainIds, targetChainId: SupportedChainIds, methodCallData: MethodCallData, composerContract: string, remoteContract: string, beneficiary: string): Promise<bigint>;
}
export { QuantumPortalSDK, MethodCallData, SupportedChainIds };
