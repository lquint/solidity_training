const { expect } = require("chai");
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");

async function deployWhitelistFixture() {
  const Whitelist = await ethers.getContractFactory("Whitelist");
  const accounts = await ethers.getSigners();
  const whitelistCapacity = 5;
  const whitelist = await Whitelist.deploy(whitelistCapacity);

  await whitelist.deployed();

  // Fixtures can return anything you consider useful for your tests
  return { Whitelist, whitelist, whitelistCapacity, accounts };
}

describe("Deployment", function () {
  it("Should set the right Whitelist capacity", async function () {
    const {whitelist, whitelistCapacity} = await loadFixture(deployWhitelistFixture);

    expect(await whitelist.maxWhitelistedAddresses()).to.equal(whitelistCapacity);
  });

  it("Should set the right owner", async function () {
    const { whitelist, accounts } = await loadFixture(deployWhitelistFixture);

    expect(await whitelist.owner()).to.equal(accounts[0].address);
  });

  it("Should initially have no members", async function () {
    const { whitelist} = await loadFixture(deployWhitelistFixture);

    expect(await whitelist.numberWhitelisted()).to.equal(0);
  });
});

describe("Adding addresses to whitelist", function(){
    it("Should add whitelisted users correctly in normal conditions", async function(){
        const { whitelist, accounts, whitelistCapacity} = await loadFixture(deployWhitelistFixture);

        for (let i=0;i<whitelistCapacity;i++){
            await whitelist.connect(accounts[i]).addAddress()
            expect(await whitelist.whitelistedAddresses(accounts[i].address)).to.be.true
        }
    })

    it("Should revert when an user tries to get whitelisted twice", async function(){
        const { whitelist, accounts, whitelistCapacity} = await loadFixture(deployWhitelistFixture);

        await whitelist.connect(accounts[1]).addAddress()
        await expect(whitelist.connect(accounts[1]).addAddress()).to.be.revertedWith("Sender has already been whitelisted")
    })

    it("Should revert when user tries to get whitelisted when the list is full", async function(){
        const { whitelist, accounts, whitelistCapacity} = await loadFixture(deployWhitelistFixture);

        for (let i=0;i<whitelistCapacity;i++){
            await whitelist.connect(accounts[i]).addAddress()
            expect(await whitelist.whitelistedAddresses(accounts[i].address)).to.be.true
        }
        await expect(whitelist.connect(accounts[whitelistCapacity+1]).addAddress()).to.be.revertedWith("Whitelist limit reached, additionnal members cannot be added")
    })
})

describe("Removing addresses from whitelist", function(){
    it("Should remove whitelisted users in normal conditions", async function(){
        const { whitelist, accounts, whitelistCapacity} = await loadFixture(deployWhitelistFixture);
        for (let i=0;i<whitelistCapacity;i++){
            await whitelist.connect(accounts[i]).addAddress()
            expect(await whitelist.whitelistedAddresses(accounts[i].address)).to.be.true
        }
        expect(await whitelist.numberWhitelisted()).to.equal(whitelistCapacity)
        for (let i=0;i<whitelistCapacity;i++){
            await whitelist.connect(accounts[0]).removeAddress(accounts[i].address)
            expect(await whitelist.whitelistedAddresses(accounts[i].address)).to.be.false
            expect(await whitelist.numberWhitelisted()).to.equal(whitelistCapacity-(i+1))
        }
    })

    it("Should revert if trying to remove from an empty whitelist", async function(){
        const { whitelist, accounts} = await loadFixture(deployWhitelistFixture);
        await expect(whitelist.connect(accounts[0]).removeAddress(accounts[0].address)).to.be.revertedWith("Whitelist is empty, there are no members to remove")
    })

    it("Should revert if trying to remove an address that is not on the whitelist", async function(){
        const { whitelist, accounts} = await loadFixture(deployWhitelistFixture);
        await whitelist.connect(accounts[0]).addAddress()
        await expect(whitelist.connect(accounts[0]).removeAddress(accounts[1].address)).to.be.revertedWith("Target user is not whitelisted")
    })

    it("Should revert non-owner address tries to use removeAddress function", async function(){
        const { whitelist, accounts} = await loadFixture(deployWhitelistFixture);
        await expect(whitelist.connect(accounts[1]).removeAddress(accounts[1].address)).to.be.revertedWith("You are not the owner")
    })
})
