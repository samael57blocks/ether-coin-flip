import { ethers } from 'ethers';
import { baseSepoliaChainIdHex, baseSepoliaParams } from "../config/constants"

export async function switchToBaseSepolia(provider: ethers.BrowserProvider) {
  try {
    const currentChainId = await provider.send("eth_chainId", []);
    if (currentChainId !== baseSepoliaChainIdHex) {
      try {
        await provider.send("wallet_switchEthereumChain", [
          { chainId: baseSepoliaChainIdHex },
        ]);
      } catch (switchError) {
        const err = switchError as { code?: number };
        console.log(err)
        if (err.code === 4902) {
          try {
            await provider.send("wallet_addEthereumChain", [baseSepoliaParams]);
          } catch (addError) {
            console.error("Failed to add Base Sepolia network:", addError);
          }
        } else {
          console.error("Failed to switch to Base Sepolia:", switchError);
        }
      }
    }
  } catch (error) {
    console.error("Failed to get chain ID or switch network:", error);
  }
}