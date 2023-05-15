// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DEX {

    IERC20 public token;
    uint public tokenPrice;
    address owner;

    constructor(IERC20 _token, uint _tokenPrice) {
        token = _token;
        tokenPrice = _tokenPrice;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    function reciveToken () external onlyOwner {
        uint allowance = token.allowance(msg.sender, address(this));
        require(allowance >= 1, "You must approve tokens before calling this function.");
        bool sent = token.transferFrom(msg.sender, address(this), allowance);
        require(sent, "Token transfer failed.");
    }
     
}