// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.8.18;

contract userContract {
    
    mapping (address => user) private users;

    enum role{
        landlords, tenants
    }

    role public userRoles;


    /* Events */

    event userCreated (string memory _name, uint _age, role _userRole, address _userWalletAddress);
    event userDeleted (address userAddress);
    event userUpdated (string memory _name, uint _age, role _userRole, address _userWalletAddress);


    /* Modifiers */

    modifier onlyNewUser (address _userAddr){
        require(users[_userAddr] == address(0), "User already exists!");
        _;
    }

    modifier ifUserExists (address _userAddr)
    {
        require(users[_userAddr] != address(0), "User does not exist");
        _;
    }


    struct user{
        string name;
        uint age;
        string userRole;
        address userWalletAddress;
    }

    function addUser(string memory _name, uint _age, role _userRole, address _userWalletAddress) public onlyNewUser(_userWalletAddress){

        users[_userWalletAddress] = user(_name, _age, _userRole, _userWalletAddress);
        emit userCreated(_name, _age, _userRole, _userWalletAddress);

    }

    function getUsers() public returns(user memory)
    {
        return users;
    }

    function getUserById(address _addr) public ifUserExists(_addr) returns(user memory)
    {
        return users[_addr];
    }

    function updateUserById (string memory _name, uint _age, role _userRole, address _userWalletAddress) public ifUserExists(_userWalletAddress)
    {

        users[_userWalletAddress].name = _name;
        users[_userWalletAddress].age = _age;
        users[_userWalletAddress].userRole = _userRole;
        users[_userWalletAddress].userWalletAddress = _userWalletAddress;

        emit userUpdated(_name, _age, _userRole, _userWalletAddress);

    }

    function deleteUserById(address _addr) ifUserExists(_addr) public
    {
        delete users[_addr];
        emit userDeleted(_addr);
    }

}