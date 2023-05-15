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
     
     function withDrawToken() external onlyOwner {
         uint balance = token.balanceOf(address(this));
         require(balance >= 1, "You must have tokens to withdraw.");
         bool sent = token.transfer(msg.sender, balance);
         require(sent, "Token transfer failed.");
     }

     function withDrawFunds () external onlyOwner {
        (bool sent,) = payable(msg.sender).call{value: address(this).balance}("");
        require(sent, "Fund transfer failed.");
     }

     function buyToken(uint numbTokens) external payable {
        require(numbTokens <= token.balanceOf(address(this)), "You must have enough tokens to withdraw.");
        uint price = numbTokens * tokenPrice;
        require(price == msg.value, "You must send the correct amount of ether.");
        token.transfer(msg.sender, numbTokens);
     }

     function getPrice (uint numbTokens) external view returns (uint) {
         return tokenPrice * numbTokens;
     }

     
}