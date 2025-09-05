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
    // state variable
    mapping(address => bool) public isAdmin;
    address[] public adminList;

    // functions
    // getters
}
