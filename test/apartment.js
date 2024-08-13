const {loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers")

const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Apartment contract test", function(){

    async function fixture(){

        const [apartmentOwner, randomUser] = await ethers.getSigners();

        const apartment = await ethers.deployContract("apartmentContract");

        await apartment.waitForDeployment();

        return {apartment, apartmentOwner, randomUser};
    }

    it("Should create a new apartment, search for the recently added"+  
        " apartment by its address, and check all information saved is correct",
    async function(){

        const {apartment, apartmentOwner, randomUser} = await loadFixture(fixture);

        // add new apartment

        const tx = await apartment.connect(apartmentOwner).
        addApartment("Ciudadela comfenalco", "Beautiful house", 50, apartmentOwner.address);

        await tx.wait();

        await expect(tx).to.emit(apartment, "NewApartmentAdded").
        withArgs("Ciudadela comfenalco", "Beautiful house", 50, apartmentOwner.address)

        // Search for apartment and test is it was succesfully added

        const apartmentAdded = await apartment.getApartment("Ciudadela comfenalco");

        expect(apartmentAdded.apartmentAddress).to.equal("Ciudadela comfenalco");
        expect(apartmentAdded.description).to.equal("Beautiful house");
        expect(apartmentAdded.price).to.equal(50);
        expect(apartmentAdded.apartmentOwner).to.equal(apartmentOwner.address);

    });

    it("should revert the apartment creation because it already exists", async function(){

        // add apartment

        const {apartment, apartmentOwner, randomUser} = await loadFixture(fixture);

        const tx = await apartment.connect(apartmentOwner).
        addApartment("Ciudadela comfenalco", "Beautiful house", 50, apartmentOwner.address);

        await tx.wait();

        await expect(tx).to.emit(apartment, "NewApartmentAdded").
        withArgs("Ciudadela comfenalco", "Beautiful house", 50, apartmentOwner.address)

        // add the same apartment again

        await expect(
            apartment.connect(randomUser).
            addApartment("Ciudadela comfenalco", "House", 100, randomUser.address)
        ).to.be.revertedWithCustomError(apartment, "apartmentFound").
        withArgs("Owner: ", apartmentOwner.address);
            
    })

    it("Should succesfully return the owner of an specific apartment," +
        "its corresponding price, and revert if the apartment does not exist",
         async function(){

        const { apartment, apartmentOwner, randomUser } = await loadFixture(fixture);

        const tx = await apartment.connect(apartmentOwner).
            addApartment("Ciudadela comfenalco", "Beautiful house", 50, apartmentOwner.address);

        await tx.wait();
        
        // Fetch the apartment owner
        const owner = await apartment.connect(randomUser).getApartmentOwner("Ciudadela comfenalco");

        // Check that the owner is as expected
        expect(owner).to.equal(apartmentOwner.address);
        
        // Fetch apartment price

        const price = await apartment.getApartmentPrice("Ciudadela comfenalco");

        // Check that the price is as expected
        expect(price).to.equal(50);
        
        await expect(
            apartment.connect(randomUser).getApartmentOwner("Providencia calle 11")
        ).to.be.revertedWithCustomError(apartment, "apartmentNotFound").withArgs("Providencia calle 11");

        await expect(
            apartment.connect(randomUser).getApartmentPrice("Belen")
        ).to.be.revertedWithCustomError(apartment, "apartmentNotFound").withArgs("Belen");

    })

    it("Should succesfully delete an existing apartment, and revert when"+
        " it does not exist, this also test the method which searchs"
        + " if an apartment exists or not", async function(){

        const { apartment, apartmentOwner, randomUser } = await loadFixture(fixture);

        const tx = await apartment.connect(apartmentOwner).
            addApartment("Ciudadela comfenalco", "Beautiful house", 50, apartmentOwner.address);

        await tx.wait();

        const apartmentExist = await apartment.searchIfApartmentExists("Ciudadela comfenalco");
        expect(apartmentExist).to.equal(true);

        await apartment.deleteApartment("Ciudadela comfenalco");
        
        const stillExist = await apartment.searchIfApartmentExists("Ciudadela comfenalco");
        expect(stillExist).to.equal(false);

    })

    it("Should change the apartment owner", async function() {
        
        const { apartment, apartmentOwner, randomUser } = await loadFixture(fixture);

        const tx = await apartment.connect(apartmentOwner).
            addApartment("Ciudadela comfenalco", "Beautiful house", 50, apartmentOwner.address);

        await tx.wait();

        const aptOwner = await apartment.getApartmentOwner("Ciudadela comfenalco");
        expect(aptOwner).to.equal(apartmentOwner.address);

        await apartment.changeAparmentOwner("Ciudadela comfenalco", randomUser.address);

        const newAptOwner = await apartment.getApartmentOwner("Ciudadela comfenalco");
        expect(newAptOwner).to.equal(randomUser.address);
    
    })

    it("Should update an existing apartment, and check if it's vacant or not", async function(){

        const {apartment, apartmentOwner, randomUser} = await loadFixture(fixture);

        const tx = await apartment.connect(apartmentOwner).
            addApartment("Ciudadela comfenalco", "Beautiful house", 50, apartmentOwner.address);

        await tx.wait();

        const readApt = await apartment.getApartment("Ciudadela comfenalco");

        expect(readApt.apartmentAddress).to.equal("Ciudadela comfenalco");
        expect(readApt.description).to.equal("Beautiful house");
        expect(readApt.price).to.equal(50);
        expect(readApt.apartmentOwner).to.equal(apartmentOwner.address);

        // now lets modified the information of the apartment

        const updateTx = await apartment.updateApartmentParams("Ciudadela comfenalco", "Palace", 100, 1 , randomUser.address); 
        await updateTx.wait();

        await expect(updateTx).to.emit(apartment, "ApartmentUpdated").withArgs(
            "Ciudadela comfenalco","Palace", 100, 1 ,randomUser.address
        );

        const readAptUpdated = await apartment.getApartment("Ciudadela comfenalco");

        expect(readAptUpdated.apartmentAddress).to.equal("Ciudadela comfenalco");
        expect(readAptUpdated.description).to.equal("Palace");
        expect(readAptUpdated.price).to.equal(100);
        expect(readAptUpdated.apartmentOwner).to.equal(randomUser.address);

        expect(
          await apartment.isApartmentVacant("Ciudadela comfenalco")
        ).to.equal(false);

    })

    it("Should update apartment direction", async function(){

        const {apartment, apartmentOwner, randomUser} = await loadFixture(fixture);

        const tx = await apartment.connect(apartmentOwner).
        addApartment("Ciudadela comfenalco", "Beautiful house", 50, apartmentOwner.address);

        await tx.wait();

        const updateAddressTx = await apartment.updateApartmentDirection("Ciudadela comfenalco", "Providencia");
        await updateAddressTx.wait();

        expect(updateAddressTx).to.emit(apartment, "ApartmentDirectionChanged").withArgs(
            "Ciudadela comfenalco", "Providencia"
        );

        const apt = await apartment.getApartment("Providencia");
        
        expect(apt.apartmentAddress).to.equal("Providencia");
        expect(apt.description).to.equal("Beautiful house");
        expect(apt.price).to.equal(50);
        expect(apt.apartmentOwner).to.equal(apartmentOwner.address);

        // read to see if old direction exists, it should be false

        await expect(
            apartment.getApartment("Ciudadela comfenalco")
        ).to.be.revertedWithCustomError(apartment, "apartmentNotFound").withArgs("Ciudadela comfenalco");

    })

});