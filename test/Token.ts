import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("Token", () => {
  let totalSupply = 100;
  let token: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(totalSupply);
  });

  describe("Deployment", () => {
    it("should assign total supply to the contract", async () => {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token?.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transfer", () => {
    it("should transfer tokens between accounts", async () => {
      await token.transfer(addr1.address, 50);
      expect(await token.balanceOf(addr1.address)).to.equal(50);
      expect(await token.balanceOf(owner.address)).to.equal(50);
    });
    it("should fail if sender doesn't have enough tokens", async () => {
      const initialOwnerBalance = await token.balanceOf(owner.address);
      await expect(token.connect(addr1).transfer(owner.address, 1)).to.be
        .reverted;
      expect(await token.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});
