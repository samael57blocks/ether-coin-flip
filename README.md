# Decentralized Application (dApp) - CoinFlip

A modern, scalable Decentralized Application (dApp) built with **React (Vite)** and **TypeScript**. This project implements a clean architecture to manage blockchain interactions using **Ethers.js (v6)** and **TanStack Query (v5)**.

## 🏗 Architectural Design

The project follows a **Layered Modular Architecture** to decouple the user interface from the blockchain logic, ensuring the code remains maintainable and easy to test.

### 1. Global Connection Layer (`Web3Context`)
The foundation of the dApp. It manages the global state of the user's wallet connection.
* **Provider & Signer**: Handles the initialization of `ethers.BrowserProvider` and `ethers.JsonRpcSigner`.
* **Account Management**: Listens for `accountsChanged` and `chainChanged` events to ensure the UI stays in sync with the wallet.
* **Network Enforcement**: Automatically prompts the user to switch to **Base Sepolia** upon connection.

### 2. Contract Interaction Layer (Custom Hooks)
Instead of global instances, we use a decentralized approach for contract logic:
* **`useMyContract`**: A core hook that instantiates the contract on-demand using `useMemo`. It intelligently switches between the `Signer` (for transactions) and the `Provider` (for read-only calls).
* **`useCoinFlip`**: Encapsulates the business logic of the game, exposing clear methods like `playGame` and tracking transaction states.

### 3. Server-State Management (`TanStack Query`)
Blockchain data is treated as an asynchronous remote state.
* **Caching**: Efficiently caches data like balances and game results to minimize RPC calls.
* **Reactive Updates**: Automatically invalidates and refetches data after successful transactions, ensuring the UI reflects the latest on-chain state without manual refreshes.

---

## 📁 Project Structure

```text
src/
├── assets/             # Static assets (images, icons)
├── config/             # Contract ABIs, Addresses, and Network constants
├── context/            # Web3Context.tsx (Global wallet state)
├── hooks/
│   └── web3/           # Business logic hooks (useCoinFlip, useMyContract)
├── services/           # Pure Ethers.js functions for contract calls
├── components/         # UI Components (ConnectButton, GameBoard)
└── utils/              # Formatting tools (Wei to ETH) and network helpers
```

## 🛠 Tech Stack

* Framework: React 18 (Vite)
* Language: TypeScript
* Blockchain Library: Ethers.js v6
* State Management: TanStack Query v5 (React Query)
* Network: Base Sepolia Testnet