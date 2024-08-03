// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.8.18;

error noUserFoud(address addr);
error userAlreadyCreated(address addr);

contract userContract {
    
    mapping (address => user) private users;

    enum role{
        landlords, tenants
    }

    role public userRoles;


    /* Events */

    event userCreated (string _name, uint _age, role _userRole, address _userWalletAddress);
    event userDeleted (address userAddress);
    event userUpdated (string _name, uint _age, role _userRole, address _userWalletAddress);


    /* Modifiers */

    modifier onlyNewUser (address _userAddr){
        
        if(users[_userAddr].userWalletAddress != address(0))
        {
            revert userAlreadyCreated(_userAddr);
        }
        _;
    }

    modifier ifUserExists (address _userAddr)
    {
        if(users[_userAddr].userWalletAddress == address(0)){
            revert noUserFoud(_userAddr);
        }
        _;
    }


    struct user{
        string name;
        uint age;
        role userRole;
        address userWalletAddress;
    }

    function addUser(string memory _name, uint _age, role _userRole, address _userWalletAddress) public onlyNewUser(_userWalletAddress){

        users[_userWalletAddress] = user(_name, _age, _userRole, _userWalletAddress);
        emit userCreated(_name, _age, _userRole, _userWalletAddress);

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