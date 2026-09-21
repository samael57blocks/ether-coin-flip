import { useAccount, useConnect } from 'wagmi'
import { StartCoinFlipButton } from './components/StartCoinFlipButton';
import { Dashboard } from './components/Dashboard'
import './App.css'

function App() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  return (
    <>
      <h1>Ether Coin Flip</h1>
      {!isConnected ? (
        <button
          onClick={() => {
            const connector = connectors[0];
            if (!connector) return;
            connect({ connector });
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p>Connected: {address}</p>
          <StartCoinFlipButton/>
          <Dashboard />
        </>
      )}
    </>
  )
}

export default App
