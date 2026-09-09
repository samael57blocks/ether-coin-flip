import { ethers } from "ethers";
import { useCoinFlip } from "../hooks/web3/useCoinFlip";
import { useSubgraphCoinFlips } from "../hooks/web3/useSubgraphCoinFlips";

export const Dashboard = () => {
  const { endCoinFlip } = useCoinFlip();
  const { activeCoinFlips, status } = useSubgraphCoinFlips();

  return (
    <main>
      {status === "pending" && <div>Loading active coin flips...</div>}
      {status === "error" && <div>Error occurred querying the subgraph.</div>}
      {status === "success" && activeCoinFlips.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Coin Flip ID</th>
              <th>Bet Starter</th>
              <th>Wager</th>
              <th>Action</th>
              <th>Transaction</th>
            </tr>
          </thead>
          <tbody>
            {activeCoinFlips.map((flip) => (
              <tr key={flip.id}>
                <td>{flip.theCoinFlipID}</td>
                <td>{flip.theBetStarter}</td>
                <td>{ethers.formatEther(flip.theStartingWager)} ETH</td>
                <td>
                  <button
                    onClick={() =>
                      endCoinFlip(flip.theCoinFlipID, flip.theStartingWager)
                    }
                  >
                    End Coin Flip
                  </button>
                </td>
                <td>
                  <a
                    href={`https://base-sepolia.blockscout.com/tx/${flip.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Block Explorer
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No active coin flips available D:</p>
      )}
    </main>
  );
};
