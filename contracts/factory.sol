// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./warranty.sol";


contract WarrantyFactory {

    mapping(address => WarrantyCardContract) public deployedContracts;
    address[] public ownersAddress;

    function createNewWarrantyContract(string memory name, string memory symbol) public returns(WarrantyCardContract) {
        WarrantyCardContract wc_contract = new WarrantyCardContract(name, symbol, msg.sender);
        deployedContracts[msg.sender] = wc_contract;
        ownersAddress.push(msg.sender);
        return wc_contract;
    }

    function getcontractofowner() public view returns(WarrantyCardContract) {
        return deployedContracts[msg.sender];
    }

    function getTotalContracts() public view returns(uint) {
        return ownersAddress.length;
    }

    function getDeployedContractDetails(address addr) public view returns(WarrantyCardContract, string memory, string memory) {
        WarrantyCardContract wc_contract = deployedContracts[addr];
        return (wc_contract, wc_contract.name(), wc_contract.symbol());
    }

}