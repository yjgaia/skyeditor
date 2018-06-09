pragma solidity ^0.4.6;

import "./test2.sol";

contract test {
	mapping (address => string) public names;
	
	function saveName(string name) public {
        names[msg.sender] = name;
    }
}