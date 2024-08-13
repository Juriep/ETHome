const {loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers")

const {expect} = require("chai");
const {ethers} = require("hardhat");
const { BigNumber } = ethers;

describe("List and Sell apartment contract tests", function(){

        async function fixture()
        {
            const user = await ethers.deployContract("userContract");
            await user.waitForDeployment();

            const apartment = await ethers.deployContract("apartmentContract");
            await apartment.waitForDeployment();

            const listAndSell = await ethers.deployContract(
                "ListAndSellApartment",[user.target, apartment.target]
            );
            await listAndSell.waitForDeployment();

            const [owner, randomUser] = await ethers.getSigners();

            return {listAndSell, user, apartment,owner, randomUser};
        }

        it("Should create a new apartment for an specific user, and delete it if"
            + " the owner wants to", async function(){

            const {listAndSell, user, apartment, owner, randomUser} = await loadFixture(fixture);

            // create a new user

            const tx = await user.connect(owner).addUser("Juriep",18);
            await tx.wait();

            expect(tx).to.emit(user, "NewUserAdded").withArgs(owner.address, "Juriep", 18);

            // now that the user is created it can list an apartment for sale

            const listApt = await listAndSell.connect(owner).listAnApartment("Milan 170",
                 "Apartment 2 rooms", 200);

            await listApt.wait();

            expect(listApt).to.emit(listAndSell, "apartmentOwnershipAdded").
                                                    withArgs("Milan 170", owner.address);
            

            // now let's delete the created apartment

            // first let's try to delete it from a user which is not the owner
            // this operation should be reverted
            
            const randU = await user.connect(randomUser).addUser("Julio",18);
            await randU.wait();

            expect(randU).to.emit(user, "NewUserAdded").withArgs(randomUser.address, "Julio", 18);

            await expect(
                listAndSell.connect(randomUser).deleteApartment("Milan 170")
            ).to.be.revertedWithCustomError(listAndSell, "notTheOwner").withArgs(randomUser.address);

            // now lets delete it using the owner address

            expect(
                listAndSell.connect(owner).deleteApartment("Milan 170")
            ).to.emit(apartment, "ApartmentDeleted").withArgs("Milan 170");

        })

        it("Should assign an apartment to the new owner who bought it "
            + "price and ether provider must be checked in order to transfer the ownership"
            + " of the apartment to the person who wants to buy it", async function(){

            const {listAndSell, user, apartment, owner, randomUser} = await loadFixture(fixture);
            
            // create a new user

            const tx = await user.connect(owner).addUser("Juriep",18);
            await tx.wait();

            expect(tx).to.emit(user, "NewUserAdded").withArgs(owner.address, "Juriep", 18);

            // now that the user is created it can list an apartment for sale

            const listApt = await listAndSell.connect(owner).listAnApartment("Milan 170","Apartment 2 rooms", ethers.parseEther("200"));
            await listApt.wait();

            expect(listApt).to.emit(listAndSell, "apartmentOwnershipAdded").withArgs("Milan 170", owner.address);
            
            // now lets create a random user
            
            const randU = await user.connect(randomUser).addUser("Julio",18);
            await randU.wait();

            expect(randU).to.emit(user, "NewUserAdded").withArgs(randomUser.address, "Julio", 18);

            // now lets buy the apartment

            await expect(
                listAndSell.connect(randomUser).BuyApartment("Milan 170", { value: ethers.parseEther("199") })
            ).to.be.revertedWithCustomError(listAndSell, "NotEnoughEther").withArgs(ethers.parseEther("199"));
    
            const buyApartmentTx = await listAndSell.connect(randomUser).BuyApartment("Milan 170", {value: ethers.parseEther("200")});
            await buyApartmentTx.wait();
            expect(buyApartmentTx).to.emit(listAndSell, "apartmentBought").withArgs("Milan 170", randomUser.address);

            expect(
                await apartment.getApartmentOwner("Milan 170")
            ).to.equal(randomUser.address);

        })

})