---
title: "Integration Reference"
package: "sdk"
scope: "guide"
complexity: "intermediate"
category: "integration"
---

Real implementation patterns from production NFT marketplace applications built with Next.js 15 and Zuno SDK v2.2.1.

## Overview

This reference demonstrates production-ready patterns:
- **Clean Architecture** - Separation of providers, services, and utilities
- **State Management** - useReducer for wallet state, Zustand for global state
- **Error Handling** - Centralized error handling with user-friendly messages
- **Type Safety** - Full TypeScript with strict typing throughout
- **Logger Integration** - Structured logging for debugging

## Architecture Overview

```
src/
├── app/
│   ├── app-provider.tsx          # ZunoProvider + WagmiProviderSync
│   └── layout.tsx                 # Root layout with providers
├── components/
│   ├── features/                  # Feature-specific components
│   └── ui/                        # shadcn/ui components
├── providers/
│   └── WalletProvider.tsx         # Custom wallet management (610 lines)
├── lib/
│   ├── config/
│   │   └── zuno-sdk.ts            # SDK config & validation
│   ├── store/
│   │   └── StoreProvider.tsx       # Zustand global store
│   └── utils/
│       ├── sdk-logger.ts          # Logger setup
│       └── error-handler.ts        # Error utilities
└── types/                         # TypeScript definitions
```

## Provider Setup Pattern

### App Provider (`app/app-provider.tsx`)

```tsx
"use client";
import { ZunoProvider, WagmiProviderSync, ZunoDevTools } from "zuno-marketplace-sdk/react";
import { defaultConfig, validateSDKConfig } from "@/lib/config/zuno-sdk";

export default function AppProvider({ children }) {
  // Validate before initialization
  const validation = validateSDKConfig();
  if (!validation.isValid) {
    return <ConfigurationError errors={validation.errors} />;
  }

  return (
    <ZunoProvider config={defaultConfig}>
      <WagmiProviderSync
        reconnectDelay={500}
        clearOnDisconnect={true}
        onSync={() => logger.info("Wallet signer synced")}
        onError={(error) => {
          if (shouldLogError(error)) {
            logger.error("Wallet sync error", error);
          }
        }}
      />
      <StoreProvider>{children}</StoreProvider>
      {process.env.NODE_ENV === "development" && (
        <ZunoDevTools
          config={{
            showLogger: true,
            showTransactions: true,
            showCache: true,
            showNetwork: true,
            position: "bottom-right",
          }}
        />
      )}
    </ZunoProvider>
  );
}
```

**Key Patterns:**
- **Validation first** - Fail fast with clear error messages
- **Development-only DevTools** - Only in dev environment
- **Error filtering** - `shouldLogError` prevents log spam
- **State sync callbacks** - Track wallet state changes

## Wallet Integration Pattern

The `WalletProvider` (`src/providers/WalletProvider.tsx`) demonstrates:

### 1. State Management with useReducer

```typescript
interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  account: string | null;
  chainId: number | null;
  balance: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  error: Error | null;
}
```

### 2. Auto-Reconnect on Mount

```typescript
useEffect(() => {
  let mounted = true;

  const attemptReconnect = async () => {
    if (!mounted || state.isConnected) return;

    const connectionData = await WalletService.reconnect();
    if (connectionData && mounted) {
      dispatch({ type: CONNECT_SUCCESS, payload: connectionData });
      logger.info("Auto-reconnected to wallet");
    }
  };

  setTimeout(attemptReconnect, 500);
  return () => { mounted = false; clearTimeout(); };
}, []);
```

**Benefits:**
- Seamless reconnection after page refresh
- 500ms delay prevents race conditions
- Cleanup prevents memory leaks

### 3. Network Validation

```typescript
static validateNetwork(currentChainId: number): boolean {
  const expectedChainId = parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || "31337", 10);
  return currentChainId === expectedChainId;
}
```

**Pattern:** Validate network early, prompt user to switch if needed.

### 4. Balance Refresh Interval

