const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Event = require("../models/eventLog");

const hashFunction = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const randomnPassword = (length = 12) => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWKXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const number = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{};:,.<>?";
  let password = "";
  const allchar = upper + lower + number + symbols;

  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += number[Math.floor(Math.random() * number.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 4; i < length; i++) {
    const randomIndex = crypto.randomInt(0, allchar.length);
    password += allchar[randomIndex];
  }
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};

// event logs
const logEvent = async ({
  name,
  request,
  user,
  wallet,
  contract,
  receipt,
  logs,
}) => {
  await Event.create({
    eventName: name,
    requestId: request._id,
    eventEmitter: user._id || user.id,
    emitterAddress: wallet.address,
    contractAddress: contract.target,
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    onChainId: logs.args.id.toString(),
    rawEvent: logs,
    eventArgs: logs.args,
    onChainId: logs.args.id?.toString(),
  });
};
module.exports = { hashFunction, randomnPassword, logEvent };
