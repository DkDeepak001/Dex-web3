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
}