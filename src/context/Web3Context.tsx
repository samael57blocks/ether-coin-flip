import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { ethers } from 'ethers';
import { switchToBaseSepolia } from '../utils/network'

const LS_KEY = 'walletAddress';

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  address: string | null;
  connect: () => Promise<void>;
  chainId: bigint | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<bigint | null>(null);

  const _connect = useCallback(async (_provider: ethers.BrowserProvider) => {
    await switchToBaseSepolia(_provider);

    const _signer = await _provider.getSigner();
    const _address = await _signer.getAddress();
    const network = await _provider.getNetwork();

    setProvider(_provider);
    setSigner(_signer);
    setAddress(_address);
    setChainId(network.chainId);

    localStorage.setItem(LS_KEY, _address);
  }, []);

  const connect = useCallback(async () => {
    const eth = window.ethereum;
    if (!eth) return alert("Instala MetaMask");

    try {
      const _provider = new ethers.BrowserProvider(eth);
      await _connect(_provider);
    } catch (error) {
      console.error("Conexión fallida", error);
    }
  }, [_connect]);

  useEffect(() => {
    const savedAddress = localStorage.getItem(LS_KEY);
    if (!savedAddress) return;

    const eth = window.ethereum;
    if (!eth) return;

    const autoConnect = async () => {
      try {
        const accounts = await eth.request({ method: 'eth_accounts' });
        if (accounts.length === 0) {
          localStorage.removeItem(LS_KEY);
          return;
        }
        const _provider = new ethers.BrowserProvider(eth);
        await _connect(_provider);
      } catch (error) {
        console.error("Auto-conexión fallida", error);
        localStorage.removeItem(LS_KEY);
      }
    };

    autoConnect();
  }, [_connect]);

  useEffect(() => {
    const eth = window.ethereum;
    if (!eth) return;

    const handleAccountsChanged = async (accounts: unknown) => {
      const _accounts = accounts as string[];
      if (_accounts.length === 0) {
        setProvider(null);
        setSigner(null);
        setAddress(null);
        setChainId(null);
        localStorage.removeItem(LS_KEY);
        return;
      }
      if (_accounts[0].toLowerCase() === address?.toLowerCase()) return;

      try {
        const _provider = new ethers.BrowserProvider(eth);
        await _connect(_provider);
      } catch (error) {
        console.error("Error al cambiar cuenta", error);
      }
    };

    const handleChainChanged = async (chainIdHex: unknown) => {
      setChainId(BigInt(chainIdHex as string));
    };

    eth.on("accountsChanged", handleAccountsChanged);
    eth.on("chainChanged", handleChainChanged);

    return () => {
      eth.removeListener("accountsChanged", handleAccountsChanged);
      eth.removeListener("chainChanged", handleChainChanged);
    };
  }, [_connect, address]);

  return (
    <Web3Context.Provider value={{ provider, signer, address, connect, chainId }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) throw new Error("useWeb3 debe usarse dentro de Web3Provider");
  return context;
};