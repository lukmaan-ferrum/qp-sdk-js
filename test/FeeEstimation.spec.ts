import hre, { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import QPModule from "../ignition/modules/QP";
import { QuantumPortalSDK, MethodCallData, SupportedChainIds } from '../src/index'
import { Contract } from "ethers";

const feeConverterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const portalAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

describe("FeeEstimation", function () {
    let feeConverterMock: Contract;
    let portalMock: Contract;
    let sdk: QuantumPortalSDK;

    async function deployOneYearLockFixture() {

        let { feeConverterMock, portalMock } = await hre.ignition.deploy(QPModule)
        return { feeConverterMock, portalMock }
    }

    beforeEach(async function () {
        // ({ feeConverterMock, portalMock } = await loadFixture(deployOneYearLockFixture))
        sdk = new QuantumPortalSDK()
        sdk.setAddresses("42161", "0x8fDFd4F67a0E67452A957e1D9290bb4DC53c2DA5", "0x1a24916551ed9c208d28dECa7e353178422E55D8")
        sdk.setAddresses("8453", "0x27A90Bb08A9BdB7ffb68199c89c9CeC1f0832c76", "0xC591FBCba0B5EFCdF85805FB9d928Bf4B2Fd96B0")
        sdk.setAddresses("31337", feeConverterAddress, portalAddress)
    });

    it("calculateFixedFee should return a fixed fee", async function () {
        const sourceChainId: SupportedChainIds = "42161"
        const targetChainId: SupportedChainIds = "8453"
        const size = 100
        const fee = await sdk.calculateFixedFee(sourceChainId, targetChainId, size)
        console.log(fee)
        expect(fee).to.be.a('bigint')
    })

    it("calculateVariableFee should return a variable fee", async function () {
        const sourceChainId: SupportedChainIds = "42161"
        const targetChainId: SupportedChainIds = "8453"

        const methodCallData = {
            functionName: 'finalizeCross', // The name of the function to call
            types: ["address", "address", "uint256"],
            values: [
              "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
              "0xEb608fE026a4F54df43E57A881D2e8395652C58D",
              Number(0.01) * 10**6,
            ]
        }
        
        const composerContract = "0xa0259B953755EC3600eBe26232393f5f48E51d90"  // Example address
        const remoteContract = "0x1815Cd8557c70f41DD529D1e091f68fe81f4095A"
        const beneficiary = "0xEb608fE026a4F54df43E57A881D2e8395652C58D" // Example beneficiary address

        const variableFee = await sdk.calculateVariableFee(
            sourceChainId,
            targetChainId,
            composerContract,
            remoteContract,
            beneficiary,
            methodCallData
        )

        console.log(variableFee)

        expect(variableFee).to.be.a('bigint')
    })

    it("calculateFeeForTransaction should return a total fee", async function () {
        const sourceChainId: SupportedChainIds = "42161"
        const targetChainId: SupportedChainIds = "8453"

        const methodCallData = {
            functionName: 'finalizeCross', // The name of the function to call
            types: ["address", "address", "uint256"],
            values: [
              "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
              "0xEb608fE026a4F54df43E57A881D2e8395652C58D",
              Number(0.01) * 10**6,
            ]
        }

        const composerContract = "0x0000000000000000000000000000000000000001"  // Example address
        const remoteContract = feeConverterAddress
        const beneficiary = "0x0000000000000000000000000000000000000002" // Example beneficiary address

        const totalFee = await sdk.calculateFeeForTransaction(
            sourceChainId,
            targetChainId,
            methodCallData,
            composerContract,
            remoteContract,
            beneficiary
        )

        console.log(totalFee)
        expect(totalFee).to.be.a('bigint')
    })
});
