const { expect } = require("chai");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

describe("Domain", () => {
  let domainContract;
  let deployer, owner1;

  const NAME = "Domain Store";
  const SYMBOL = "DSM";

  beforeEach(async () => {
    [deployer, owner1] = await ethers.getSigners();

    const Domain = await ethers.deployContract("Domain", [
      "Domain Store",
      "DSM",
    ]);
    domainContract = await Domain.waitForDeployment();

    const transaction = await domainContract
      .connect(deployer)
      .list("roger.eth", tokens(11));
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("has a name", async () => {
      const result = await domainContract.name();
      expect(result).to.equal(NAME);
    });

    it("has a symbol", async () => {
      const result = await domainContract.symbol();
      expect(result).to.equal(SYMBOL);
    });

    it("Sets the owner", async () => {
      const result = await domainContract.owner();
      expect(result).to.equal(deployer.address);
    });

    it("Returns the max supply", async () => {
      const result = await domainContract.maxSupply();
      expect(result).to.equal(1);
    });

    it("Returns the total supply", async () => {
      const result = await domainContract.totalSupply();
      expect(result).to.equal(0);
    });
  });

  describe("Domain", () => {
    it("Returns domain attributes", async () => {
      let domain = await domainContract.getDomain(1);
      expect(domain.name).to.equal("roger.eth");
      expect(domain.cost).to.equal(tokens(11));
      expect(domain.isOwned).to.be.equal(false);
    });
  });

  describe("Minting", () => {
    const ID = 1;
    const AMOUNT = ethers.parseUnits("11", "ether");

    beforeEach(async () => {
      const transaction = await domainContract
        .connect(owner1)
        .mint(ID, { value: AMOUNT });
      await transaction.wait();
    });

    it("Updates the owner", async () => {
      const owner = await domainContract.ownerOf(ID);
      expect(owner).to.equal(owner1.address);
    });

    it("Updates the domain status", async () => {
      const domain = await domainContract.getDomain(ID);
      expect(domain.isOwned).to.equal(true);
    });

    it("Updates the contract balance", async () => {
      const result = await domainContract.getBalance();

      expect(result).to.be.equal(AMOUNT);
    });
  });

  describe("Withdrawing", () => {
    const ID = 1;
    const AMOUNT = ethers.parseUnits("11", "ether");
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      let transaction = await domainContract
        .connect(owner1)
        .mint(ID, { value: AMOUNT });
      await transaction.wait();

      transaction = await domainContract.connect(deployer).withdraw();
      await transaction.wait();
    });

    it("Updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Updates the contract balance", async () => {
      const result = await domainContract.getBalance();

      expect(result).to.equal(0);
    });
  });
});
