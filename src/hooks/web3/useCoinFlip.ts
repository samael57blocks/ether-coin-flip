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
        console.log(`Wager Amount: ${wager} ETH`);
        try {
            const transaction = await contract.newCoinFlip({
                value: ethers.parseEther(wager),
            });
            await transaction.wait();
            console.log(`Coin flip started with a wager of ${wager} ETH!`);
        } catch (error) {
            console.error("Error starting coin flip:", error);
        }
    };

    return {
        startCoinFlip: startCoinFlip
    }
}