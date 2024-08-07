// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;

import "./apartmentContract.sol";
import "./userContract.sol";

contract ListOrRentOrSellApartment {
    
    userContract private user;
    apartmentContract private apartment;

    event apartmentOwnershipAdded(string _apartmentAddress, address _owner);

    constructor(address _deployedUserContractAddess, address _deployedApartmentContractAddress) {
        user = userContract(_deployedUserContractAddess);
        apartment = apartmentContract(_deployedApartmentContractAddress);
    }

    modifier onlyIfApartmentIsVacant (string memory _apartmentAddress){
        require(apartment.getApartmentState(_apartmentAddress) == apartment.ApartmentState.Vacant, "Sorry this apartment is not available at the moment!");
        _;
    }

    modifier onlyIfApartmentExists(string memory _apartmentAddress)
    {
        require(bytes(apartment[_apartmentAddress]).length != 0, "The apartment is not created!");
        _;
    }

    modifier onlyIfUserExists(address _userWalletAddress)
    {
        require(user.checkUserExistance() == true, "To perform this action u need to sign up first!");
        _;
    }

    function listAnApartment(string memory _apartmentAddress, string memory _description, uint _price, ApartmentState _aptState ,msg.sender) public onlyIfUserExists(msg.sender)
    {
        apartment.addApartment(_apartmentAddress,  _description, _price, _aptState, msg.sender);
        emit apartmentOwnershipAdded(_apartmentAddress, msg.sender);
    }

    function rentApartment(string memory _apartmentAddress) public onlyIfApartmentIsVacant(_apartmentAddress) onlyIfApartmentExists(_apartmentAddress)
    {
        

    }
    

    
}