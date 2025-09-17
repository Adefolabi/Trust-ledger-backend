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
