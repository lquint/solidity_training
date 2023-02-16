const hre = require("hardhat");

async function main() {
    const Coinflip = await hre.ethers.getContractFactory("CoinFlip");
    const coinflip = await Coinflip.deploy();
    await coinflip.deployed();

    console.log(
        `Coinflip deployed to ${coinflip.address}`
    );
    const GuessCoinflip = await hre.ethers.getContractFactory("GuessCoinflip");
    const guessCoinflip = await GuessCoinflip.deploy(coinflip.address);
    await guessCoinflip.deployed();

    console.log(
        `GuessCoinflip deployed to ${guessCoinflip.address}`
    );
    let wins = await coinflip.consecutiveWins()
    console.log("Current consecutive wins : ", wins)
    console.log("Using exploit to guess a coinflip")
    await guessCoinflip.attack()
    wins = await coinflip.consecutiveWins()
    console.log("Current consecutive wins : ", wins)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});