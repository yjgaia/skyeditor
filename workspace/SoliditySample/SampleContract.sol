pragma solidity ^0.4.6;

contract FairyOwnerInfo {
	mapping (address => string) public names;
	
	function saveName(string name) public {
        names[msg.sender] = name;
    }
}