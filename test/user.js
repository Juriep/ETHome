const {loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers")

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("User contract", function (){

    async function deployUserContractFixture()
    {
        const [user1, user2] = await ethers.getSigners();

        const userCt = await ethers.deployContract("userContract");

        await userCt.waitForDeployment();

        return {userCt, user1, user2};
    }

    it("Should add a new user and check if it was succesfully stored", async function(){

        const {userCt, user1, user2} = await loadFixture(deployUserContractFixture);

        const tx = await userCt.connect(user1).addUser("Juriep", 25);
        await tx.wait();

        await expect(tx).to.emit(userCt,"NewUserAdded").withArgs(user1.address, "Juriep", 25);

        const userAdded = await userCt.getUser();

        expect(userAdded.userWalletAddress).to.equal(user1.address);
        expect(userAdded.name).to.equal("Juriep");
        expect(userAdded.age).to.equal(25);
    });

    it("Should revert if user tries to register again", async function(){

        const {userCt, user1, user2} = await loadFixture(deployUserContractFixture);

        // first add a new user:

        const tx = await userCt.connect(user1).addUser("Juriep",25);
        await tx.wait();

        await expect(
            userCt.connect(user1).addUser("Sebas",27)
        ).to.be.revertedWithCustomError(userCt, "UserFound").withArgs(user1.address);
    });

    it("Should revert if user is not registered", async function(){

        const {userCt, user1, user2} = await loadFixture(deployUserContractFixture);
        
        await expect(
           userCt.connect(user1).getUser()   
        ).to.be.revertedWithCustomError(userCt, "UserNotFound").withArgs(user1.address)
        
    });

    it("should update an existing user", async function(){

        const {userCt, user1, user2} = await loadFixture(deployUserContractFixture);

        // add user

        const tx = await userCt.connect(user1).addUser("Sebas", 28);
        await tx.wait();

        await expect(tx).to.emit(userCt, "NewUserAdded").withArgs(user1.address,"Sebas",28);

        // update user

        const secondTx = await userCt.connect(user1).updateUser("Juriep",24);
        await secondTx.wait();

        await expect(secondTx).to.emit(userCt, "UserUpdated").withArgs(user1.address, "Juriep",24);

        // get user information to see if the update function works

        const updatedUser = await userCt.connect(user1).getUser()
        expect(updatedUser.userWalletAddress).to.equal(user1.address);
        expect(updatedUser.name).to.equal("Juriep");
        expect(updatedUser.age).to.equal(24);

    });

    it("Should revert when updating a user which is not register", async function(){

       const {userCt, user1, user2} = await loadFixture(deployUserContractFixture);

        await expect(
            userCt.connect(user1).updateUser("Martha", 67)
        ).to.be.revertedWithCustomError(userCt, "UserNotFound").withArgs(user1.address);
    });

    it("Should delete an existing user", async function(){

        const {userCt, user1, user2} = await loadFixture(deployUserContractFixture);

        // add user

        const tx = await userCt.connect(user1).addUser("Oknatip", 60);
        await tx.wait();

        await expect(tx).to.emit(userCt, "NewUserAdded").withArgs(user1.address, "Oknatip", 60);

        // get user to check if added succesfully

        const userCreated = await userCt.getUser();

        expect(userCreated.userWalletAddress).to.equal(user1.address);
        expect(userCreated.name).to.equal("Oknatip");
        expect(userCreated.age).to.equal(60);

        // delete user

        const deleteTx = await userCt.connect(user1).deleteUser();
        await deleteTx.wait();

        expect(deleteTx).to.emit(userCt, "UserDeleted").withArgs(user1.address);

        // validate user is deleted

        expect(
            userCt.connect(user1).getUser()
        ).to.be.revertedWithCustomError(userCt, "UserNotFound").withArgs(user1.address);

    });

    it("Should check if user is registered", async function(){

        const {userCt, user1, user2} = await loadFixture(deployUserContractFixture);

        // add user

        const tx = await userCt.connect(user1).addUser("Oknatip", 60);
        await tx.wait();

        await expect(tx).to.emit(userCt, "NewUserAdded").withArgs(user1.address, "Oknatip", 60);

        // check if user exist

        expect(
            await userCt.connect(user1).checkUserExistance(user1.address)
        ).to.equal(true);

        expect(
            await userCt.connect(user2).checkUserExistance(user2.address)
        ).to.equal(false);

    })
})

