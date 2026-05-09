import { ethers } from 'ethers';
import { baseSepoliaChainId, baseSepoliaParams } from "../config/constants"

export async function switchToBaseSepolia(provider: ethers.BrowserProvider) {
  try {
    const currentChainId = await provider.send("eth_chainId", []);
    if (currentChainId !== baseSepoliaChainId) {
      try {
        await provider.send("wallet_switchEthereumChain", [
          { chainId: baseSepoliaChainId },
        ]);
      } catch (switchError) {
        if (switchError.code === 4902) {
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