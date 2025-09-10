// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

error budget_NotAdmin();
contract Budget {
    /**
     * @title Budget Contract
     * @author Adefolabi
     * @dev This contract manages a budget with functionalities to set, get, and update.
     */

    // type declaration
    enum RequestStatus {
        PENDING,
        APPROVED,
        REJECTED
    }

    struct BudgetRequest {
        uint256 id;
        address requester;
        string purpose;
        address recipient;
        uint256 amount;
        RequestStatus status;
    }

    // state variables
    mapping(address => bool) public isAdmin;
    mapping(uint256 => BudgetRequest) public allRequest;
    uint256 public requestCount;
    address[] public adminList;

    // modifiers
    modifier onlyAdmin() {
        if (!isAdmin[msg.sender]) {
            revert budget_NotAdmin();
        }
        _;
    }

    /* EVENTS */
    event RequestSubmitted(
        uint256 indexed id,
        address indexed requester,
        string purpose,
        address recipient,
        uint256 amount
    );
    event RequestApproved(
        uint256 indexed id,
        address indexed requester,
        string purpose,
        address recipient,
        uint256 amount
    );
    event RequestRejected(
        uint256 indexed id,
        address indexed requester,
        string purpose,
        address recipient,
        uint256 amount
    );
    event AdminAdded(address indexed newAdmin);
    event AdminRemoved(address indexed removedAdmin);

    // constructor → deployer is the first admin
    constructor() {
        isAdmin[msg.sender] = true;
        adminList.push(msg.sender);
    }

    // ADMIN MANAGEMENT
    function addAdmin(address _newAdmin) public onlyAdmin {
        require(!isAdmin[_newAdmin], "Already an admin");
        isAdmin[_newAdmin] = true;
        adminList.push(_newAdmin);
        emit AdminAdded(_newAdmin);
    }

    function removeAdmin(address _admin) public onlyAdmin {
        require(isAdmin[_admin], "Not an admin");
        require(_admin != msg.sender, "Cannot remove yourself");

        isAdmin[_admin] = false;

        for (uint256 i = 0; i < adminList.length; i++) {
            if (adminList[i] == _admin) {
                adminList[i] = adminList[adminList.length - 1];
                adminList.pop();
                break;
            }
        }

        emit AdminRemoved(_admin);
    }

    // create request
    function submitRequest(
        string memory _purpose,
        address _recipient,
        uint256 _amount
    ) public {
        allRequest[requestCount] = BudgetRequest({
            id: requestCount,
            requester: msg.sender,
            purpose: _purpose,
            recipient: _recipient,
            amount: _amount,
            status: RequestStatus.PENDING
        });

        emit RequestSubmitted(
            requestCount,
            msg.sender,
            _purpose,
            _recipient,
            _amount
        );

        requestCount++;
    }

    // approve request
    function approveRequest(uint256 _id) public onlyAdmin {
        BudgetRequest storage request = allRequest[_id];
        require(
            request.status == RequestStatus.PENDING,
            "Request already processed"
        );

        request.status = RequestStatus.APPROVED;

        emit RequestApproved(
            _id,
            request.requester,
            request.purpose,
            request.recipient,
            request.amount
        );
    }

    // reject request
    function rejectRequest(uint256 _id) public onlyAdmin {
        BudgetRequest storage request = allRequest[_id];
        require(
            request.status == RequestStatus.PENDING,
            "Request already processed"
        );

        request.status = RequestStatus.REJECTED;

        emit RequestRejected(
            _id,
            request.requester,
            request.purpose,
            request.recipient,
            request.amount
        );
    }

    // getters
    function getAdmins() public view returns (address[] memory) {
        return adminList;
    }
    function getRequest(
        uint256 _id
    ) public view returns (BudgetRequest memory) {
        return allRequest[_id];
    }

    function getRequests(
        uint256 start,
        uint256 count
    ) public view returns (BudgetRequest[] memory) {
        uint256 end = start + count;
        if (end > requestCount) {
            end = requestCount;
        }

        BudgetRequest[] memory result = new BudgetRequest[](end - start);
        for (uint256 i = start; i < end; i++) {
            result[i - start] = allRequest[i];
        }
        return result;
    }
}
