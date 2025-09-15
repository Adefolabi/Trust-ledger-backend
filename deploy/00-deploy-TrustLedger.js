const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat.config");
const { verify } = require("../utils/verify");
const fs = require("fs");
const path = require("path");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const args = [];

  const Budget = await deploy("Budget", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log(`✅ Budget deployed at: ${Budget.address}`);

  //  Save ABI + Address for Backend
  const artifact = await hre.artifacts.readArtifact("Budget");
  const contractData = {
    address: Budget.address,
    abi: artifact.abi,
    network: network.name,
  };

  const contractsDir = path.join(__dirname, "../..", "backend/contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "Budget.json"),
    JSON.stringify(contractData, null, 2),
  );

  //  verification
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying.....");
    await verify(Budget.address, args);
  }

  log(
    "...........................................................................",
  );
};

module.exports.tags = ["all", "trustledger"];
