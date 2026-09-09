import { useMyContract } from "./useMyContract";
import { ethers } from "ethers";

export const useCoinFlip = () => {
    const contract = useMyContract();

    const startCoinFlip = async (wager: string) => {
        if (!contract) {
            console.error("Contract is not initialized");
            return;
        }
        console.log(`Starting Coin Flip`);
        console.log(`Wager Amount: ${wager} ${typeof wager} ETH`);
        try {
            const transaction = await contract.newCoinFlip({
                value: ethers.parseEther(wager),
                gasLimit: 300000
            });
            console.log(transaction)
            await transaction.wait();
            console.log(`Coin flip started with a wager of ${wager} ETH!`);
        } catch (error) {
            console.error("Error starting coin flip:", error);
        }
    };

    const endCoinFlip = async (coinFlipID: string, startingWager: string) => {
        if (!contract) {
            console.error("Contract is not initialized");
            return;
        }
        try {
            const coinFlipIDInt = parseInt(coinFlipID);
            const wagerValue = BigInt(startingWager);

            alert(
                `Ending Coin Flip ID: ${coinFlipIDInt} with Wager: ${ethers.formatEther(wagerValue)} ETH`
            );
            const transaction = await contract.endCoinFlip(coinFlipIDInt, {
                value: wagerValue,
            });
            await transaction.wait();
            console.log(
                `Coin flip with ID ${coinFlipIDInt} ended with a wager of ${ethers.formatEther(wagerValue)} ETH!`
            );

            const coinFlipDetails = await contract.EtherCoinFlipStructs(coinFlipIDInt);
            const currentAddress = await (contract.runner as ethers.Signer).getAddress();
            if (coinFlipDetails.winner.toLowerCase() === currentAddress.toLowerCase()) {
                alert("Congratulations! You won the coin flip!");
            } else {
                alert("Sorry, you lost the coin flip.");
            }
        } catch (error) {
            console.error("Error ending coin flip:", error);
            alert("Error ending coin flip. Please check the console for details.");
        }
    };

    return {
        startCoinFlip,
        endCoinFlip,
    };
}
