import { StartCoinFlipButton } from './components/StartCoinFlipButton';
import { useWeb3 } from './context/Web3Context';
import './App.css'

function App() {
  const { connect, address } = useWeb3();
  console.log(address)
  return (
    <>
      <h1>Ether Coin Flip</h1>
      {!address ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <>
          <StartCoinFlipButton/>
        </>
      )}
    </>
  )
}

export default App
