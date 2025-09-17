const { ethers } = require("ethers");
const contractJson = require("../../deployments/localhost/Budget.json");
const { loadWallet } = require("../utils/orgWallets");
const { getProvider } = require("../utils/network");

const contractABI = contractJson.abi;
const contractAddress = contractJson.address;
const provider = getProvider();
const loadWalletFromPrivateKey = (privateKey) => {
  return new ethers.Wallet(privateKey, provider);
};

const getWalletForUser = async (user) => {
  const isLocal = process.env.NETWORK === "local";

  if (isLocal) {
    // Use Hardhat wallets for testing
    if (user.role === "finance") {
      return loadWalletFromPrivateKey(process.env.HARDHAT_FINANCE_PRIVATE_KEY);
    }
    if (user.role === "admin") {
      return loadWalletFromPrivateKey(process.env.HARDHAT_ADMIN_PRIVATE_KEY);
    }
  }

  // Use encrypted wallet from DB in live mode
  if (
    !user.encryptedPrivateKey ||
    typeof user.encryptedPrivateKey !== "string"
  ) {
    throw new Error("Missing or invalid encrypted wallet");
  }

  const decrypted = await loadWallet(
    user.encryptedPrivateKey,
    process.env.PASSWORD,
  );
  return decrypted.connect(provider);
};

module.exports = { getWalletForUser };

const connect = async (signerToUse = signer) => {
  return new ethers.Contract(contractAddress, contractABI, signerToUse);
};

module.exports = { getWalletForUser, connect };
