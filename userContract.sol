// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;


error UserNotFound(address userAddress);
error UserFound(address userAddress);

contract userContract {
    
    mapping (address => User ) private users;

    event NewUserAdded(address userAddress, string name, uint age);
    event UserUpdated(address userAddress, string name, uint age);
    event UserDeleted(address userAddress);
    
    struct User{
        address userWalletAddress;
        string name;
        uint age;
    }

    modifier checkIfUserExist(address userAddress) {
        if(users[userAddress].userWalletAddress == address(0))
            revert UserNotFound(userAddress);
        _;
    }

    modifier onlyNewUser(address userAddress){
        if(users[userAddress].userWalletAddress != address(0))
            revert UserFound(userAddress);
        _;
    }

    function addUser(string memory _name, uint _age) public onlyNewUser(msg.sender)
    {
        require(bytes(_name).length > 0, "The name can not be empty!");
        require(_age >= 18, "Current user does not meet the minimum age required!");

        users[msg.sender] = User(msg.sender, _name, _age);
        emit NewUserAdded(msg.sender, _name, _age);
    }

    function getUser() public view checkIfUserExist(msg.sender) returns (User memory)
    {
        return users[msg.sender];
    }

    function checkUserExistance(address _userWalletAddress) public view returns (bool)
    {
        if(users[_userWalletAddress].userWalletAddress != address(0))
            return true;
        else
            return false;
    }

    function updateUser(string memory _name, uint _age) public checkIfUserExist(msg.sender)
    {

        require(bytes(_name).length > 0, "The name can not be empty!");
        require(_age >= 18, "Current user does not meet the minimum age required!");

        users[msg.sender].name = _name;
        users[msg.sender].age = _age;

        emit UserUpdated(msg.sender, _name, _age);
    }

    function deleteUser() public checkIfUserExist(msg.sender)
    {
        delete users[msg.sender];
        emit UserDeleted(msg.sender);
    }

}