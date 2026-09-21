import { formatEther } from "viem";
import { useCoinFlip } from "../hooks/web3/useCoinFlip";
import { useActiveCoinFlips } from "../hooks/web3/useActiveCoinFlips";

export const Dashboard = () => {
  const { endCoinFlip, isPending, isConfirming } = useCoinFlip();
  const { activeCoinFlips, isLoading, error } = useActiveCoinFlips();

  const handleEndCoinFlip = async (id: bigint, wager: bigint) => {
    try {
      await endCoinFlip(Number(id), wager);
    } catch (err) {
      console.error("Error ending coin flip:", err);
    }
  };

  return (
    <main>
      {isLoading && <div>Loading active coin flips...</div>}
      {error && <div>Error querying on-chain data.</div>}
      {!isLoading && !error && activeCoinFlips.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Coin Flip ID</th>
              <th>Bet Starter</th>
              <th>Wager</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {activeCoinFlips.map((flip) => (
              <tr key={flip.ID.toString()}>
                <td>{flip.ID.toString()}</td>
                <td>{flip.betStarter}</td>
                <td>{formatEther(flip.startingWager)} ETH</td>
                <td>
                  <button
                    onClick={() => handleEndCoinFlip(flip.ID, flip.startingWager)}
                    disabled={isPending || isConfirming}
                  >
                    {isPending
                      ? "Awaiting Approval..."
                      : isConfirming
                        ? "Mining..."
                        : "End Coin Flip"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !isLoading && !error && <p>No active coin flips available D:</p>
      )}
    </main>
  );
};
