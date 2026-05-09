import { useState } from "react";
import { useCoinFlip } from "../hooks/web3/useCoinFlip";

export const StartCoinFlipButton = () => {
    const [wager, setWager] = useState("");
    const { startCoinFlip } = useCoinFlip();
    return (
        <div>
            <input
                type="number"
                placeholder="Enter Wager Amount in ETH"
                value={wager}
                onChange={(e) => setWager(e.target.value)}
            />
            <button onClick={() => startCoinFlip(wager)}>Start Coin Flip</button>
        </div>
    );
}