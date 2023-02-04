//import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";



async function getEvent(){
    const res =await fetch('Whitelist_metadata.json')
    const json = await res.json()
    const ABI = json.output.abi

    console.log(ABI)
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);

    contractAddress = "0x425Fb68117bF9e92982b2f6489c799e41b821CFe"

    const contract = new ethers.Contract(contractAddress, ABI, provider);
    contract.on("maxReached", (membersCount, event)=>{
        let transferEvent ={
            membersCount,
            eventData: event,
        }
        console.log(JSON.stringify(transferEvent))
    })
}

getEvent()