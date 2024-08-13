// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;

import "./apartmentContract.sol";
import "./userContract.sol";

error notTheOwner(address user);
error NotEnoughEther(uint256 eth);

contract ListAndSellApartment {
    
    userContract private user;
    apartmentContract private apartment;

    event apartmentOwnershipAdded(string _apartmentAddress, address _owner);
    event apartmentBought(string _apartmentAddress, address newOwner);

    constructor(address _deployedUserContractAddess, address _deployedApartmentContractAddress) {
        user = userContract(_deployedUserContractAddess);
        apartment = apartmentContract(_deployedApartmentContractAddress);
    }

    modifier onlyIfApartmentIsVacant (string memory _apartmentAddress){
        require(apartment.isApartmentVacant(_apartmentAddress) == true, "Sorry this apartment is not available at the moment!");
        _;
    }

    modifier onlyIfApartmentExists(string memory _apartmentAddress)
    {
        require(apartment.searchIfApartmentExists(_apartmentAddress) == true, "The apartment is not created!");
        _;
    }

    modifier onlyIfUserExists(address _userWalletAddress)
    {
        require(user.checkUserExistance(msg.sender) == true, "To perform this action u need to sign up first!");
        _;
    }

    modifier onlyOwner(address _user, string memory _apartmentAddress)
    {
        if(apartment.getApartmentOwner(_apartmentAddress) != _user)
            revert notTheOwner(_user);
        _;
    }

    modifier ifPriceIsCorrect(string memory _apartmentAddress, uint256 _price)
    {
        if(apartment.getApartmentPrice(_apartmentAddress) != _price)
            revert NotEnoughEther(_price);
        _;
    }

    function listAnApartment(string memory _apartmentAddress, string memory _description, uint256 _price) public onlyIfUserExists(msg.sender)
    {
        apartment.addApartment(_apartmentAddress,  _description, _price,  msg.sender);
        emit apartmentOwnershipAdded(_apartmentAddress, msg.sender);
    }

    function deleteApartment(string memory _apartmentAddress) public onlyOwner(msg.sender, _apartmentAddress)  {
        apartment.deleteApartment(_apartmentAddress);
    }

    function BuyApartment(string memory _apartmentAddress) public payable onlyIfApartmentExists(_apartmentAddress)
     onlyIfApartmentIsVacant(_apartmentAddress) ifPriceIsCorrect(_apartmentAddress, msg.value)
    {
        
        address payable oldOwner = payable(apartment.getApartmentOwner(_apartmentAddress));
        
        oldOwner.transfer(msg.value);

        apartment.changeAparmentOwner(_apartmentAddress, msg.sender);

        emit apartmentBought(_apartmentAddress, msg.sender);
    }
    
}