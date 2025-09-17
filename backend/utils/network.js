const { ethers } = require("ethers");

const LOCAL_RPC = process.env.LOCAL_RPC;
const SEPOLIA_RPC = process.env.SEPOLIA_RPC;
const NETWORK = process.env.NETWORK || "local";

const getProvider = () => {
  const rpcUrl = NETWORK === "live" ? SEPOLIA_RPC : LOCAL_RPC;
  return new ethers.JsonRpcProvider(rpcUrl);
};

module.exports = { getProvider };
