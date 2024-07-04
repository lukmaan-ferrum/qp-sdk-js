import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const QPModule = buildModule("QPModule", (m) => {
    const feeConverterMock = m.contract("FeeConverterMock", []);
    const portalMock = m.contract("PortalMock", []);

    return { portalMock, feeConverterMock };
});

export default QPModule;
