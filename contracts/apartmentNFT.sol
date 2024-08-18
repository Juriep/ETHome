// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract apartmentNFT is ERC721URIStorage {

    uint256 public tokenCounter;

    constructor() ERC721("ApartmentNFT", "APT") {
        tokenCounter = 0; 
    }

    function mintApartmentNFT(address to, string memory tokenURI) public returns (uint256)
    {

        uint256 tokenID = tokenCounter;

        _safeMint(to, tokenID);
        _setTokenURI(tokenID, tokenURI);
        tokenCounter++;

        return tokenID;

    }

    function burnNFT(uint256 _nftTokenID) public
    {
        _burn(_nftTokenID);
    }

}