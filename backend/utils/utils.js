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
const logEvent = async ({ name, request, admin, contract, receipt, logs }) => {
  try {
    const event = await Event.create({
      eventName: name,
      requestId: request?._id || null,
      eventEmitter: admin?._id || admin?.id || null,
      emitterAddress: admin.walletAddress || null,
      contractAddress: contract?.target || null,
      txHash: receipt?.hash,
      blockNumber: receipt?.blockNumber,
      onChainId: logs?.args?.id?.toString() || null,
      rawEvent: logs,
      eventArgs: logs?.args || {},
    });

    console.log(" Event saved with ID:", event._id);
    return event;
  } catch (err) {
    if (err.code === 11000) {
      console.warn("Duplicate txHash, skipping insert:", receipt.hash);
      return await Event.findOne({ txHash: receipt.hash });
    } else {
      console.error("Failed to log event:", err);
      throw err;
    }
  }
};
module.exports = { hashFunction, randomnPassword, logEvent };
