// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./Storage.sol";

contract CallingContract{
    Storage public storageContract;
    constructor(address _storage){
        storageContract = Storage(_storage);
    }

    function useGet() public view returns (uint8){
        uint8 value = storageContract.get();
        return value;
    }
}