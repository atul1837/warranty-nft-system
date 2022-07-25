// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WarrantyCardContract is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    struct WarrantyCard{
        uint product_serial_no; // product serial no
        uint issue_date_time; // Data and time stamp when warranty card was first minted (issue data time of warranty card)
        uint warranty_duration; // warrranty duration in days
        uint no_transfers_allowed; // no of times warranty can be transfered 0 if warranty transfer is not allowed
    }
    
    mapping(uint => WarrantyCard) private _WarrantyCards;

    function _setWarrantyCard(uint _product_serial_no, uint _warranty_duration, uint _no_transfers_allowed, uint256 tokenId) private{
        WarrantyCard memory warranty_card = WarrantyCard({product_serial_no: _product_serial_no, issue_date_time: block.timestamp, warranty_duration: _warranty_duration, no_transfers_allowed: _no_transfers_allowed});
        _WarrantyCards[tokenId]=warranty_card;
    }
    

    function mintWarrantyCard(uint _product_serial_no, uint _warranty_duration, uint _no_transfers_allowed, address to, string memory tokenUri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenUri);
        _setWarrantyCard(_product_serial_no, _warranty_duration, _no_transfers_allowed, tokenId);
    }


    function getWarrantyCardDetails(uint256 tokenId) public view returns(WarrantyCard memory) {
        address owner = ERC721.ownerOf(tokenId);
        require(msg.sender == owner, "Sender not owner of token"); // or the person who minted the warranty in first place
        return _WarrantyCards[tokenId];
    }


    function getWarrantyCardProductSerialNo(uint256 tokenId) public view returns(uint) {
        address owner = ERC721.ownerOf(tokenId);
        require(msg.sender == owner, "Sender not owner of token");
        return _WarrantyCards[tokenId].product_serial_no;
    }


    function getWarrantyCardIssueDateTime(uint256 tokenId) public view returns(uint) {
        address owner = ERC721.ownerOf(tokenId);
        require(msg.sender == owner, "Sender not owner of token");
        return _WarrantyCards[tokenId].issue_date_time;
    }


    function getWarrantyCardWarrantyDuration(uint256 tokenId) public view returns(uint) {
        address owner = ERC721.ownerOf(tokenId);
        require(msg.sender == owner, "Sender not owner of token");
        return _WarrantyCards[tokenId].warranty_duration;
    }
    

    function getWarrantyCardNoOfTransfersAllowed(uint256 tokenId) public view returns(uint) {
        address owner = ERC721.ownerOf(tokenId);
        require(msg.sender == owner, "Sender not owner of token");
        return _WarrantyCards[tokenId].no_transfers_allowed;
    }


    function isWarrantyStillApplicable(uint256 tokenId) public view returns(bool) {
        uint issue_date_time = _WarrantyCards[tokenId].issue_date_time;
        uint warranty_duration = _WarrantyCards[tokenId].warranty_duration * 86400; // warranty duration in seconds for comparison with unix timestamp
        uint current_time = block.timestamp;
        return (issue_date_time+warranty_duration)>current_time ? true : false;
    }


    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
        require(from==address(0) || _WarrantyCards[tokenId].no_transfers_allowed>0, "Transfer not allowed");
    }

    function _afterTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override
    {
        super._afterTokenTransfer(from, to, tokenId);
        if(from != address(0))
            _WarrantyCards[tokenId].no_transfers_allowed = _WarrantyCards[tokenId].no_transfers_allowed - 1;
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        delete _WarrantyCards[tokenId];
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}