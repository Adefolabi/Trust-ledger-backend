const { network, getNamedAccounts, ethers, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat.config");
const { expect, assert } = require("chai");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Budget Unit Test", function () {
      let deployer, signer, Budget;

      beforeEach(async () => {
        const namedAccounts = await getNamedAccounts();
        deployer = namedAccounts.deployer;

        await deployments.fixture(["all"]);
        [signer, user1, user2] = await ethers.getSigners();

        const BudgetDeployment = await deployments.get("Budget");
        Budget = await ethers.getContractAt(
          "Budget",
          BudgetDeployment.address,
          signer,
        );
      });

      describe("constructor", () => {
        it("should set deployer as initial admin", async () => {
          expect(await Budget.isAdmin(deployer)).to.be.true;
          const adminList = await Budget.getAdmins();
          expect(adminList.includes(deployer)).to.be.true;
        });
      });
      describe("add and remove admin", () => {
        it("add admins", async () => {
          await expect(Budget.addAdmin(user1.address))
            .to.emit(Budget, "AdminAdded")
            .withArgs(user1.address);

          expect(await Budget.isAdmin(user1.address)).to.be.true;
          const adminList = await Budget.getAdmins();
          expect(adminList.includes(user1.address)).to.be.true;
        });

        it("Ensure only admin can add Admin", async () => {
          const attackerBudget = await Budget.connect(user1);
          await expect(
            attackerBudget.addAdmin(user2.address),
          ).to.be.revertedWithCustomError(Budget, "budget_NotAdmin");
        });
        it("removes admin", async () => {
          await Budget.addAdmin(user1.address);
          expect(await Budget.removeAdmin(user1.address))
            .to.emit("AdminRemoved")
            .withArgs(user1.address);
          expect(await Budget.isAdmin(user1.address)).to.be.false;
          const adminList = await Budget.getAdmins();
          expect(adminList.includes(user1.address)).to.be.false;
        });
        it("Ensure only admin can remove Admin", async () => {
          const attackerBudget = await Budget.connect(user1);
          await expect(
            attackerBudget.removeAdmin(user2.address),
          ).to.be.revertedWithCustomError(Budget, "budget_NotAdmin");
        });
      });
      describe("submit request", () => {
        it("Allows users to submit a budget request", async () => {
          const userContract = Budget.connect(user1);
          await expect(
            userContract.submitRequest("testing", user2.address, 10000),
          )
            .to.emit(Budget, "RequestSubmitted")
            .withArgs(0, user1.address, "testing", user2.address, 10000);

          const request = await Budget.allRequest(0);
          assert.equal(request.requester, user1.address);
          assert.equal(request.status.toString(), "0"); // pending
        });
      });
      describe("Approve request", () => {
        it("Allows admin to approve budget request", async () => {
          const userContract = Budget.connect(user1);
          await userContract.submitRequest("testing", user2.address, 10000);

          await expect(Budget.approveRequest(0))
            .to.emit(Budget, "RequestApproved")
            .withArgs(0, user1.address, "testing", user2.address, 10000);

          const request = await Budget.allRequest(0);
          assert.equal(request.status.toString(), "1"); // approved
        });

        it("Ensure only admin can aprove request", async () => {
          const attackerBudget = await Budget.connect(user1);
          await expect(
            attackerBudget.approveRequest(0),
          ).to.be.revertedWithCustomError(Budget, "budget_NotAdmin");
        });
      });
      describe("reject request", () => {
        it("Allows adimn reject budget request", async () => {
          const userContract = await Budget.connect(user1);
          await userContract.submitRequest("testing ", user2.address, 10000);
          const request = await Budget.allRequest(0);
          expect(request.status.toString() == "0").to.be.revertedWith(
            "Request already processed",
          );
          expect(await Budget.rejectRequest(0))
            .to.emit("RequestRejected")
            .withArgs(0, user1.address, "testing ", user2.address, 10000);
          assert(request.status.toString(), "2");
        });
        it("Ensure only admin can reject request", async () => {
          const attackerBudget = await Budget.connect(user1);
          await expect(
            attackerBudget.rejectRequest(0),
          ).to.be.revertedWithCustomError(Budget, "budget_NotAdmin");
        });
      });
    });
