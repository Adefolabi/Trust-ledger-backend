const contractJson = require("../../deployments/localhost/Budget.json");
const contractABI = contractJson.abi;
const contractAddress = contractJson.address;
const ethers = require("ethers");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const signer = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  provider,
);

const contract = new ethers.Contract(contractAddress, contractABI, signer);

// async function testConnection() {
//   const recipient = signer.address;

//   const tx = await contract.submitRequest(
//     "Laptop Purchase",
//     recipient, // valid Ethereum address
//     1000, // amount
//   );
//   await tx.wait();
//   console.log("✅ Request submitted");

//   const requests = await contract.getRequests(0, 10);
//   console.log("📦 All Requests:", requests);
// }

// testConnection().catch(console.error);
