// src/context/Web3Context.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { switchToBaseSepolia } from '../utils/network'

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

  const connect = async () => {
    if (!window.ethereum) return alert("Instala MetaMask");
    
    try {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      // Validar red antes de obtener signer
      await switchToBaseSepolia(_provider);
      console.log(_provider)
      
      const _signer = await _provider.getSigner();
      const _address = await _signer.getAddress();
      const network = await _provider.getNetwork();

      setProvider(_provider);
      setSigner(_signer);
      setAddress(_address);
      setChainId(network.chainId);
    } catch (error) {
      console.error("Conexión fallida", error);
    }
  };

  // Escuchar cambios de cuenta o red
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, []);

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