import { expect } from "chai";
import { ethers } from "hardhat";
const hre = require("hardhat");
const { provider, contracts, signers } = hre;

describe("ERC20 Egobi Token", function () {
  const holdMax = 50000000; // 50 million tokens
  const maxSupply = 100000000; // 100 million tokens
  let egobiToken: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  beforeEach(async function () {
    const Egobi = await ethers.getContractFactory("EgobiToken");
    [owner, addr1, addr2] = await hre.ethers.getSigners();
    egobiToken = await Egobi.deploy(holdMax, Date.now(), maxSupply);
  });
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await egobiToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await egobiToken.balanceOf(owner.address);
      expect(await egobiToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    // it("Should fail if sender doesn't have enough tokens", async function () {
    //   const initialOwnerBalance = await egobiToken.balanceOf(owner.address);
    //   // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
    //   // `require` will evaluate false and revert the transaction.

    //   let data = await egobiToken.connect(addr1).transfer(owner.address, 1);
    //   console.log(data, "data");
    //   await expect(
    //     egobiToken.connect(addr1).transfer(owner.address, 1)
    //   ).to.be.revertedWith(
    //     'ERC20InsufficientBalance("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 0, 1)'
    //   );
    //   // Owner balance shouldn't have changed.
    //   expect(await egobiToken.balanceOf(owner.address)).to.equal(
    //     initialOwnerBalance
    //   );
    // });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await egobiToken.balanceOf(owner.address);
      console.log(initialOwnerBalance);
      console.log(typeof initialOwnerBalance);

      // Transfer 100 tokens from owner to addr1.
      await egobiToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await egobiToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await egobiToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - BigInt(150));

      const addr1Balance = await egobiToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await egobiToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
