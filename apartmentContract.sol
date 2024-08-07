// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.18;

contract apartmentContract {
    
    enum ApartmentState{
        Vacant, Occupied
    }

    // store apartments and find them by their city direction
    mapping (string => Apartment) private apartments;

    event NewApartmentAdded(string _apartmentAddress, string _description, uint _price, ApartmentState _aptState ,address _apartmentOwner);
    event ApartmentDeleted(string _apartmentAddress);
    event ApartmentUpdated(string _apartmentAddress, string _description, uint _price, ApartmentState _aptState ,address _apartmentOwner);
    event ApartmentDirectionChanged(string _oldApartmentAddress, string _newApartmentAdress);

    struct Apartment{
        string apartmentAddress;
        string description;
        uint price;
        ApartmentState aptState;
        address apartmentOwner;
    }

    modifier onlyNewApartment(string memory _apartmentAddress){

        require( bytes(apartments[_apartmentAddress].apartmentAddress).length == 0, "Apartment already exists!");
        _;

    }

    modifier ifApartmentExists(string memory _apartmentAddress) {
        require( bytes(apartments[_apartmentAddress].apartmentAddress).length != 0, "Apartment does not exist!");
        _;
    }

    modifier ifOldApartmentExist(string memory _apartmentAddress){
        require( bytes(apartments[_apartmentAddress].apartmentAddress).length != 0, "Apartment does not exist!");
        _;
    }


    function addApartment(string memory _apartmentAddress, string memory _description, uint _price, ApartmentState _aptState ,address _apartmentOwner) public 
        onlyNewApartment(_apartmentAddress)
    {
        apartments[_apartmentAddress] = Apartment(_apartmentAddress,  _description, _price, _aptState, _apartmentOwner);
        emit NewApartmentAdded(_apartmentAddress,  _description, _price, _aptState, _apartmentOwner);
    }

    function getApartment(string memory _apartmentAddress) public view ifApartmentExists(_apartmentAddress) returns (Apartment memory)
    {
        return apartments[_apartmentAddress];
    }

    function getApartmentState(string memory _apartmentAddress) public view returns (ApartmentState)
    {
        return apartments[_apartmentAddress].aptState;
    }

    function updateApartmentParams(string memory _apartmentAddress, string memory _description, uint _price, ApartmentState _aptState,address _apartmentOwner) public ifApartmentExists(_apartmentAddress)
    {
        apartments[_apartmentAddress].description = _description;
        apartments[_apartmentAddress].price = _price;
        apartments[_apartmentAddress].aptState = _aptState;
        apartments[_apartmentAddress].apartmentOwner = _apartmentOwner;

        emit ApartmentUpdated(_apartmentAddress,  _description, _price, _aptState, _apartmentOwner);
    }

    function updateApartmentDirection(string memory _oldApartmentAddress, string memory _newApartmentAdress) public ifOldApartmentExist(_oldApartmentAddress){
        
        apartments[_newApartmentAdress].apartmentAddress = _newApartmentAdress;
        apartments[_newApartmentAdress].description = apartments[_oldApartmentAddress].description;
        apartments[_newApartmentAdress].price = apartments[_oldApartmentAddress].price;
        apartments[_newApartmentAdress].aptState = apartments[_oldApartmentAddress].aptState;
        apartments[_newApartmentAdress].apartmentOwner = apartments[_oldApartmentAddress].apartmentOwner;

        delete apartments[_oldApartmentAddress];

        emit ApartmentDirectionChanged(_oldApartmentAddress, _newApartmentAdress);
    }
    
    function deleteApartment(string memory _apartmentAddress) public ifApartmentExists(_apartmentAddress)
    {
        delete apartments[_apartmentAddress];
        emit ApartmentDeleted(_apartmentAddress);
    }

}