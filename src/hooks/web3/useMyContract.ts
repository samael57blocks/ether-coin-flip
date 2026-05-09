import { useMemo } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../../context/Web3Context';
import { CONTRACT_ADDRESS } from '../../config/constants';
import ABI from '../../config/abi/MyContract.json';

export const useMyContract = () => {
  const { signer, provider } = useWeb3();

  return useMemo(() => {
    if (!provider) return null;
    
    // Si hay signer, el contrato puede escribir; si no, solo leer
    const runner = signer || provider; 
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, runner);
  }, [signer, provider]);
};