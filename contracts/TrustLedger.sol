// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/**
 * @title Budget Contract
 * @author Adefolabi
 * @dev This contract manages a budget with functionalities to set, get, and update.
 */
contract budget {
    // type declaration
    enum requestState {
        PENDING,
        APROVED,
        REJECTED
    }
    struct request {
         uint256 id;
    address requester;   // who submitted
    string purpose;      // why money is needed
    address recipient;   // who gets paid
    uint256 amount;      // how much
    bool approved;       // status
    bool rejected;
    }
    // state variable
    mapping(address => bool) public isAdmin;
    address[] public adminList;

    // functions
    function submitRequest() external {}
    function approveRequest() external {}
    function rejectRequest() external{}
    // getters
    function getAdmins() pure view returns(a)
}
