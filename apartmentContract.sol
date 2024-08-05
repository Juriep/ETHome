// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.18;

contract apartmentContract {
    
    enum ApartmentState{
        Vacant, Occupied
    }

    // store apartments and find them by their city direction
    mapping (string => Apartment) private apartments;

    event NewApartmentAdded(string _apartmentDirection, string _description, uint _ethPrice, ApartmentState _aptState ,address _apartmentOwner);
    event ApartmentDeleted(string _apartmentDirection);
    event ApartmentUpdated(string _apartmentDirection, string _description, uint _ethPrice, ApartmentState _aptState ,address _apartmentOwner);
    
    struct Apartment{
        string apartmentDirection;
        string description;
        uint ethPrice;
        ApartmentState aptState;
        address apartmentOwner;
    }

    modifier onlyNewApartment(string memory _apartmentDirection){

        require( bytes(apartments[_apartmentDirection].apartmentDirection).length == 0, "Apartment already exists!");
        _;

    }

    modifier ifApartmentExists(string memory _apartmentDirection) {
        require( bytes(apartments[_apartmentDirection].apartmentDirection).length != 0, "Apartment does not exist!");
        _;
    }


    function addApartment(string memory _apartmentDirection, string memory _description, uint _ethPrice, ApartmentState _aptState ,address _apartmentOwner) public 
        onlyNewApartment(_apartmentDirection)
    {
        apartments[_apartmentDirection] = Apartment(_apartmentDirection,  _description, _ethPrice, _aptState, _apartmentOwner);
        emit NewApartmentAdded(_apartmentDirection,  _description, _ethPrice, _aptState, _apartmentOwner);
    }

    function getApartment(string memory _apartmentDirection) public view ifApartmentExists(_apartmentDirection) returns (Apartment memory)
    {
        return apartments[_apartmentDirection];
    }

    function updateApartmentParams(string memory _apartmentDirection, string memory _description, uint _ethPrice, ApartmentState _aptState,address _apartmentOwner) public ifApartmentExists(_apartmentDirection)
    {
        apartments[_apartmentDirection].description = _description;
        apartments[_apartmentDirection].ethPrice = _ethPrice;
        apartments[_apartmentDirection].aptState = _aptState;
        apartments[_apartmentDirection].apartmentOwner = _apartmentOwner;

        emit ApartmentUpdated(_apartmentDirection,  _description, _ethPrice, _aptState, _apartmentOwner);
    }

    function deleteApartment(string memory _apartmentDirection) ifApartmentExists(_apartmentDirection)
    {
        delete apartments[_apartmentDirection];
        emit ApartmentDeleted(_apartmentDirection);
    }

}