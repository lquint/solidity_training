const hre = require("hardhat");

async function main(){
    const Coinflip = await hre.ethers.getContractFactory("CoinFlip");
    const coinflip = await Coinflip.deploy();
    await coinflip.deployed();

    console.log(
        `Coinflip deployed to ${coinflip.address}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});