const hre  = require("hardhat");
const { ethers } = hre;

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

    for(let i=0;i<10;i++){
        console.log("** Using exploit to guess a coinflip **")
        await guessCoinflip.attack()
        wins = await coinflip.consecutiveWins()
        console.log("-> Current consecutive wins : ", wins.toNumber())

        console.log("--- Advancing to next block ---")
        const blockNumBefore = await ethers.provider.getBlockNumber();
        const blockBefore = await ethers.provider.getBlock(blockNumBefore);
        const timestampBefore = blockBefore.timestamp;
        console.log("Block number : ",blockNumBefore)
        
        await ethers.provider.send('evm_increaseTime', [3600]);
        await ethers.provider.send('evm_mine');

        const blockNumAfter = await ethers.provider.getBlockNumber();
        const blockAfter = await ethers.provider.getBlock(blockNumAfter);
        const timestampAfter = blockAfter.timestamp;
        console.log("Block Number : ", blockNumAfter)
        console.log("-------------------------------")
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});