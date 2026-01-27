---
title: "Zuno Mini Integration Tutorial"
package: "sdk"
scope: "guide"
complexity: "beginner"
category: "integration"
---

Comprehensive tutorial for integrating Zuno SDK into a Next.js project, based on production patterns from [zuno-marketplace-mini](https://github.com/ZunoKit/zuno-marketplace-mini).

::tabs
  ::div{label="Getting Started"}
    ## What You'll Build

    NFT marketplace with:
    - Wallet connection (MetaMask, WalletConnect)
    - NFT listing and browsing
    - Auction creation and bidding
    - Real-time balance updates
    - Error handling and user feedback

    ## What is Zuno Mini?

    **Zuno Mini** - Production NFT marketplace with Next.js 15 and Zuno SDK v2.1.2 demonstrating:
    - Clean architecture with separated concerns
    - Robust wallet management with auto-reconnect
    - Centralized error handling
    - Type-safe TypeScript throughout
    - Production-ready logging and debugging

    ## Prerequisites

    **Tools:**
    - **Node.js** 18+
    - **pnpm** (recommended) or npm/yarn
    - **MetaMask** browser extension

    **Knowledge:**
    - Basic React and hooks
    - TypeScript fundamentals
    - Next.js App Router basics

    **Accounts:**
    - **Zuno API key** - [Sign up](https://github.com/ZunoKit) for free API key
    - **Web3 wallet** with testnet ETH

    ## Tech Stack

    | Technology | Version | Purpose |
    |------------|---------|---------|
    | **Next.js** | 15+ | React framework |
    | **Zuno SDK** | 2.1.2 | NFT marketplace SDK |
    | **TypeScript** | 5+ | Type safety |
    | **ethers.js** | 6+ | Web3 library |
    | **@tanstack/react-query** | 5+ | Data fetching |
    | **wagmi** | 2+ | Ethereum hooks |
    | **viem** | 2+ | TypeScript Ethereum interface |
    | **Zustand** | 4+ | State management (optional) |

    ## What You'll Learn

    - ✅ Set up Next.js with Zuno SDK
    - ✅ Configure SDK with validation
    - ✅ Implement wallet connection with auto-reconnect
    - ✅ Handle Web3 errors gracefully
    - ✅ Build features using SDK hooks
    - ✅ Deploy and test your marketplace

    ## Time Estimate

    - **Beginner** (new to Web3): 4-6 hours
    - **Intermediate** (React/Next.js): 2-3 hours
    - **Advanced** (Web3 experience): 1-2 hours

    ::alert{type="info"}
    **Already have a project?** Jump to [Tutorial](#tab-tutorial) or [Recipes](#tab-recipes).
    ::

  ::

  ::div{label="Tutorial"}
    ## Overview

    Build a complete NFT marketplace in 6 steps:

    1. **Project Setup** - Initialize Next.js with dependencies
    2. **SDK Configuration** - Configure SDK with validation
    3. **Provider Setup** - Set up provider hierarchy
    4. **Wallet Integration** - Connect wallet with auto-reconnect
    5. **Feature Implementation** - Build marketplace features
    6. **Best Practices** - Production-ready patterns

    ::alert{type="warning"}
    **Provider Order Matters:** Follow the exact order in Step 3 to avoid runtime errors.
    ::

    ## Step 1: Project Setup

    ### 1.1 Create Next.js Project

    ```bash
    pnpm create next-app@latest my-marketplace --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
    cd my-marketplace
    ```

    **Flags:** `--typescript`, `--tailwind`, `--eslint`, `--app`, `--src-dir`, `--import-alias`

    ### 1.2 Install Dependencies

    ```bash
    # Core SDK and peer dependencies
    pnpm add zuno-marketplace-sdk ethers@6 @tanstack/react-query wagmi viem

    # Optional but recommended
    pnpm add zustand sonner clsx tailwind-merge
    ```

    **Dependencies:**
    - `zuno-marketplace-sdk` - Core SDK
    - `ethers@6` - Web3 library (v6 required)
    - `@tanstack/react-query` - Data fetching
    - `wagmi` + `viem` - Ethereum hooks
    - `zustand` - State management
    - `sonner` - Toast notifications
    - `clsx` + `tailwind-merge` - Class name utilities

    ### 1.3 Configure Environment Variables

    Create `.env.local`:

    ```bash
    NEXT_PUBLIC_ZUNO_API_KEY=your_api_key_here
    NEXT_PUBLIC_ZUNO_API_URL=https://zuno-marketplace-abis.vercel.app/api
    NEXT_PUBLIC_DEFAULT_CHAIN_ID=31337
    NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
    ```

    ::alert{type="warning"}
    **Security:** Never commit `.env.local` to git. Add to `.gitignore` and create `.env.example`.
    ::

    Create `.env.example`:

    ```bash
    NEXT_PUBLIC_ZUNO_API_KEY=
    NEXT_PUBLIC_ZUNO_API_URL=https://zuno-marketplace-abis.vercel.app/api
    NEXT_PUBLIC_DEFAULT_CHAIN_ID=31337
    NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
    ```

    ### 1.4 Update .gitignore

    ```gitignore
    # dependencies
    node_modules/

    # environment variables
    .env.local
    .env.*.local

    # next.js
    .next/
    out/

    # logs
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*
    pnpm-debug.log*

    # IDE
    .vscode/
    .idea/
    ```

    ## Step 2: SDK Configuration

    ### 2.1 Create SDK Configuration File

    Create `src/lib/config/zuno-sdk.ts`:

    ```typescript
    import type { ZunoSDKConfig } from "zuno-marketplace-sdk";

    export const defaultConfig: ZunoSDKConfig = {
      apiKey: process.env.NEXT_PUBLIC_ZUNO_API_KEY || "",
      network: (process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID
        ? parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID)
        : 31337) as number | "mainnet" | "sepolia" | "polygon" | "arbitrum",
      apiUrl: process.env.NEXT_PUBLIC_ZUNO_API_URL,
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8545",

      cache: {
        ttl: 300000, // 5 minutes cache for contract instances
        gcTime: 600000, // 10 minutes garbage collection
      },

      retryPolicy: {
        maxRetries: 3,
        backoff: "exponential",
      },

      logger: {
        level: process.env.NODE_ENV === "development" ? "debug" : "info",
      },
    };
    ```

    **Options:**
    - `cache.ttl` - Contract instance cache duration (ms)
    - `cache.gcTime` - Cache garbage collection time (ms)
    - `retryPolicy.maxRetries` - Number of retry attempts
    - `retryPolicy.backoff` - "exponential" or "linear"
    - `logger.level` - "debug", "info", "warn", "error"

    ### 2.2 Add Configuration Validation

    Add to `src/lib/config/zuno-sdk.ts`:

    ```typescript
    export interface ValidationResult {
      isValid: boolean;
      errors: string[];
    }

    export function validateSDKConfig(): ValidationResult {
      const errors: string[] = [];

      if (!process.env.NEXT_PUBLIC_ZUNO_API_KEY) {
        errors.push("NEXT_PUBLIC_ZUNO_API_KEY is not set");
      }

      if (!process.env.NEXT_PUBLIC_ZUNO_API_URL) {
        errors.push("NEXT_PUBLIC_ZUNO_API_URL is not set");
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    }
    ```

    **Usage:** Call in `app-provider.tsx` before wrapping with `ZunoProvider`.

    ### 2.3 Create Logger Utility

    Create `src/lib/utils/sdk-logger.ts`:

    ```typescript
    export type LogLevel = "debug" | "info" | "warn" | "error";

    interface Logger {
      debug: (message: string, ...args: unknown[]) => void;
      info: (message: string, ...args: unknown[]) => void;
      warn: (message: string, ...args: unknown[]) => void;
      error: (message: string, error?: Error, ...args: unknown[]) => void;
    }

    export function createLogger(level: LogLevel = "info"): Logger {
      const shouldLog = (messageLevel: LogLevel): boolean => {
        const levels: LogLevel[] = ["debug", "info", "warn", "error"];
        return levels.indexOf(messageLevel) >= levels.indexOf(level);
      };

      return {
        debug: (message, ...args) => {
          if (shouldLog("debug")) {
            console.debug(`[Zuno SDK] ${message}`, ...args);
          }
        },
        info: (message, ...args) => {
          if (shouldLog("info")) {
            console.info(`[Zuno SDK] ${message}`, ...args);
          }
        },
        warn: (message, ...args) => {
          if (shouldLog("warn")) {
            console.warn(`[Zuno SDK] ${message}`, ...args);
          }
        },
        error: (message, error, ...args) => {
          if (shouldLog("error")) {
            console.error(`[Zuno SDK] ${message}`, error, ...args);
          }
        },
      };
    }

    export const logger = createLogger(
      process.env.NODE_ENV === "development" ? "debug" : "info"
    );
    ```

    ::alert{type="success"}
    **Step 2 Complete!** You now have:
    - SDK configuration with all settings
    - Validation to catch missing env vars early
    - Logger for debugging SDK issues
    ::

    ## Step 3: Provider Setup

    ### 3.1 Create Error Handler

    Create `src/lib/utils/error-handler.ts`:

    ```typescript
    import { toast } from "sonner";
    import { ZunoSDKError, ErrorCodes } from "zuno-marketplace-sdk";

    export function isUserRejected(error: unknown): boolean {
      // Check SDK error code
      if (error instanceof ZunoSDKError && error.code === ErrorCodes.USER_REJECTED) {
        return true;
      }

      // Check error message
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        const patterns = ["user rejected", "user denied", "action rejected", "cancelled by user"];
        if (patterns.some(p => msg.includes(p))) return true;

        // Check wagmi error code
        const err = error as { code?: number | string };
        if (err.code === 4001 || err.code === "ACTION_REJECTED") return true;
      }

      return false;
    }

    export function handleSdkError(error: unknown, fallback = "Transaction failed"): void {
      if (isUserRejected(error)) return; // Silent for user cancellations
      toast.error(error instanceof Error ? error.message : fallback);
    }

    export function shouldLogError(error: unknown): boolean {
      return !isUserRejected(error);
    }
    ```

    **Purpose:** Prevents log spam from expected user actions (rejecting transactions).

    ### 3.2 Create AppProvider Component

    Create `src/app/app-provider.tsx`:

    ```typescript
    "use client";

    import type { ReactNode } from "react";
    import { ZunoProvider, WagmiProviderSync, ZunoDevTools } from "zuno-marketplace-sdk/react";
    import { defaultConfig, validateSDKConfig } from "@/lib/config/zuno-sdk";
    import { logger } from "@/lib/utils/sdk-logger";
    import { shouldLogError } from "@/lib/utils/error-handler";
    import { Toaster } from "sonner";

    export default function AppProvider({ children }: { children: ReactNode }) {
      const validation = validateSDKConfig();

      if (!validation.isValid) {
        logger.error("Zuno SDK Configuration Error", validation.errors, {
          component: "AppProvider",
          action: "validateSDKConfig"
        });

        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
              <p className="text-gray-600 mb-4">The application is not properly configured.</p>
              <details className="text-left text-sm text-gray-500">
                <summary>Error Details</summary>
                <ul className="list-disc list-inside mt-2">
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        );
      }

      return (
        <ZunoProvider config={defaultConfig}>
          <WagmiProviderSync
            reconnectDelay={500}
            clearOnDisconnect={true}
            onSync={() => logger.info("Wallet signer synced", { component: "WagmiProviderSync" })}
            onError={(error) => {
              if (shouldLogError(error)) {
                logger.error("Wallet sync error", error, { component: "WagmiProviderSync" });
              }
            }}
          >
            {children}
          </WagmiProviderSync>

          <Toaster position="top-right" />

          {process.env.NODE_ENV === "development" && (
            <ZunoDevTools
              config={{
                showLogger: true,
                showTransactions: true,
                showCache: true,
                showNetwork: true,
                position: "bottom-right",
                defaultCollapsed: true,
              }}
            />
          )}
        </ZunoProvider>
      );
    }
    ```

    ### 3.3 Provider Order (CRITICAL)

    ::alert{type="warning"}
    **CRITICAL:** Provider nesting order is crucial. Incorrect order will cause runtime errors.
    ::

    Correct order:

    ```typescript
    <ZunoProvider config={defaultConfig}>       {/* 1. SDK initialization (outermost) */}
      <WagmiProviderSync>                       {/* 2. Wallet signer sync */}
        {children}                              {/* 3. Your app */}
      </WagmiProviderSync>
      <ZunoDevTools />                         {/* 4. Dev tools (dev only, outside tree) */}
    </ZunoProvider>
    ```

    **Why:**
    1. **ZunoProvider** - Must be outermost to initialize SDK context first
    2. **WagmiProviderSync** - Needs SDK context to sync wallet signer
    3. **Your App** - Goes inside WagmiProviderSync to access wallet state
    4. **ZunoDevTools** - Placed outside main tree, renders independently in dev mode

    ### 3.4 Update Root Layout

    Update `src/app/layout.tsx`:

    ```typescript
    import AppProvider from "./app-provider";
    import type { Metadata } from "next";

    export const metadata: Metadata = {
      title: "My NFT Marketplace",
      description: "Built with Zuno SDK",
    };

    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <html lang="en">
          <body>
            <AppProvider>{children}</AppProvider>
          </body>
        </html>
      );
    }
    ```

    ### 3.5 Verify Providers Work

    Update `src/app/page.tsx`:

    ```typescript
    "use client";

    import { useZuno } from "zuno-marketplace-sdk/react";

    export default function HomePage() {
      const zuno = useZuno();

      if (!zuno) {
        return <div>Loading SDK...</div>;
      }

      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Zuno SDK Status</h1>
          <div className="space-y-2">
            <p>✅ SDK Initialized: Yes</p>
            <p>✅ Network: {zuno.getNetwork()}</p>
            <p>✅ API URL: {zuno.getConfig().apiUrl}</p>
            <p>✅ Cache TTL: {zuno.getConfig().cache?.ttl}ms</p>
          </div>
        </div>
      );
    }
    ```

    ::alert{type="success"}
    **Step 3 Complete!** Providers now:
    - Validate configuration before initialization
    - Nest in correct order
    - Provide SDK context to entire app
    - Show dev tools in development
    ::

    ## Step 4: Wallet Integration

    ### 4.1 Create Network Utilities

    Create `src/lib/utils/network.ts`:

    ```typescript
    import { ethers } from "ethers";

    export function validateNetwork(currentChainId: number): boolean {
      const expectedChainId = parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || "31337", 10);
      return currentChainId === expectedChainId;
    }

    export async function switchNetwork(
      provider: ethers.BrowserProvider,
      targetChainId: number
    ): Promise<void> {
      try {
        await provider.send("wallet_switchEthereumChain", [
          { chainId: `0x${targetChainId.toString(16)}` }
        ]);
      } catch (error) {
        if ((error as { code?: number }).code === 4902) {
          throw new Error(`Network ${targetChainId} not in wallet. Add manually.`);
        }
        throw error;
      }
    }

    export function getNetworkName(chainId: number): string {
      const networks: Record<number, string> = {
        1: "Ethereum",
        11155111: "Sepolia",
        137: "Polygon",
        42161: "Arbitrum",
        31337: "Local",
      };
      return networks[chainId] || `Network ${chainId}`;
    }

    export function shortenAddress(address: string): string {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    ```

    ### 4.2 Create Connect Button Component

    Create `src/components/ConnectButton.tsx`:

    ```typescript
    "use client";

    import { useWallet, useBalance } from "zuno-marketplace-sdk/react";
    import { getNetworkName, shortenAddress, validateNetwork } from "@/lib/utils/network";
    import { handleSdkError } from "@/lib/utils/error-handler";
    import { toast } from "sonner";

    export function ConnectButton() {
      const {
        isConnected,
        isPending: isConnecting,
        address: account,
        chainId,
        connect,
        disconnect,
        switchChain,
      } = useWallet();

      const { data: balanceData } = useBalance(account);
      const balance = balanceData
        ? parseFloat(balanceData.formatted).toFixed(4)
        : null;

      const expectedChainId = parseInt(
        process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || "31337"
      );
      const isCorrectNetwork = chainId === expectedChainId;

      const handleConnect = async () => {
        try {
          await connect();

          if (chainId && !validateNetwork(chainId)) {
            const shouldSwitch = confirm(
              `Wrong network (${getNetworkName(chainId)}). Switch to ${getNetworkName(expectedChainId)}?`
            );
            if (shouldSwitch) {
              await switchChain({ chainId: expectedChainId });
            }
          }
        } catch (error) {
          handleSdkError(error, "Failed to connect wallet");
        }
      };

      // Loading state
      if (isConnecting) {
        return (
          <button
            disabled
            className="px-4 py-2 bg-gray-400 text-white rounded-lg opacity-50 cursor-not-allowed"
          >
            Connecting...
          </button>
        );
      }

      // Disconnected state
      if (!isConnected) {
        return (
          <button
            onClick={handleConnect}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Connect Wallet
          </button>
        );
      }

      // Connected state
      return (
        <div className="flex items-center gap-4 p-3 bg-white rounded-lg border shadow-sm">
          {/* Network indicator */}
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isCorrectNetwork ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-gray-600">
              {getNetworkName(chainId!)}
            </span>
          </div>

          {/* Address and balance */}
          <div className="text-sm">
            <span className="text-gray-600">{shortenAddress(account!)}</span>
            {balance && (
              <span className="ml-2 text-gray-500">{balance} ETH</span>
            )}
          </div>

          {/* Disconnect button */}
          <button
            onClick={() => disconnect()}
            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            Disconnect
          </button>

          {/* Switch network button (if wrong network) */}
          {!isCorrectNetwork && (
            <button
              onClick={() => switchChain({ chainId: expectedChainId })}
              className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
            >
              Switch Network
            </button>
          )}
        </div>
      );
    }
    ```

    ::alert{type="success"}
    **Step 4 Complete!** Wallet integration includes:
    - Connect/disconnect functionality
    - Network validation and switching
    - Balance display
    - Error handling for user rejections
    ::

    ## Step 5: Feature Implementation

    ### 5.1 NFT List Component

    Create `src/components/NFTList.tsx`:

    ```typescript
    "use client";

    import { useGetNFTsByCollection } from "zuno-marketplace-sdk/react";

    interface NFTListProps {
      collectionAddress: string;
    }

    export function NFTList({ collectionAddress }: NFTListProps) {
      const { data, isLoading, error } = useGetNFTsByCollection({
        collectionAddress,
      });

      if (isLoading) {
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 rounded-lg h-80"
              />
            ))}
          </div>
        );
      }

      if (error) {
        return (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load NFTs: {error.message}</p>
          </div>
        );
      }

      if (!data || data.length === 0) {
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">No NFTs found in this collection</p>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map((nft) => (
            <div
              key={`${nft.collectionAddress}-${nft.tokenId}`}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{nft.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {nft.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Token ID: {nft.tokenId}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }
    ```

    ### 5.2 Auction Form Component

    Create `src/components/CreateAuctionForm.tsx`:

    ```typescript
    "use client";

    import { useAuction } from "zuno-marketplace-sdk/react";
    import { handleSdkError, shouldLogError } from "@/lib/utils/error-handler";
    import { logger } from "@/lib/utils/sdk-logger";
    import { toast } from "sonner";
    import { useState } from "react";

    interface CreateAuctionFormProps {
      collectionAddress: string;
      tokenId: string;
    }

    export function CreateAuctionForm({
      collectionAddress,
      tokenId,
    }: CreateAuctionFormProps) {
      const { createEnglishAuction } = useAuction();
      const [startingBid, setStartingBid] = useState("");
      const [duration, setDuration] = useState("7");

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
          toast.loading("Creating auction...");

          const { auctionId, tx } = await createEnglishAuction.mutateAsync({
            collectionAddress,
            tokenId,
            startingBid,
            duration: parseInt(duration) * 86400, // Convert days to seconds
          });

          await tx.wait();

          toast.dismiss();
          toast.success(`Auction created! ID: ${auctionId}`);
          logger.info("Auction created successfully", {
            auctionId,
            txHash: tx.hash,
          });

          setStartingBid("");
          setDuration("7");
        } catch (error) {
          toast.dismiss();
          handleSdkError(error, "Failed to create auction");

          if (shouldLogError(error)) {
            logger.error("Create auction failed", error, {
              collectionAddress,
              tokenId,
            });
          }
        }
      };

      return (
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Starting Bid (ETH)
            </label>
            <input
              type="number"
              step="0.001"
              value={startingBid}
              onChange={(e) => setStartingBid(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Duration (days)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1">1 day</option>
              <option value="3">3 days</option>
              <option value="7">7 days</option>
              <option value="14">14 days</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={createEnglishAuction.isPending}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {createEnglishAuction.isPending ? "Creating..." : "Create Auction"}
          </button>
        </form>
      );
    }
    ```

    ::alert{type="success"}
    **Step 5 Complete!** You now have:
    - NFT list with loading/error/empty states
    - Auction form with validation
    - Proper error handling and logging
    - User feedback with toasts
    ::

    ## Step 6: Best Practices

    ### Error Handling

    ✅ Always filter user rejections - Silent handling prevents toast spam
    ✅ Use centralized error handler - Consistent UX across app
    ✅ Log only relevant errors - Filter out expected errors
    ✅ Provide fallback messages - User-friendly error descriptions

    ### Network Management

    ✅ Validate network before transactions - Prevent failed transactions
    ✅ Prompt user to switch - Clear action when on wrong network
    ✅ Show network indicator - Visual feedback in UI
    ✅ Handle error 4902 - Network not in wallet

    ### State Management

    ✅ Handle all loading states - Better UX during async operations
    ✅ Reset form on success - Clean state for next action
    ✅ Disable buttons during mutation - Prevent double submissions
    ✅ Use TypeScript strictly - Catch errors at compile time

    ### Developer Experience

    ✅ Use logger for debugging - Structured logs with context
    ✅ Enable dev tools - Inspect SDK state in development
    ✅ Validate configuration early - Fail fast with clear errors
    ✅ Add JSDoc comments - Better IDE autocomplete

    ::alert{type="success"}
    **Tutorial Complete!** You've built a fully functional NFT marketplace with:
    - Wallet connection and management
    - NFT display from collections
    - Auction creation
    - Robust error handling
    - Network validation
    - Production-ready patterns
    ::

    ## Next Steps

    - Explore [API Reference](/sdk/api-reference) for all available hooks
    - Check [Recipes](#tab-recipes) tab for quick patterns
    - Read [Integration Reference](/sdk/integration-guides/zuno-mini-reference) for architecture details
  ::

  ::div{label="Recipes"}
    ## Overview

    Quick reference patterns for common integration tasks. Copy-paste ready code extracted from production implementations.

    ### Recipe 1: SDK Configuration

    **When to use:** App initialization

    **File:** `lib/config/zuno-sdk.ts`

    ```typescript
    import type { ZunoSDKConfig } from "zuno-marketplace-sdk";

    export const defaultConfig: ZunoSDKConfig = {
      apiKey: process.env.NEXT_PUBLIC_ZUNO_API_KEY || "",
      network: (process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID
        ? parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID)
        : 31337) as number | "mainnet" | "sepolia" | "polygon" | "arbitrum",
      apiUrl: process.env.NEXT_PUBLIC_ZUNO_API_URL,
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8545",
      cache: {
        ttl: 300000,      // 5 minutes cache for contract instances
        gcTime: 600000,   // 10 minutes garbage collection
      },
      retryPolicy: {
        maxRetries: 3,
        backoff: "exponential",
      },
      logger: {
        level: process.env.NODE_ENV === "development" ? "debug" : "info",
      },
    };

    export function validateSDKConfig(): {
      isValid: boolean;
      errors: string[];
    } {
      const errors: string[] = [];

      if (!process.env.NEXT_PUBLIC_ZUNO_API_KEY) {
        errors.push("NEXT_PUBLIC_ZUNO_API_KEY is not set");
      }

      if (!process.env.NEXT_PUBLIC_ZUNO_API_URL) {
        errors.push("NEXT_PUBLIC_ZUNO_API_URL is not set");
      }

      if (process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID) {
        const chainId = parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID);
        if (isNaN(chainId) || chainId <= 0) {
          errors.push("NEXT_PUBLIC_DEFAULT_CHAIN_ID must be a valid positive integer");
        }
      }

      return { isValid: errors.length === 0, errors };
    }
    ```

    **Notes:**
    - Call `validateSDKConfig()` before rendering providers
    - Fail fast with user-friendly error UI
    - Cache: 5min TTL, 10min GC for performance

    ---

    ### Recipe 2: Provider Setup

    **When to use:** Root layout wrapper

    **File:** `app/app-provider.tsx`

    ```typescript
    "use client";

    import { ZunoProvider, WagmiProviderSync, ZunoDevTools } from "zuno-marketplace-sdk/react";
    import { defaultConfig, validateSDKConfig } from "@/lib/config/zuno-sdk";
    import type { ReactNode } from "react";
    import { Toaster } from "sonner";

    export default function AppProvider({ children }: { children: ReactNode }) {
      const validation = validateSDKConfig();
      if (!validation.isValid) {
        return <ConfigurationErrorUI errors={validation.errors} />;
      }

      return (
        <ZunoProvider config={defaultConfig}>
          <WagmiProviderSync
            reconnectDelay={500}
            clearOnDisconnect={true}
          >
            {children}
          </WagmiProviderSync>

          <Toaster position="top-right" />

          {process.env.NODE_ENV === "development" && (
            <ZunoDevTools
              config={{
                showLogger: true,
                showTransactions: true,
                showCache: true,
                showNetwork: true,
                position: "bottom-right",
                defaultCollapsed: true,
              }}
            />
          )}
        </ZunoProvider>
      );
    }
    ```

    **Notes:**
    - **Provider order is critical:** ZunoProvider → WagmiProviderSync → Your providers
    - DevTools only in development
    - `clearOnDisconnect` prevents stale wallet state

    ---

    ### Recipe 3: Error Utilities

    **When to use:** All SDK operations with user interactions

    **File:** `lib/utils/error-handler.ts`

    ```typescript
    import { toast } from "sonner";
    import { ZunoSDKError, ErrorCodes } from "zuno-marketplace-sdk";

    export function isUserRejected(error: unknown): boolean {
      // Check SDK error code
      if (error instanceof ZunoSDKError && error.code === ErrorCodes.USER_REJECTED) {
        return true;
      }

      // Check error message
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        const patterns = ["user rejected", "user denied", "action rejected", "cancelled by user"];
        if (patterns.some(p => msg.includes(p))) return true;

        // Check wagmi error code
        const err = error as { code?: number | string };
        if (err.code === 4001 || err.code === "ACTION_REJECTED") return true;
      }

      return false;
    }

    export function handleSdkError(error: unknown, fallback = "Transaction failed"): void {
      if (isUserRejected(error)) return; // Silent
      toast.error(error instanceof Error ? error.message : fallback);
    }

    export function shouldLogError(error: unknown): boolean {
      return !isUserRejected(error);
    }
    ```

    **Notes:**
    - Silent handling for user cancellations (no toast spam)
    - Prevents log pollution from expected errors
    - Consistent UX across all operations

    ---

    ### Recipe 4: Network Validation

    **When to use:** Before transactions, after wallet connection

    **File:** `lib/utils/network.ts`

    ```typescript
    import { ethers } from "ethers";

    export function validateNetwork(currentChainId: number): boolean {
      const expected = parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || "31337", 10);
      return currentChainId === expected;
    }

    export async function switchNetwork(
      provider: ethers.BrowserProvider,
      targetChainId: number
    ): Promise<void> {
      try {
        await provider.send("wallet_switchEthereumChain", [
          { chainId: `0x${targetChainId.toString(16)}` }
        ]);
      } catch (error) {
        if ((error as { code?: number }).code === 4902) {
          throw new Error(`Network ${targetChainId} not in wallet. Add manually.`);
        }
        throw error;
      }
    }

    export function getNetworkName(chainId: number): string {
      const names: Record<number, string> = {
        1: "Ethereum", 11155111: "Sepolia", 137: "Polygon",
        42161: "Arbitrum", 31337: "Local"
      };
      return names[chainId] || `Chain ${chainId}`;
    }

    export function shortenAddress(address: string): string {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    ```

    **Notes:**
    - Always validate network before critical operations
    - Prompt user to switch if on wrong network
    - Error 4902 = network not in wallet

    ---

    ### Recipe 5: Mutation Pattern

    **When to use:** All SDK mutations (createAuction, placeBid, etc.)

    **Pattern:**

    ```typescript
    import { handleSdkError, shouldLogError } from "@/lib/utils/error-handler";
    import { logger } from "@/lib/utils/sdk-logger";
    import { toast } from "sonner";

    const handleTransaction = async () => {
      try {
        toast.loading("Processing...");

        const { tx, id } = await sdkMethod.mutateAsync(params);

        await tx.wait();

        toast.dismiss();
        toast.success("Transaction successful!");
        logger.info("Success", { id, txHash: tx.hash });
      } catch (error) {
        toast.dismiss();
        handleSdkError(error, "Transaction failed");
        if (shouldLogError(error)) {
          logger.error("Failed", error);
        }
      }
    };
    ```

    **Notes:**
    - Consistent UX pattern: Loading → Success/Failure toast → Log
    - Always wait for `tx.wait()` for transaction confirmation
    - Use logger for debugging with context

    ---

    ### Recipe 6: Logger Setup

    **When to use:** App initialization (singleton)

    **File:** `lib/utils/sdk-logger.ts`

    ```typescript
    export type LogLevel = "debug" | "info" | "warn" | "error";

    interface Logger {
      debug: (message: string, ...args: unknown[]) => void;
      info: (message: string, ...args: unknown[]) => void;
      warn: (message: string, ...args: unknown[]) => void;
      error: (message: string, error?: Error, ...args: unknown[]) => void;
    }

    export function createLogger(level: LogLevel = "info"): Logger {
      const shouldLog = (messageLevel: LogLevel): boolean => {
        const levels: LogLevel[] = ["debug", "info", "warn", "error"];
        return levels.indexOf(messageLevel) >= levels.indexOf(level);
      };

      return {
        debug: (message, ...args) => {
          if (shouldLog("debug")) {
            console.debug(`[Zuno SDK] ${message}`, ...args);
          }
        },
        info: (message, ...args) => {
          if (shouldLog("info")) {
            console.info(`[Zuno SDK] ${message}`, ...args);
          }
        },
        warn: (message, ...args) => {
          if (shouldLog("warn")) {
            console.warn(`[Zuno SDK] ${message}`, ...args);
          }
        },
        error: (message, error, ...args) => {
          if (shouldLog("error")) {
            console.error(`[Zuno SDK] ${message}`, error, ...args);
          }
        },
      };
    }

    export const logger = createLogger(
      process.env.NODE_ENV === "development" ? "debug" : "info"
    );
    ```

    **Usage:**

    ```typescript
    logger.info("User action", { userId: "123" }, { component: "UserProfile" });
    logger.error("Transaction failed", error, { component: "SwapWidget", action: "executeSwap" });
    ```

    **Notes:**
    - Structured logging with metadata
    - Component/action context for filtering
    - Error context extraction for Error objects

    ::alert{type="success"}
    **Need more details?** Check the [Tutorial](#tab-tutorial) tab for step-by-step implementation.
    ::
  ::
::
