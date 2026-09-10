import { useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { type Address } from "viem";
import { useQueryClient } from "@tanstack/react-query";
import abi from "../../config/abi/MyContract.json";
import { CONTRACT_ADDRESS } from "../../config/constants";

export const useCoinFlip = () => {
  const queryClient = useQueryClient();

  const {
    writeContractAsync,
    data: txHash,
    isPending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: txError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  // Invalidate on-chain reads after transaction mines
  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "readContract",
      });
    }
  }, [isSuccess, queryClient]);

  const newCoinFlip = async (wager: string) => {
    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS as Address,
      abi,
      functionName: "newCoinFlip",
      value: parseEther(wager),
    });
    return hash;
  };

  const endCoinFlip = async (coinFlipID: number, wager: bigint) => {
    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS as Address,
      abi,
      functionName: "endCoinFlip",
      args: [coinFlipID],
      value: wager,
    });
    return hash;
  };

  return {
    newCoinFlip,
    endCoinFlip,
    isPending,
    isConfirming,
    isSuccess,
    error: writeError ?? txError,
  };
};
