const { default: mongoose } = require("mongoose");

const walletSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    walletAdress: {
      type: String,
      required: true,
    },
    encryptedPrivateKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
