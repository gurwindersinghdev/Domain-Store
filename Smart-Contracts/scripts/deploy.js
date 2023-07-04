const hre = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

async function main() {
  // Setup accounts & variables

  const [deployer] = await ethers.getSigners();
  const NAME = "Domain Store";
  const SYMBOL = "DS";

  //Deploy the contract
  const Domain = await ethers.deployContract("Domain", ["Domain Store", "DS"]);
  let domainContract = await Domain.waitForDeployment();

  //let contractAdddr = domainContract.getAddress();

  console.log("Contract address:", await domainContract.getAddress());

  // List the domains

  const names = [
    "ZkSync.eth",
    "bitcoin.eth",
    "tether.eth",
    "bnb.eth",
    "xrp.eth",
    "cardano.eth",
    "litecoin.eth",
    "solana.eth",
    "tron.eth",
    "polkadot.eth",
    "toncoin.eth",
    "avalanche.eth",
    "chainlink.eth",
    "filecoin.eth",
    "lido.eth",
    "arbitrum.eth",
    "aave.eth",
    "thegraph.eth",
    "maker.eth",
    "algorand",
  ];
  const costs = [
    tokens(0.11),
    tokens(0.8),
    tokens(0.66),
    tokens(0.9),
    tokens(0.83),
    tokens(0.8),
    tokens(0.5),
    tokens(0.6),
    tokens(0.11),
    tokens(0.8),
    tokens(0.66),
    tokens(0.9),
    tokens(0.83),
    tokens(0.8),
    tokens(0.5),
    tokens(0.6),
    tokens(0.9),
    tokens(0.83),
    tokens(0.8),
    tokens(0.88),
  ];

  for (let i = 0; i < 20; i++) {
    const transaction = await domainContract
      .connect(deployer)
      .list(names[i], costs[i]);
    await transaction.wait();

    console.log(`Listed Domain ${i + 1}: ${names[i]}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
