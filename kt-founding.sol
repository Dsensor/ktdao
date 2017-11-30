pragma solidity ^0.4.11;
/// @title Founding Knowledge Token
contract ktfounding {

  address genesis;
  uint claimproof;
  uint dkt;

  mapping(address => uint) public ktowners;

  // Constructor
  function ktfounding(){
    genesis = msg.sender;
  }

  function newd () returns(bool successful) {
  	dkt = 888;
  	return true;
  }

  function getd() constant returns(uint) {
     return dkt;
  }

  function newktclaim (address receiver) returns(bool successful) {
  	ktowners[receiver] = 888;
  	return true;
  }

  function verifykt(address receiver) constant returns(uint) {
     return ktowners[receiver];
  }

  function remove() {
    if (msg.sender == genesis){
      selfdestruct(genesis);
    }
  }

}
