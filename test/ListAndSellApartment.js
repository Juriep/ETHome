const {loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers")

const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("List and sell apartment contract tests", function(){

    async function fixture()
    {

        const aptNFT = await ethers.deployContract("apartmentNFT");
        await aptNFT.waitForDeployment();

        const apartment = await ethers.deployContract("Apartment", [aptNFT.target]);
        await apartment.waitForDeployment();

        const user = await ethers.deployContract("userContract");
        await user.waitForDeployment();

        const listAndSellApartment = await ethers.deployContract("ListAndSellApartment", [
            apartment.target, aptNFT.target, user.target
        ]);
        await listAndSellApartment.waitForDeployment();


        const [owner, randomUser] = await ethers.getSigners();

        return {listAndSellApartment, apartment, aptNFT, user, owner, randomUser};

    }

    it("Should list an apartment for sell if user is registered", async function(){

        const {listAndSellApartment, apartment, aptNFT, user, owner, randomUser} = await loadFixture(fixture);

        // First the user must register into the Dapp

        const userRegistrationTx = await user.connect(owner).addUser("Juriep", 25);
        await userRegistrationTx.wait();

        await expect(userRegistrationTx).to.emit(user, "NewUserAdded").withArgs(
            owner.address, "Juriep", 25
        );

        // now lets list an apartment for the registered user

        const apartmentListingTx = await listAndSellApartment.connect(owner).listApartmentForSale(
            "QmWxHNvPBRV1hf1zkFoAczMAqiXUMrZaCqiGPH3W17mrwN", ethers.parseEther("150")
        );
        await apartmentListingTx.wait();

        await expect(apartmentListingTx).to.emit(apartment, "apartmentAdded");        

        // now a random user tries to list an apartment
        // transaction mus be rejected

        await expect(
            listAndSellApartment.connect(randomUser).listApartmentForSale(
                "QmWxHNvPBRV1hf1zkFoAczMAqiXUMrZaCqiGPH3W17mrwN", ethers.parseEther("100")
            )
        ).to.be.revertedWithCustomError(listAndSellApartment, "UserIsNotRegistered").
        withArgs(randomUser.address);

    });

    it("A user wants to buy a listed apartment", async function(){

        const {listAndSellApartment, apartment, aptNFT, user, owner, randomUser} = await loadFixture(fixture);

        // First the owner of the apartment must register into the Dapp
        // in order to list the apartement he wants to sell

        const userRegistrationTx = await user.connect(owner).addUser("Juriep", 25);
        await userRegistrationTx.wait();

        await expect(userRegistrationTx).to.emit(user, "NewUserAdded").withArgs(
            owner.address, "Juriep", 25
        );

        // now lets list an apartment for the registered user

        const apartmentListingTx = await listAndSellApartment.connect(owner).listApartmentForSale(
            "QmWxHNvPBRV1hf1zkFoAczMAqiXUMrZaCqiGPH3W17mrwN", ethers.parseEther("150")
        );
        await apartmentListingTx.wait();

        await expect(apartmentListingTx).to.emit(apartment, "apartmentAdded");

        // Then the user must approve the contract to transfer the NFT whenever a new
        // for it to be tranfer to a buyer whenever him/her arrives
        
        const nftTokenId = await apartment.getApartmentNftTokenID(0);

        await aptNFT.connect(owner).approve(listAndSellApartment.target, nftTokenId);


        // Now the random user who wants to buy the apartment created above must be
        // registered too, otherwise the buy transaction will be reverted

        // Try to buy an apartment with an unregistered user:

        await expect(
            listAndSellApartment.connect(randomUser).buyApartment(0, { value: ethers.parseEther("150") })
        ).to.be.revertedWithCustomError(listAndSellApartment, "UserIsNotRegistered").
        withArgs(randomUser.address);

        // Now lets registered the random user and buy the apartment

        const randomUserRegistrationTx = await user.connect(randomUser).addUser("Oknatip", 27);
        await randomUserRegistrationTx.wait();

        await expect(randomUserRegistrationTx).to.emit(user, "NewUserAdded").withArgs(
            randomUser.address, "Oknatip", 27
        );

        // try to buy the apartment with less ether than the amount required
        // transaction must be reverted

        await expect(
            listAndSellApartment.connect(randomUser).buyApartment(0, { value: ethers.parseEther("149")})
        ).to.be.revertedWithCustomError(listAndSellApartment, "NotEnoughEther").withArgs(ethers.parseEther("149"));

        // Now lets buy the apartment

        const buyApartmentTx = await listAndSellApartment.connect(randomUser).buyApartment(
            0, { value: ethers.parseEther("150") }
        );
        await buyApartmentTx.wait();  
    
        await expect(buyApartmentTx).to.emit(listAndSellApartment, "ApartmentBought").withArgs(
            0, randomUser.address
        );

        // check apartment owner, should be the address of the random user       

        const nftOwner = aptNFT.getNftOwner(nftTokenId);

        expect(
            await nftOwner
        ).to.be.equal(randomUser.address);


    });

    it("Should delete an apartment", async function(){

        const {listAndSellApartment, apartment, aptNFT, user, owner, randomUser} = await loadFixture(fixture);

        // First the owner of the apartment must register into the Dapp
        // in order to list the apartement he wants to sell

        const userTx = await user.connect(owner).addUser("Juriep", 25);
        await userTx.wait();

        await expect(userTx).to.emit(user, "NewUserAdded").withArgs(
            owner.address, "Juriep", 25
        );

        // now lets list an apartment for the registered user

        const aptListingTx = await listAndSellApartment.connect(owner).listApartmentForSale(
            "QmWxHNvPBRV1hf1zkFoAczMAqiXUMrZaCqiGPH3W17mrwN", ethers.parseEther("150")
        );
        await aptListingTx.wait();

        await expect(aptListingTx).to.emit(apartment, "apartmentAdded");
     
        // Now lets registered the random user and buy the apartment

        const randUserTx = await user.connect(randomUser).addUser("Oknatip", 27);
        await randUserTx.wait();

        await expect(randUserTx).to.emit(user, "NewUserAdded").withArgs(
            randomUser.address, "Oknatip", 27
        );

        // Random user tries to delete apartment, this transaction must be reverted

        await expect(
            listAndSellApartment.connect(randomUser).removeApartment(0)
        ).to.be.revertedWith("The contract is not authorized to burn the NFT");

        // Before deleting the apartment, the user must approve the contract to
        // execure this task
    
        const nftTokenId = await apartment.getApartmentNftTokenID(0);
        await aptNFT.connect(owner).approve(apartment.target, nftTokenId);

        // Now the owner delete the apartment listed before

        const deleteAptTx = await listAndSellApartment.connect(owner).removeApartment(0);
        await deleteAptTx.wait();

        expect(deleteAptTx).to.emit(listAndSellApartment, "apartmentRemoved").withArgs(0);

    })

})