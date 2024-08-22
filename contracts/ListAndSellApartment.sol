// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./userContract.sol";
import "./Apartment.sol";
import "./apartmentNFT.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

error notTheOwner(address user);
error NotEnoughEther(uint256 eth);
error UserIsNotRegistered(address user);
error apartmentNotFound(uint256 _apartmentID);

contract ListAndSellApartment is IERC721Receiver{
    
    Apartment public apartment;
    userContract public user;
    apartmentNFT public aptNFT;

    address payable public apartmenOwner; 

    event ApartmentBought(uint256 apartmentID, address newOwner);
    event NFTReceived(address from, address to, uint256 tokenId, bytes data);
    event FallbackCalled(address sender, uint256 value, bytes data);
    event EtherReceived(address sender, uint256 value);

    constructor(address _aptDeployedAddress, address _aptNFTDeployedAddress, address _userDeployedAddress)
    {
        apartment = Apartment(_aptDeployedAddress);
        aptNFT = apartmentNFT(_aptNFTDeployedAddress);
        user = userContract(_userDeployedAddress);
        apartmenOwner = payable(msg.sender);
    }

    modifier ifUserExist()
    {   
        bool userExist = user.checkUserExistance(msg.sender); 
        if(userExist == false)
            revert UserIsNotRegistered(msg.sender);
        _;  
    }

    modifier onlyOwner(uint256 _apartmentID)
    {
        if(apartment.apartmentOwner(_apartmentID) != msg.sender)
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

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
            emit NFTReceived(from, operator, tokenId, data);
            // Return the selector to confirm receipt
            return this.onERC721Received.selector;
    }

    function listApartmentForSale(string memory _IPFSHash, uint256 _ethPrice) external ifUserExist()
    {
        
        apartment.addApartment(_IPFSHash, _ethPrice);

        aptNFT.setApprovalForAll(address(this), true);

    }

    // When an apartment is listed, the addApartment method emit an event 
    //with the apartment ID, so this ID can be store on chain and at the moment
    // of clicking to buy an apartment on the frontend it must inject the corresponding
    // ID on the callback to pass it to the buyApartment method
    function buyApartment(uint256 _apartmentID) external payable ifUserExist()
    checkIfApartmentExist(_apartmentID) checkTransactionPrice(_apartmentID, msg.value) 
    {

        uint256 nftToken = apartment.getApartmentNftTokenID(_apartmentID);

        address owner = aptNFT.getNftOwner(nftToken);

        aptNFT.approve(msg.sender, nftToken);

        aptNFT.transferFrom(owner, msg.sender, nftToken);

        payable(owner).transfer(msg.value);

        emit ApartmentBought(_apartmentID, msg.sender);
        
    }

    function removeApartment(uint256 _apartmentID) public ifUserExist()
    onlyOwner(_apartmentID)
    {
        apartment.deleteApartment(_apartmentID);
    }

    // Fallback function to handle unrecognized function calls
    fallback() external payable {
        // Log the fallback call
        emit FallbackCalled(msg.sender, msg.value, msg.data);
        // Optionally, revert the transaction
        revert("Fallback function called: Unrecognized function selector or data.");
    }

    // Receive function to handle plain Ether transfers
    receive() external payable {
        // Log the Ether received
        emit EtherReceived(msg.sender, msg.value);
    }
    
}