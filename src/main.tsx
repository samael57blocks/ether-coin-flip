import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Web3Provider } from './context/Web3Context';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* El Web3Provider va dentro de QueryClientProvider */}
      <Web3Provider>
        <App />
      </Web3Provider>
    </QueryClientProvider>
  </StrictMode>,
)
