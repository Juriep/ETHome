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
            addApartment("IPFS HASH");

            await tx.wait;

            await expect(tx).to.emit(apartment, "apartmentAdded");
        }
    );

});
