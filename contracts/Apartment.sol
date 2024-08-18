// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "./apartmentNFT.sol";

error apartmetnDoesNotExist(uint256 apartmentID);
error userNotAuthorized(address _user);

contract Apartment {

    event apartmentAdded(uint256 apartmentID, uint256 nftTokenID, string ipfsHash, apartmentStatus aptStatus);
    event apartmentUpdated(uint256 apartmentID, uint256 nftTokenId, string ipfsHash, apartmentStatus aptStatus);
    event apartmentDeleted(uint256 ntfTokenID, uint256 apartmentId);

    enum apartmentStatus{
        Vacant, Occupied
    }

    struct apartmentInfo
    {
        string ipfsHash; // CID pointing to the apartment data on IPFS
        uint256 nftTokenId;
        apartmentStatus aptStatus;
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

    function addApartment(string memory _ipfsHash) public
    {
        uint256 newApartmentID = apartmentCounter;

        // mint an NFT for this new apartment

        uint256 nftTokenId = aptNFT.mintApartmentNFT(msg.sender, _ipfsHash);

        // store apartment info with IPFS and nftTokenID

        apartments[newApartmentID] = apartmentInfo(_ipfsHash, nftTokenId, apartmentStatus.Vacant);

        apartmentCounter++;

        emit apartmentAdded(newApartmentID, nftTokenId, _ipfsHash, apartmentStatus.Vacant);
    }

    function getApartmentInfo(uint256 _apartmentID) public view
    checkApartmentExistance(_apartmentID) returns (apartmentInfo memory)
    {
        return apartments[_apartmentID];
    }

    function updateApartmentParams(uint256 _apartmentID, string memory _newIpfsHash, 
    apartmentStatus _aptStatus)
    public checkApartmentExistance(_apartmentID) onlyOwner(_apartmentID)
    {
        apartments[_apartmentID].ipfsHash = _newIpfsHash;
        apartments[_apartmentID].aptStatus = _aptStatus;

        emit apartmentUpdated(_apartmentID, apartments[_apartmentID].nftTokenId,
        _newIpfsHash, _aptStatus);
    }

    function deleteApartment(uint256 _apartmentID) public checkApartmentExistance(_apartmentID)
    onlyOwner(_apartmentID)
    {
        aptNFT.burnNFT(apartments[_apartmentID].nftTokenId);
        emit apartmentDeleted(apartments[_apartmentID].nftTokenId, _apartmentID);
        delete apartments[_apartmentID]; 
    }
}