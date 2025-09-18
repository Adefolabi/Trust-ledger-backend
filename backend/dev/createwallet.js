const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const Wallet = require("../models/wallet");
const { createEncryptedWallet } = require("../utils/wallet");
const router = express.Router();
const PASSWORD = process.env.PASSWORD;

router.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const newWallet = await createEncryptedWallet(PASSWORD);
    const wallet = new Wallet({
      name: req.body.name,
      walletAdress: newWallet.address,
      encryptedPrivateKey: newWallet.privateKey,
    });
    await wallet.save();
    res.status(200).json({ wallet });
  }),
);

module.exports = router;
