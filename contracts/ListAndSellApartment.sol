// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./userContract.sol";
import "./Apartment.sol";
import "./apartmentNFT.sol";

error notTheOwner(address user);
error NotEnoughEther(uint256 eth);
error UserIsNotRegistered(address user);
error apartmentNotFound(uint256 _apartmentID);

contract ListAndSellApartment {
    
    Apartment public apartment;
    userContract public user;
    apartmentNFT public aptNFT;

    address payable public apartmenOwner; 

    constructor(address _aptDeployedAddress, address _aptNFTDeployedAddress)
    {
        apartment = Apartment(_aptDeployedAddress);
        aptNFT = apartmentNFT(_aptNFTDeployedAddress);
        apartmenOwner = payable(msg.sender);
    }

    modifier ifUserExist()
    {
        if(user.checkUserExistance(msg.sender) != true)
            revert UserIsNotRegistered(msg.sender);
        _;
    }

    modifier onlyApartmentOwner(uint256 _apartmentID)
    {
        uint256 nftToken = apartment.getApartmentNftTokenID(_apartmentID);

        if(msg.sender != aptNFT.ownerOf(nftToken))
            revert notTheOwner(msg.sender);
        _;
    }

    modifier checkTransactionPrice(uint256 _apartmentID, uint256 _eth)
    {
        if(apartment.getApartmentEthPrice(_apartmentID) != _eth)
            revert NotEnoughEther(_eth);
        _;
    }

    modifier checkIfApartmentExist(uint256 _apartmentID)
    {
        if(apartment.apartmentExists(_apartmentID) != true)
            revert apartmentNotFound(_apartmentID);
        _;
    }

    function listApartmentForSale(string memory _IPFSHash, uint256 _ethPrice) public ifUserExist()
    {
        apartment.addApartment(_IPFSHash, _ethPrice);
    }

    // When an apartment is listed, the addApartment method emit an event 
    //with the apartment ID, so this ID can be store on chain and at the moment
    // of clicking to buy an apartment on the frontend it must inject the corresponding
    // ID on the callback to pass it to the buyApartment method
    function buyApartment(uint256 _apartmentID) public payable checkIfApartmentExist(_apartmentID)
    checkTransactionPrice(_apartmentID, msg.value)
    {

        uint256 nftToken = apartment.getApartmentNftTokenID(_apartmentID);

        address owner = aptNFT.ownerOf(nftToken);

        // transfer ether to the owner
        payable(owner).transfer(msg.value);

        
    }
    
}