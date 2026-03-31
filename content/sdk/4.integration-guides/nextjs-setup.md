---
title: "Next.js Setup Guide"
package: "sdk"
scope: "guide"
complexity: "beginner"
category: "integration"
---

Complete guide for setting up a new Next.js 15 project with Zuno SDK v2.2.1, featuring App Router, SSR support, and proper provider configuration.

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- MetaMask wallet extension

## 1. Initialize Next.js Project

```bash
# Create new Next.js app with TypeScript
pnpm create next-app@latest zuno-marketplace --typescript --tailwind --eslint

# Navigate into project
cd zuno-marketplace

# Install Zuno SDK
pnpm add zuno-marketplace-sdk ethers@6 @tanstack/react-query wagmi viem
```

## 2. Configure Environment Variables

Create `.env.local`:

```bash
# Required: Zuno API configuration
NEXT_PUBLIC_ZUNO_API_KEY=your_api_key_here

# Optional: override the SDK default registry API
NEXT_PUBLIC_ZUNO_API_URL=https://abis.qdang46.xyz/api

# Network configuration
NEXT_PUBLIC_DEFAULT_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
```

**Environment Variables Explained:**

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_ZUNO_API_KEY` | Yes | Your Zuno API key |
| `NEXT_PUBLIC_ZUNO_API_URL` | No | Override the SDK default registry API endpoint |
| `NEXT_PUBLIC_DEFAULT_CHAIN_ID` | No | Default network (31337 = local) |
| `NEXT_PUBLIC_RPC_URL` | No | Custom RPC URL |

## 3. Create SDK Configuration

Create `lib/config/zuno-sdk.ts`:

```typescript
import type { ZunoSDKConfig } from "zuno-marketplace-sdk";

/**
 * Default SDK configuration
 * Used by ZunoProvider in app-provider.tsx
 */
export const defaultConfig: ZunoSDKConfig = {
  apiKey: process.env.NEXT_PUBLIC_ZUNO_API_KEY || "",
  network: (process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID
    ? parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID)
    : 31337) as number | "mainnet" | "sepolia" | "polygon" | "arbitrum",
  ...(process.env.NEXT_PUBLIC_ZUNO_API_URL
    ? { apiUrl: process.env.NEXT_PUBLIC_ZUNO_API_URL }
    : {}),
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

/**
 * Validate SDK configuration
 */
export function validateSDKConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!process.env.NEXT_PUBLIC_ZUNO_API_KEY) {
    errors.push("NEXT_PUBLIC_ZUNO_API_KEY is not set");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

## 4. Create App Provider

Create `app/app-provider.tsx`:

```tsx
"use client";
import type { ReactNode } from "react";
import { ZunoProvider, ZunoDevTools, WagmiProviderSync } from "zuno-marketplace-sdk/react";
import { defaultConfig, validateSDKConfig } from "@/lib/config/zuno-sdk";

export default function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Validate SDK configuration before initialization
  const validation = validateSDKConfig();

  if (!validation.isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Configuration Error
          </h1>
          <p className="text-gray-600 mb-4">
            The application is not properly configured.
          </p>
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
      />
      {children}
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

::alert{type="info"}
**WagmiProviderSync:** v2.2.1 includes WagmiProviderSync for automatic SSR-safe provider state synchronization. The `reconnectDelay` parameter controls how quickly to attempt reconnection after wallet state changes.
::

## 5. Update Root Layout

Modify `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import AppProvider from "./app-provider";

export const metadata: Metadata = {
  title: "Zuno SDK",
  description: "NFT marketplace powered by Zuno SDK",
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

## 6. Create Your First Component

Create `app/page.tsx`:

```tsx
"use client";

import { useExchange, useWallet } from 'zuno-marketplace-sdk/react';

export default function HomePage() {
  const { address, connect, isConnected } = useWallet();
  const { listNFT } = useExchange();

  const handleList = async () => {
    try {
      const { listingId, tx } = await listNFT.mutateAsync({
        collectionAddress: '0x...',
        tokenId: '1',
        price: '1.5',
        duration: 86400,
      });
      console.log('Listed:', listingId, 'TX:', tx.hash);
      alert(`NFT listed! ID: ${listingId}`);
    } catch (error) {
      console.error('Failed to list:', error);
      alert('Failed to list NFT. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Zuno SDK
        </h1>

        {!isConnected ? (
          <button
            onClick={() => connect()}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
            <button
              onClick={handleList}
              disabled={listNFT.isPending}
              className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {listNFT.isPending ? 'Listing...' : 'List NFT'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

## 7. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your marketplace in action.

## Common Pitfalls

::collapse{title="Missing environment variables"}
**Problem:** App shows configuration error on load.

**Solution:** Ensure `.env.local` is created with `NEXT_PUBLIC_ZUNO_API_KEY`. Only set `NEXT_PUBLIC_ZUNO_API_URL` if you need to override the SDK default API endpoint.

**Note:** Variables must start with `NEXT_PUBLIC_` to be exposed to the browser.
::

::collapse{title="Hydration mismatch errors"}
**Problem:** React hydration warnings about wallet state.

**Solution:** WagmiProviderSync in v2.2.1 handles this automatically. Ensure you're using `ZunoProvider` wrapper correctly.
::

::collapse{title="Wallet not connecting"}
**Problem:** MetaMask doesn't prompt for connection.

**Solution:**
- Ensure MetaMask is unlocked
- Check you're on the correct network (Chain ID matches config)
- Verify `NEXT_PUBLIC_DEFAULT_CHAIN_ID` is set correctly
::

::collapse{title="DevTools not showing"}
**Problem:** ZunoDevTools panel not visible.

**Solution:** Ensure `process.env.NODE_ENV === "development"` and you're wrapping children with `ZunoDevTools` component.
::

## Next Steps

After completing this guide:

- [Integration Tutorial](/integration-guides/zuno-mini-tutorial) - Complete step-by-step guide
- [Integration Reference](/integration-guides/zuno-mini-reference) - Real implementation patterns
- [Wallet Integration](/integration-guides/wallet-integration) - Advanced wallet patterns
- [Error Handling](/integration-guides/error-handling) - Robust error management
- [Exchange Module](/core-modules/exchange) - Building marketplace features
