// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./warranty.sol";


contract WarrantyFactory {

    mapping(address => WarrantyCardContract) private _deployedContracts;

    function createNewWarrantyContract(string memory name, string memory symbol) public returns(WarrantyCardContract) {
        WarrantyCardContract wc_contract = new WarrantyCardContract(name, symbol, msg.sender);
        _deployedContracts[msg.sender] = wc_contract;
        return wc_contract;
    }

    function getcontractofowner() public view returns(WarrantyCardContract) {
        return _deployedContracts[msg.sender];
    }

    // get all warranty card contract addr

}