```typescript
useEffect(() => {
  if (!state.isConnected) return;

  const interval = setInterval(refreshBalance, 30000); // Every 30 seconds
  return () => clearInterval(interval);
}, [state.isConnected, refreshBalance]);
```

**Pattern:** Periodic balance updates ensure UI reflects changes.

## Component Patterns

### Feature Component Structure

```tsx
// Component with proper hooks usage
function AuctionCard({ auctionId }: { auctionId: string }) {
  const { isConnected } = useWallet();
  const { auction, isLoading } = useGetAuction(auctionId);

  if (!isConnected) {
    return <ConnectWalletPrompt />;
  }

  if (isLoading) {
    return <AuctionSkeleton />;
  }

  return <AuctionDetails auction={auction} />;
}
```

**Pattern:** Check wallet state first, then data loading, then render content.

### Mutation Pattern with Error Handling

```tsx
function CreateAuctionForm() {
  const { createEnglishAuction } = useAuction();

  const handleSubmit = async () => {
    try {
      const { auctionId, tx } = await createEnglishAuction.mutateAsync({
        collectionAddress: '0x...',
        tokenId: '1',
        startingBid: '1.0',
        duration: 86400 * 7,
      });

      await tx.wait();
      toast.success(`Auction created! ID: ${auctionId}`);
    } catch (error) {
      if (shouldLogError(error)) {
        logger.error("Failed to create auction", error);
      }
      toast.error(error.message);
    }
  };

  return <Form onSubmit={handleSubmit} />;
}
```

**Pattern:** Wrap mutations in try-catch, use `toast` for feedback.

## Hook Patterns

### Custom Hook Composition

```typescript
// Combining SDK hooks with app-specific logic
function useAuctionActions(auctionId: string) {
  const { placeBid } = useAuction();
  const { refreshBalance } = useWallet();
  const { auction } = useGetAuction(auctionId);

  const handlePlaceBid = async (amount: string) => {
    const { tx } = await placeBid.mutateAsync({
      auctionId,
      amount,
    });

    await tx.wait();
    await refreshBalance(); // Refresh wallet balance after bid
  };

  return { handlePlaceBid, auction };
}
```

**Pattern:** Compose multiple hooks to create feature-specific actions.

## Configuration Pattern

### Environment-Based Config

```typescript
export const defaultConfig: ZunoSDKConfig = {
  apiKey: process.env.NEXT_PUBLIC_ZUNO_API_KEY || "",
  network: parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID) || 31337,
  ...(process.env.NEXT_PUBLIC_ZUNO_API_URL
    ? { apiUrl: process.env.NEXT_PUBLIC_ZUNO_API_URL }
    : {}),
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
  cache: {
    ttl: 300000,   // 5 minutes
    gcTime: 600000, // 10 minutes
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

**Pattern:** All sensitive values from environment, with sensible defaults. Override `apiUrl` only when you need a non-default registry API.

## Error Handling Pattern

### Centralized Error Handler

```typescript
// lib/utils/error-handler.ts
export function shouldLogError(error: unknown): boolean {
  // Filter out expected errors
  if (error instanceof Error) {
    // Don't log user cancellation errors
    if (error.message.includes("User rejected")) {
      return false;
    }
  }
  return true;
}
```

**Pattern:** Filter noise from logs to focus on real issues.

## Best Practices

::alert{type="success"}
**Validate Early:** Check configuration at app startup, not when user tries to interact.
::

::alert{type="success"}
**Auto-Reconnect:** Improve UX by reconnecting wallet on page load.
::

::alert{type="success"}
**Periodic Updates:** Refresh balance periodically to reflect changes.
::

::alert{type="warning"}
**Error Filtering:** Don't log every error - filter out user cancellations and expected failures.
::

::alert{type="info"}
**Type Safety:** Leverage TypeScript for all state and props.
::

## See Also

- [Next.js Setup](/integration-guides/nextjs-setup) - Project initialization
- [Wallet Integration](/integration-guides/wallet-integration) - Detailed wallet patterns
- [Error Handling](/integration-guides/error-handling) - Error management patterns
