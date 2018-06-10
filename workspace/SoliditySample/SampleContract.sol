pragma solidity ^0.4.6;

//import "./test/test.sol";

contract FairyOwnerInfo {
	
	uint256 public initData;
	address public initOwner;
	
	function FairyOwnerInfo(uint256 _initData, address _initOwner) {
		initData = _initData;
		initOwner = _initOwner;
    }
}