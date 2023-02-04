//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Whitelist {
    address public owner;
    uint8 public maxWhitelistedAddresses;
    uint8 public numberWhitelisted;
    mapping(address => bool ) public whitelistedAddresses;

    constructor(uint8 _maxWhitelistedAddresses){
        owner = msg.sender;
        maxWhitelistedAddresses=_maxWhitelistedAddresses;
    }

     // Create a modifier that only allows a function to be called by the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");

        // Underscore is a special character used inside modifiers
        // Which tells Solidity to execute the function the modifier is used on
        // at this point
        // Therefore, this modifier will first perform the above check
        // Then run the rest of the code
        _;
    }

    function addAddress() public {
        require(!whitelistedAddresses[msg.sender], "Sender has already been whitelisted");
        require(numberWhitelisted<maxWhitelistedAddresses, "Whitelist limit reached, additionnal members cannot be added");
        whitelistedAddresses[msg.sender] = true;
        numberWhitelisted+=1;
    }

    function removeAddress(address _member) public onlyOwner {
        require(whitelistedAddresses[_member], "Target iser is not whitelisted");
        require(numberWhitelisted>0, "Whitelist is empty, there are no members to remove");
        whitelistedAddresses[_member] = false;
        numberWhitelisted-=1;
    }

    function setWhitelistCapacity(uint8 _maxNumber) public onlyOwner {
        maxWhitelistedAddresses=_maxNumber;
    }
}