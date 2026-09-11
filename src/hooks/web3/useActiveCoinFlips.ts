import { useReadContract } from "wagmi";
import { type Address } from "viem";
import { useAccount } from "wagmi";
import abi from "../../config/abi/MyContract.json";
import { CONTRACT_ADDRESS } from "../../config/constants";

export interface CoinFlipStruct {
  ID: bigint;
  betStarter: `0x${string}`;
  startingWager: bigint;
  betEnder: `0x${string}`;
  endingWager: bigint;
  etherTotal: bigint;
  winner: `0x${string}`;
  loser: `0x${string}`;
  isActive: boolean;
}

export const useActiveCoinFlips = () => {
  const { isConnected } = useAccount();

  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as Address,
    abi,
    functionName: "getActiveCoinFlips",
    query: {
      refetchInterval: 15_000,
    },
  });

  const activeCoinFlips: CoinFlipStruct[] = data ? (data as CoinFlipStruct[]) : [];

  return { activeCoinFlips, isLoading, error, refetch, isConnected };
};
