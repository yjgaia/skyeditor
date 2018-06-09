pragma solidity ^0.4.6;

contract test2 {
	mapping (address => string) public names;
	
	function saveName(string name) public {
        names[msg.sender] = name;
    }
}