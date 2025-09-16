const { Wallet } = require("ethers");

const createEncryptedWallet = async (password) => {
  const wallet = Wallet.createRandom();
  const address = wallet.address;
  console.log(address);
  console.log(wallet.privateKey);
  const encryptedJson = await wallet.encrypt(password);
  return { address: address, privateKey: encryptedJson };
};

const loadWallet = async (encryptedJson, password) => {
  const wallet = await Wallet.fromEncryptedJson(encryptedJson, password);
  return wallet;
};
module.exports = { createEncryptedWallet, loadWallet };
