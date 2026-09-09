export const CONTRACT_ADDRESS = "0x60f3e652cdc7ecb90faf35096577c146901fa677"
export const baseSepoliaChainId = "11155111";
export const baseSepoliaChainIdHex = "0x" + BigInt(11155111).toString(16); // Result: "0x14a34"

export const baseSepoliaParams = {
    chainId: baseSepoliaChainIdHex,
    chainName: "Sepolia",
    nativeCurrency: {
        name: "Sepolia ETH",
        symbol: "SepoliaETH",
        decimals: 18,
    },
    rpcUrls: ["https://sepolia.infura.io"],
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
};