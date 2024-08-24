// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "./apartmentNFT.sol";


error apartmetnDoesNotExist(uint256 apartmentID);
error userNotAuthorized(address _user);

contract Apartment{

    event apartmentAdded(uint256 apartmentID, uint256 nftTokenID, string ipfsHash, address owner, uint256 ethPrice);
    event apartmentUpdated(uint256 apartmentID, uint256 nftTokenId, string ipfsHash, uint256 ethPrice);
    event apartmentDeleted(uint256 ntfTokenID, uint256 apartmentId);
    
    enum apartmentStatus{
        Vacant, Occupied
    }

    struct apartmentInfo
    {
        string ipfsHash; // CID pointing to the apartment data on IPFS
        uint256 nftTokenId;
        address owner;
        uint256 ethPrice;
    }

    apartmentNFT public aptNFT;
    mapping (uint256 => apartmentInfo) public apartments;
    uint256 public apartmentCounter = 0;

    // the constructor receive the apartmentNFT deploy address
    constructor(address apartmentNFTDeployedAddress) {
        aptNFT = apartmentNFT(apartmentNFTDeployedAddress); 
    }

    modifier checkApartmentExistance(uint256 apartmentID){
        if (apartmentID >= apartmentCounter)
            revert apartmetnDoesNotExist(apartmentID);
        _;
    }

    modifier onlyOwner(uint256 apartmentId)
    {
        if(aptNFT.ownerOf(apartments[apartmentId].nftTokenId) != msg.sender)
            revert userNotAuthorized(msg.sender);
        _;
    }

    function apartmentOwner(uint256 _apartmentID) public view checkApartmentExistance(_apartmentID)
    returns (address) 
    {
        return apartments[_apartmentID].owner;
    }

    function apartmentExists(uint256 _apartmentID) public view returns (bool)
    {
        if(apartments[_apartmentID].owner != address(0))
            return true;
        else
            return false;
    }

    function getApartmentNftTokenID(uint256 _apartmentID) public view returns(uint256)
    {
        return apartments[_apartmentID].nftTokenId;
    }

    function getApartmentEthPrice(uint256 _apartmentID) public view returns(uint256)
    {
        return apartments[_apartmentID].ethPrice;
    }

    function addApartment(string memory _ipfsHash, uint256 _ethPrice, address _owner) public
    {
        uint256 newApartmentID = apartmentCounter;

        // mint an NFT for this new apartment

        uint256 nftTokenId = aptNFT.mintApartmentNFT(_owner, _ipfsHash);

        // store apartment info with IPFS and nftTokenID

        apartments[newApartmentID] = apartmentInfo(_ipfsHash, nftTokenId, _owner, _ethPrice);

        apartmentCounter++;

        emit apartmentAdded(newApartmentID, nftTokenId, _ipfsHash, _owner, _ethPrice);

    }

    function getApartmentInfo(uint256 _apartmentID) public view
    checkApartmentExistance(_apartmentID) returns (apartmentInfo memory)
    {
        return apartments[_apartmentID];
    }

    function updateApartmentParams(uint256 _apartmentID, string memory _newIpfsHash, uint256 _ethPrice)
    public checkApartmentExistance(_apartmentID) onlyOwner(_apartmentID)
    {
        apartments[_apartmentID].ipfsHash = _newIpfsHash;
        emit apartmentUpdated(_apartmentID, apartments[_apartmentID].nftTokenId,
        _newIpfsHash, _ethPrice);
    }

    function deleteApartment(uint256 _apartmentID) public checkApartmentExistance(_apartmentID)
    {

        uint256 nftToken = apartments[_apartmentID].nftTokenId;

        // **Check if this contract has approval to burn the NFT**
        require(
            aptNFT.getApproved(nftToken) == address(this),
            "The contract is not authorized to burn the NFT"
        );

        aptNFT.burnNFT(apartments[_apartmentID].nftTokenId);
        emit apartmentDeleted(apartments[_apartmentID].nftTokenId, _apartmentID);
        delete apartments[_apartmentID]; 
    }
}