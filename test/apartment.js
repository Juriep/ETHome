const {loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers")

const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Apartment Contract Tests", function(){

    async function fixture() {
        
        const [owner, randomUser] = await ethers.getSigners();

        const aptNFT = await ethers.deployContract("apartmentNFT");
        await aptNFT.waitForDeployment();

        const apartment = await ethers.deployContract("Apartment", [aptNFT.target]);
        await apartment.waitForDeployment();


        return {apartment, owner, randomUser};

    }


    it("Should create a new apartment based on the IPFS information provided"
        , async function() 
        {
            
            const {apartment, owner, randomUser} = await loadFixture(fixture);
            
            const tx = await apartment.connect(owner).
            addApartment("QmWxHNvPBRV1hf1zkFoAczMAqiXUMrZaCqiGPH3W17mrwN");

            await tx.wait;

            await expect(tx).to.emit(apartment, "apartmentAdded");
        }
    );

    it("Should read the information of an apartment", async function () {
        
        const {apartment, owner, randomUser} = await loadFixture(fixture);
            
        const tx = await apartment.connect(owner).
        addApartment("QmWxHNvPBRV1hf1zkFoAczMAqiXUMrZaCqiGPH3W17mrwN");

        await tx.wait;

        await expect(tx).to.emit(apartment, "apartmentAdded");

        const apartmentInfo = await apartment.getApartmentInfo(0);
        expect(apartmentInfo.ipfsHash).equal("QmWxHNvPBRV1hf1zkFoAczMAqiXUMrZaCqiGPH3W17mrwN")
        expect(apartmentInfo.aptStatus).equal(0);

    })

    it("should update the apartment information", async function () {

        const {apartment, owner, randomUser} = await loadFixture(fixture);

        const tx = await apartment.connect(owner).addApartment("QmWxHNvPBRV1hf1zkFoAczMAqiXUMrZaCqiGPH3W17mrwN");
        await tx.wait;
        await expect(tx).to.emit(apartment, "apartmentAdded");

        // read apartment nft token id

        const apartmentInfo = await apartment.getApartmentInfo(0);
        
        // A random user try to update the apartment parameters of an apartment which does
        // not belong to him this transaction must be reverted with the error "userNotAuthorized"

        await expect(
            apartment.connect(randomUser).
            updateApartmentParams(0, "QmWxHNvPBRV1hf1zkFoAczMAqiXUMrZaCqiGPH3W17mrwN", 1)
        ).to.be.revertedWithCustomError(apartment, "userNotAuthorized").withArgs(randomUser.address);

        // Try to update an uncreated apartment, this transaction must be reverted with the
        // "apartmetnDoesNotExist" error

        await expect(
            apartment.connect(owner).
            updateApartmentParams(3, "QmWxHNvPBRV1hf1zkFoAczMAqiXUMrZaCqiGPH3W17mrwN", 0)
        ).to.be.revertedWithCustomError(apartment, "apartmetnDoesNotExist").withArgs(3);
       
        // The owner of an apartment wants to update his apartment information, this 
        //transaction must be allow

        const updateApt = await apartment.connect(owner).updateApartmentParams(
            0, "QmWxHNvPBRV1hf1zkFoAczMAqiXUMrZaCqiGPH3W17mrwN", 1
        );
        await updateApt.wait();

        expect(updateApt).to.emit(apartment, "apartmentUpdated").withArgs(
            0, apartmentInfo.nftTokenId, "QmWxHNvPBRV1hf1zkFoAczMAqiXUMrZaCqiGPH3W17mrwN", 1 
        );
    })

});
