const {loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers")

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("User contract", function (){

    async function deployUserContractFixture()
    {
        const [user1, user2] = await ethers.getSigners();

        const userCt = await ethers.deployContract("userContract");

        return {userCt, user1, user2};
    }

    it("Should add a new user", async function(){

        const {userCt, user1, user2} = await loadFixture(deployUserContractFixture);

        const tx = await userCt.connect(user1).addUser("Juriep", 25);
        await tx.wait();

        await expect(tx).to.emit(userCt,"NewUserAdded").withArgs(user1.address, "Juriep", 25);

        const userAdded = await userCt.getUser();

        expect(userAdded.userWalletAddress).to.equal(user1.address);
        expect(userAdded.name).to.equal("Juriep");
        expect(userAdded.age).to.equal(25);

    })

})

