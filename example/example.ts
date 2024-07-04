import { QuantumPortalSDK, MethodCallData, SupportedChainIds } from '../src/index'
import { ethers } from 'ethers'

async function main() {
    const sdk = new QuantumPortalSDK()

    const sourceChainId: SupportedChainIds = "1" // Example source chain ID (Ethereum)
    const targetChainId: SupportedChainIds = "56" // Example target chain ID (Binance Smart Chain)

    // Example remote method call data
    const methodCallData: MethodCallData = {
        functionName: 'setNumberAndGreeting', // The name of the function to call
        types: ["uint256", "string"],
        values: [1234, "Hello World"]
    }

    const composerContract = "0xYourComposerContractAddress" // Example composer contract address
    const remoteContract = "0xYourRemoteContractAddress" // Example remote contract address
    const beneficiary = "0xYourBeneficiaryAddress" // Example beneficiary address

    try {
        const fee = await sdk.calculateFeeForTransaction(
            sourceChainId,
            targetChainId,
            methodCallData,
            composerContract,
            remoteContract,
            beneficiary
        )
        console.log(`Calculated fee: ${ethers.formatEther(fee)} FRM`)
    } catch (error) {
        console.error('Error calculating fee:', error)
    }
}

main().catch((error) => {
    console.error('Error in main function:', error)
    process.exitCode = 1
})
