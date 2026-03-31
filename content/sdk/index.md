---
title: "Zuno SDK"
package: "sdk"
version: "2.2.1"
lastUpdated: "2026-03-31"
changeFrequency: "monthly"
scope: "guide"
context: "standalone"
complexity: "beginner"
tokenEstimate: 350
category: "overview"
navigation: false
relatedTopics:
  - "installation"
  - "quick-start"
  - "react-hooks"
---

<div class="flex gap-2 mb-6 flex-wrap">
  <UBadge color="blue" variant="subtle">TypeScript 5.6</UBadge>
  <UBadge color="green" variant="subtle">React 19</UBadge>
  <UBadge color="purple" variant="subtle">v2.2.1</UBadge>
  <UBadge color="gray" variant="subtle">MIT License</UBadge>
  <UBadge color="orange" variant="subtle">ERC721 + ERC1155</UBadge>
</div>

> **All-in-One NFT Marketplace SDK with Wagmi & React Query built-in**

A comprehensive, type-safe SDK for building NFT marketplace applications on Ethereum and EVM-compatible chains. Built with TypeScript, featuring first-class React support with Wagmi and TanStack Query integration.

## ✨ Features

- 🎨 **Complete NFT Marketplace** - Exchange, Auctions, Offers, Bundles
- ⚛️ **React Integration** - 21+ hooks with Wagmi & React Query
- 🔐 **Type-Safe** - Full TypeScript support with strict typing
- 📦 **Smart Caching** - Built-in ABI caching with TanStack Query
- 🎯 **Modular Design** - Use only what you need
- 🚀 **Production Ready** - Robust error handling and retries
- 🪝 **Modern React** - useCallback, useMemo optimization
- 📱 **Wallet Support** - WalletConnect, MetaMask, Coinbase Wallet
- 🔥 **ERC1155 Support** - Multi-token listings with amount handling
- ⚡ **Batch Operations** - Create up to 20 auctions per transaction
- 🛠️ **DevTools** - In-app debugging panel

## 🆕 What's New in v2.2.1

### Release Highlights
- **Raw Fetch Transport** - The SDK now uses a lightweight internal `fetch` wrapper instead of `axios`
- **Smaller Runtime Surface** - Removed the `axios` dependency from the published package
- **Same SDK Behavior** - Preserves timeout handling, query params, credentials, and normalized `ZunoSDKError` responses

### Available in the Current SDK
- **ERC1155 Support** - Multi-token listings with `amount` handling and token-standard awareness
- **Batch Operations** - Batch listing and batch auction flows for efficient transactions
- **Allowlist Management** - Collection allowlist setup and address management helpers
- **SSR Support** - `WagmiProviderSync` and `ZunoProvider` patterns for App Router setups

## 📦 Installation

```bash
npm install zuno-marketplace-sdk ethers@6 @tanstack/react-query wagmi viem
```

## 🚀 Quick Start

```tsx
// app/layout.tsx
import { ZunoProvider } from 'zuno-marketplace-sdk/react';

export default function RootLayout({ children }) {
  return (
    <ZunoProvider config={{ apiKey: process.env.NEXT_PUBLIC_ZUNO_API_KEY!, network: 'sepolia' }}>
      {children}
    </ZunoProvider>
  );
}
```

```tsx
// app/page.tsx
'use client';
import { useExchange, useWallet } from 'zuno-marketplace-sdk/react';

export default function HomePage() {
  const { address, connect, isConnected } = useWallet();
  const { listNFT } = useExchange();

  const handleList = async () => {
    // ERC721 listing
    const { listingId, tx } = await listNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenId: '1',
      price: '1.5',
      duration: 86400,
    });

    // ERC1155 listing with amount
    const { listingId: erc1155Listing } = await listNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenId: '1',
      amount: '10',  // List 10 tokens
      price: '1.5',
      duration: 86400,
    });
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={() => connect()}>Connect Wallet</button>
      ) : (
        <button onClick={handleList}>List NFT</button>
      )}
    </div>
  );
}
```

## 📖 Documentation

::card-grid
  ::card{icon="i-heroicons-rocket-launch" title="Getting Started" to="/getting-started/installation"}
  Install and configure the SDK in your project
  ::
  ::card{icon="i-heroicons-cube" title="Core Modules" to="/core-modules/exchange"}
  Exchange, Collection, and Auction APIs
  ::
  ::card{icon="i-heroicons-code-bracket" title="React Hooks" to="/react-hooks/overview"}
  21+ React hooks for marketplace features
  ::
::
