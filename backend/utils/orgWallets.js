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

// get contract logs
const getLogs = (receipt, contract) => {
  const eventLog = receipt.logs.find(
    (log) => log.address.toLowerCase() === contract.target.toLowerCase(),
  );

  if (!eventLog) {
    throw new Error("No matching event log found");
  }

  return (parsedLog = contract.interface.parseLog(eventLog));
};
module.exports = { createEncryptedWallet, loadWallet, getLogs };
