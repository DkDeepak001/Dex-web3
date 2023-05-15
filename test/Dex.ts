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
  describe("Getters", () => {
    it("should return the token balance", async () => {
      await token.approve(dex.address, 100);
      await dex.reciveToken();
      expect(await dex.getRemaingToken()).to.equal(100);
    });
    it("should return the token price", async () => {
      expect(await dex.getPrice(10)).to.equal(100 * 10);
    });
  });
  describe("buy", () => {
    it("should fail if contract not approved", async () => {
      await expect(dex.buyToken(10)).to.be.reverted;
    });

    it("should transfer tokens between accounts", async () => {
      await token.approve(dex.address, 100);
      await dex.reciveToken();
      await dex.buyToken(10, { value: 1000 });
      expect(await token.balanceOf(addr1.address)).to.changeTokenBalance(
        token,
        [addr1.address, dex.address],
        [-10, 10]
      );
    });
  });
  describe("withdraw", () => {
    it("should fail if not owner", async () => {
      await expect(dex.withDrawToken()).to.be.reverted;
    });
    it("should withdraw the balance", async () => {
      await token.approve(dex.address, 100);
      await dex.reciveToken();
      await dex.withDrawToken();
      expect(await token.balanceOf(dex.address)).to.equal(0);
    });
  });

  describe("withdrawFunds", () => {
    it("should withdraw the balance", async () => {
      await token.approve(dex.address, 100);
      await dex.reciveToken();
      await dex.buyToken(10, { value: 1000 });
      expect(await dex.withDrawFunds()).to.changeEtherBalance(
        [owner.address, dex.address],
        [-1000, 1000]
      );
    });
  });
});
