const { deployments, ethers, network } = require("hardhat");
const { developmentChains } = require("../../../helper-hardhat.config");
const { expect } = require("chai");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Budget Staging Test", function () {
      let deployerSigner, user1Signer, Budget;

      beforeEach(async () => {
        // get signers
        const accounts = await ethers.getSigners();
        deployerSigner = accounts[0];
        user1Signer = accounts[1];

        // get deployed contract
        const BudgetDeployment = await deployments.get("Budget");
        Budget = await ethers.getContractAt("Budget", BudgetDeployment.address);
        Budget = Budget.connect(deployerSigner); // explicitly connect signer
      
      });

      it("allows user to submit and admin to approve", async () => {
        const BudgetAsUser1 = Budget.connect(user1Signer);

        const tx = await BudgetAsUser1.submitRequest(
          "travel",
          deployerSigner.address,
          5000,
        );
        await tx.wait();

        const approveTx = await Budget.approveRequest(0); // deployer approves
        await approveTx.wait();

        const req = await Budget.allRequest(0);
        expect(req.status.toString()).to.equal("1"); // APPROVED
      });

      it("allows user to submit and admin to reject", async () => {
        const BudgetAsUser1 = Budget.connect(user1Signer);

        const tx = await BudgetAsUser1.submitRequest(
          "travel",
          deployerSigner.address,
          5000,
        );
        await tx.wait();

        const rejectTx = await Budget.rejectRequest(1); // deployer rejects
        await rejectTx.wait();

        const req = await Budget.allRequest(0);
        expect(req.status.toString()).to.equal("2"); // REJECTED
      });
    });
