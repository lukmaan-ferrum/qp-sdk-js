// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "hardhat/console.sol";


/**
 * @notice Fee convertor utility for QP. Used for gas calculations
 */
contract FeeConverterMock {

    uint256 internal constant Q128 = 0x100000000000000000000000000000000;
    mapping(uint256 => uint256) public recentPriceX128; // Units: ETH/FRM * 2^32 or BNB/FRM * 2^32 etc
    uint256 public feePerByte; // Units: FRM/bytes

    constructor() {
        feePerByte = 2 * 10**18; // 2 FRM per byte
    }
    
    function setRecentPriceX128(uint256 chainId, uint256 price) external {
        recentPriceX128[chainId] = price;
    }

    function updateFeePerByte(uint256 fpb) external {
        feePerByte = fpb;
    }

    /**
     * @notice Return the gas token (FRM) price for the target chain
     * @param targetChainId The target chain ID
     */
    function targetChainGasTokenPriceX128(
        uint256 targetChainId
    ) external view returns (uint256) {
        return _targetChainGasTokenPriceX128(targetChainId);
    }

    /**
     * @notice Get the fee for the target network
     */
    function targetChainFixedFee(
        uint256 targetChainId,
        uint256 size
    ) external view returns (uint256) {
        uint256 price = _targetChainGasTokenPriceX128(targetChainId);
        return (price * size * feePerByte) / Q128;
    }

    /**
     * @notice Return the gas token (FRM) price for the target chain
     * @param targetChainId The target chain ID
     */
    function _targetChainGasTokenPriceX128(
        uint256 targetChainId
    ) internal view returns (uint256) {
        return recentPriceX128[targetChainId];
    }
}
