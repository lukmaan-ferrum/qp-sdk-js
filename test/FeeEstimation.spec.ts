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
});
