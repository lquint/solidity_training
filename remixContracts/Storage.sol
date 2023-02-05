// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Storage {
    uint8 number;

    constructor(){
        number=0;
    }

    function increment() public{
        require(number < 255, "uint overflow");
        number += 1;
    }

    function set(uint8 _number) public{
        require(_number <= 255, "uint overflow");
        number = _number;
    }

    function get() public view returns (uint8) {
        return number;
    }
}