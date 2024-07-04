import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import QPModule from "../ignition/modules/QP";
import { QuantumPortalSDK, MethodCallData, SupportedChainIds } from '../src/index'
import { Contract } from "ethers";

describe("FeeEstimation", function () {
    let feeConverterMock: Contract;
    let portalMock: Contract;
    let sdk: QuantumPortalSDK;

    async function deployOneYearLockFixture() {

        let { feeConverterMock, portalMock } = await hre.ignition.deploy(QPModule)
        return { feeConverterMock, portalMock }
    }

    beforeEach(async function () {
        ({ feeConverterMock, portalMock } = await loadFixture(deployOneYearLockFixture))
        sdk = new QuantumPortalSDK()
        sdk.setAddresses("31337", await feeConverterMock.getAddress(), await portalMock.getAddress())
    });

    it("Check feePerByte", async function () {
        console.log(await feeConverterMock.feePerByte())
    });

    it("calculateFixedFee should return a fixed fee", async function () {
        const sourceChainId: SupportedChainIds = "31337"
        const targetChainId: SupportedChainIds = "31337"
        const size = 100
        const fee = await sdk.calculateFixedFee(sourceChainId, targetChainId, size)
        console.log(fee)
    })

    it("calculateVariableFee should return a variable fee", async function () {
        const sourceChainId: SupportedChainIds = "31337"
        const targetChainId: SupportedChainIds = "31337"

        const methodCallData: MethodCallData = {
            functionName: 'setNumber',
            types: ["uint256"],
            values: [42]
        }

        const composerContract = "0x0000000000000000000000000000000000000001"  // Example address
        const remoteContract = await feeConverterMock.getAddress()
        const beneficiary = "0x0000000000000000000000000000000000000002" // Example beneficiary address

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
        const sourceChainId: SupportedChainIds = "31337"
        const targetChainId: SupportedChainIds = "31337"

        const methodCallData: MethodCallData = {
            functionName: 'setNumber',
            types: ["uint256"],
            values: [42]
        }

        const composerContract = "0x0000000000000000000000000000000000000001"  // Example address
        const remoteContract = await feeConverterMock.getAddress()
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
