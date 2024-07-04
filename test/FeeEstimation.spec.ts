import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import QPModule from "../ignition/modules/QP";

describe("FeeEstimation", function () {
    let feeConverterMock: any;
    let portalMock: any;

    async function deployOneYearLockFixture() {

        let { feeConverterMock, portalMock } = await hre.ignition.deploy(QPModule)
        return { feeConverterMock, portalMock }
    }

    beforeEach(async function () {
        ({ feeConverterMock, portalMock } = await loadFixture(deployOneYearLockFixture));
    });

    it("Check feePerByte", async function () {
        console.log(await feeConverterMock.feePerByte())
    });
});
