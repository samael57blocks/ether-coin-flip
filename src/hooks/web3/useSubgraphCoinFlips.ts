import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";

const url = import.meta.env.VITE_THE_GRAPH_API_URL;

const SUBGRAPH_QUERY = `
  {
    startedCoinFlips(first: 10) {
      id
      theCoinFlipID
      theBetStarter
      theStartingWager
      blockNumber
      blockTimestamp
      isActive
      transactionHash
    }
    finishedCoinFlips(first: 10) {
      id
      theCoinFlipID
      winner
      loser
      blockNumber
      blockTimestamp
    }
  }
`;

export interface StartedCoinFlip {
  id: string;
  theCoinFlipID: string;
  theBetStarter: string;
  theStartingWager: string;
  blockNumber: string;
  blockTimestamp: string;
  isActive: boolean;
  transactionHash: string;
}

interface FinishedCoinFlip {
  id: string;
  theCoinFlipID: string;
  winner: string;
  loser: string;
  blockNumber: string;
  blockTimestamp: string;
}

interface SubgraphData {
  startedCoinFlips: StartedCoinFlip[];
  finishedCoinFlips: FinishedCoinFlip[];
}

/** Query key exportada para invalidación desde otros hooks */
export const subgraphQueryKey = ["activeCoinFlips"] as const;

function getActiveCoinFlips(data: SubgraphData | undefined): StartedCoinFlip[] {
  if (!data) return [];
  const finishedIDs = new Set(data.finishedCoinFlips.map((flip) => flip.theCoinFlipID));
  return data.startedCoinFlips.filter((flip) => !finishedIDs.has(flip.theCoinFlipID));
}

export const useSubgraphCoinFlips = () => {
  const { data, status } = useQuery({
    queryKey: subgraphQueryKey,
    async queryFn() {
      return await request(url, SUBGRAPH_QUERY);
    },
    enabled: !!url,
  });

  const activeCoinFlips = getActiveCoinFlips(data);

  return { activeCoinFlips, status };
};
