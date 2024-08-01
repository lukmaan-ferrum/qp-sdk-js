// index.d.ts
declare module 'quantum-portal-sdk' {
    export class QuantumPortalSDK {
        calculateFeeForTransaction(
            sourceChainId: string,
            targetChainId: string,
            methodCallData: string,
            composerContract: string,
            remoteContract: string,
            beneficiary: string
        ): Promise<string>;
    }
}
