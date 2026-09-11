import { useState } from "react";
import { useCoinFlip } from "../hooks/web3/useCoinFlip";

export const StartCoinFlipButton = () => {
  const [wager, setWager] = useState("");
  const { newCoinFlip, isPending, isConfirming, isSuccess, error } =
    useCoinFlip();

  const handleStart = async () => {
    if (!wager || Number(wager) <= 0) return;
    try {
      await newCoinFlip(wager);
      setWager("");
    } catch (err) {
      console.error("Error starting coin flip:", err);
    }
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Enter Wager Amount in ETH"
        value={wager}
        onChange={(e) => setWager(e.target.value)}
      />
      <button onClick={handleStart} disabled={isPending || isConfirming}>
        {isPending
          ? "Awaiting Wallet Approval..."
          : isConfirming
            ? "Mining..."
            : "Start Coin Flip"}
      </button>
      {isSuccess && <p>Coin flip started successfully!</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};
