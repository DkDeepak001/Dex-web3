import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("DEX", () => {
  let totalSupply = 100;
  let token: Contract;
  let dex: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(totalSupply);

    const DEX = await ethers.getContractFactory("DEX");
    dex = await DEX.deploy(token.address, 100);
  });

  describe("sell", () => {
    it("should fail if contract not approved", async () => {
      await expect(dex.reciveToken()).to.be.reverted;
    });
    it("should approve contract", async () => {
      await token.approve(dex.address, 100);
    });

    it("only owner can call", async () => {
      await token.approve(dex.address, 100);
      await expect(dex.connect(addr1).reciveToken()).to.be.reverted;
    });
    it("should transfer tokens between accounts", async () => {
      await token.approve(dex.address, 100);
      await dex.reciveToken();
      expect(await token.balanceOf(dex.address)).to.equal(100);
    });
  });
});
