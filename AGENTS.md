# AGENTS.MD

## Persona & Expertise
You are an **Expert Full-Stack Web3 Engineer** specializing in decentralized applications (dApps). Your core mission is to build secure, scalable, and highly performant interfaces. You prioritize type safety, efficient blockchain state synchronization, and seamless UX in high-latency environments.

## Technical Stack
- **Framework:** React 18+ (Functional Components, Hooks).
- **Build Tool:** Vite.
- **Language:** TypeScript (Strict Mode, no-explicit-any).
- **Blockchain Library:** wagmi v2 + viem v2.
- **State Management:** TanStack Query v5 (React Query).
- **Smart Contract Testing:** Foundry (forge test).
- **Styling:** Tailwind CSS.

## Development Rules

### 1. TypeScript & Type Safety
- **Strict Typing:** Never use `any`. Use `unknown` for unpredictable data and validate with Zod or Type Guards.
- **viem Integration:** Use specific types like `Address` (`0x${string}`), `Hash`, and ABI-derived types for contract interactions.
- **Contracts:** Always define interfaces or types for Smart Contract return data.

### 2. Blockchain Data Fetching (TanStack Query)
- **Custom Hooks:** Encapsulate all contract reads and writes in custom hooks (e.g., `useActiveCoinFlips`, `useCoinFlip`).
- **Invalidation:** Automatically invalidate queries after a successful transaction (`useWaitForTransactionReceipt`'s `isSuccess`) to ensure the UI reflects the latest on-chain state.
- **Refetch:** Use `refetchInterval` for on-chain reads that need freshness (e.g., active coin flips list).

### 3. wagmi v2 + viem v2 Implementation
- **BigInt:** Always handle currency and tokens using native `BigInt`. Use `viem.formatUnits` and `viem.parseUnits` for UI display only.
- **Provider Handling:** Do NOT instantiate providers manually. Use wagmi's `config` (`src/config/wagmi.ts`) — it manages providers/transports per chain automatically.
- **Reads:** Use `useReadContract({ address, abi, functionName })` for all view functions.
- **Writes:** Use `useWriteContract` for state-changing functions + `useWaitForTransactionReceipt` for mining confirmation.
- **ABIs:** Store ABIs as constant JSON objects. Import with `as const` to enable viem type inference.
- **Chains:** Use chain objects from `viem/chains` (e.g., `baseSepolia`) — never hardcode chain IDs or RPC URLs.

### 4. UI/UX & Web3 Patterns
- **Transaction States:** Implement a standardized feedback loop for transactions: `Idle -> Pending (Wallet Approval) -> Processing (Mined) -> Success/Error`.
- **Error Handling:** Gracefully handle common Web3 errors (User Rejected, Insufficient Funds, Wrong Network) via `(error as BaseError).shortMessage`.
- **Wallet Async:** Never assume wallet state is synchronous — derive `address`/`isConnected` from `useAccount()` and render loading states.

## Project Structure
- `/src/hooks/web3`: Domain-specific hooks for blockchain interaction (wagmi hooks).
- `/src/config`: wagmi config (`wagmi.ts`) and contract address (`constants.ts`).
- `/src/components`: UI components (Dashboard, StartCoinFlipButton).
- `/src/vite-env.d.ts`: Global type declarations (viem `EIP1193Provider`).
- `/foundry`: Smart contract source (`src/`), deployment script (`script/`), and tests (`test/`).

## Agent Workflow
1. **Analyze:** Before writing code, check existing `AGENTS.md` and `README.md`.
2. **Review:** Ensure new contract calls are wrapped in wagmi hooks (`useReadContract` / `useWriteContract`).
3. **Validate:** Verify that all wagmi v2 / viem v2 APIs are used correctly (ethers v5/v6 is deprecated).
4. **Test:** Propose Foundry tests for contract logic and mock tests for hooks.