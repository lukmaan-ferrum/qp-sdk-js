// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";


contract PortalMock {
    function estimateGasForRemoteTransaction(
        uint256 remoteChainId,
        address sourceMsgSender,
        address remoteContract,
        address beneficiary,
        bytes memory method,
        address token,
        uint256 amount
    ) external {
        uint256 gasUsed = 150000; // hardcode some value
        revert(Strings.toString(gasUsed));
    }
}
