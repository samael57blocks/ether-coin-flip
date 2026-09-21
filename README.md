# Decentralized Application (dApp) - CoinFlip

A modern, scalable Decentralized Application (dApp) built with **React (Vite)** and **TypeScript**. This project implements a clean architecture to manage blockchain interactions using **wagmi v2**, **viem v2**, and **TanStack Query (v5)**.

## 🏗 Architectural Design

The project follows a **Layered Modular Architecture** to decouple the user interface from the blockchain logic, ensuring the code remains maintainable and easy to test.

### 1. Wallet Layer (wagmi)
The foundation of the dApp. wagmi manages the wallet connection lifecycle declaratively.
* **Config**: `wagmiConfig` targets **Base Sepolia** (chain ID 84532) with the `injected()` connector.
* **Hooks**: `useAccount()` exposes `address`, `isConnected`, and `chain` reactively — no manual event listeners needed.
* **Connection**: `useConnect()` / `useDisconnect()` handle wallet approval and cleanup.

### 2. Contract Interaction Layer (wagmi hooks)
Decentralized contract interactions using wagmi's typed hooks:
* **`useActiveCoinFlips`**: Reads `getActiveCoinFlips()` via `useReadContract` with auto-refetch — replaces the old subgraph query.
* **`useCoinFlip`**: Encapsulates the business logic of the game (`newCoinFlip`, `endCoinFlip`) using `useWriteContract` + `useWaitForTransactionReceipt`.

### 3. Server-State Management (TanStack Query)
Blockchain data is treated as an asynchronous remote state.
* **Caching**: Efficiently caches data like balances and game results to minimize RPC calls.
* **Reactive Updates**: Automatically invalidates and refetches data after successful transactions, ensuring the UI reflects the latest on-chain state without manual refreshes.

---

## 📁 Project Structure

```text
src/
├── assets/             # Static assets (images, icons)
├── config/
│   ├── wagmi.ts        # wagmi config (Base Sepolia, injected connector)
│   └── constants.ts    # CONTRACT_ADDRESS
├── hooks/
│   └── web3/           # Business logic hooks (useCoinFlip, useActiveCoinFlips)
├── components/         # UI Components (Dashboard, StartCoinFlipButton)
└── vite-env.d.ts       # Global type declarations

foundry/               # Smart contract + tests
├── foundry.toml
├── src/EtherCoinFlip.sol
├── script/Deploy.s.sol
└── test/CoinFlip.t.sol
```

## 🛠 Tech Stack

* Framework: React 19 (Vite 8)
* Language: TypeScript (strict mode)
* Blockchain Library: wagmi v2 + viem v2
* State Management: TanStack Query v5 (React Query)
* Smart Contract Testing: Foundry (forge)
* Network: Base Sepolia Testnet (84532)