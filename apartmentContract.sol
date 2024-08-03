// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >0.8.18;

error ownerAccess(address userToConnect);
error noUserFound(address userNotFound);

contract apartmentContract {
    
    address payable public apartmentOwner;
    mapping (address => apartment) private apartmentsOwnedByUser;


    event newApartmentAdded(address _user, string  _country, string  _city, string  _cityAddress, uint _price, string  _description);
    event apartmentsOwnedConsulted(address user);

    struct apartment{
        string country;
        string city;
        string cityAddress;
        uint price;
        string description;
        address userAddress;
    }
    
    constructor() {
        
        apartmentOwner = payable(msg.sender);

    }

    modifier onlyOwner(address addr){
        if(apartmentOwner != addr)
        {
            revert ownerAccess({ userToConnect: addr });
        }
        _;
    }

    modifier ifUserExists(address addr)
    {
        if(apartmentsOwnedByUser[addr].userAddress == address(0))
        {
            revert noUserFound({userNotFound: addr});
        }
        _;
    }

    function addApartment(string memory _country, string memory _city, string memory _cityAddress, uint _price, string memory _description) public
    {
        apartmentsOwnedByUser[msg.sender] = apartment(_country, _city, _cityAddress, _price, _description, msg.sender);
        emit newApartmentAdded(msg.sender, _country, _city, _cityAddress, _price, _description);

    }

    function getUserApartmens(address _userAddress) public view ifUserExists(_userAddress) returns (apartment memory)
    {
        return apartmentsOwnedByUser[_userAddress];
    }

    

}