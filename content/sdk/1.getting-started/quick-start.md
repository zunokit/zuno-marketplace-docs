---
title: "Quick Start"
package: "sdk"
lastUpdated: "2026-01-27"
scope: "guide"
complexity: "beginner"
category: "getting-started"
relatedTopics:
  - "installation"
  - "exchange"
  - "wallet-connection"
---

Get your NFT marketplace up and running in minutes with the Zuno Marketplace SDK v2.1.2.

## React with Next.js Setup

### 1. Wrap Your App with ZunoProvider

The SDK v2.1.2 requires the `ZunoProvider` wrapper with automatic WagmiProviderSync for SSR:

```tsx
// app/layout.tsx
import { ZunoProvider } from 'zuno-marketplace-sdk/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ZunoProvider
          config={{
            apiKey: process.env.NEXT_PUBLIC_ZUNO_API_KEY!,
            network: 'sepolia',
          }}
        >
          {children}
        </ZunoProvider>
      </body>
    </html>
  );
}
```

### 2. Use React Hooks in Your Components

```tsx
// app/page.tsx
'use client';

import { useExchange, useWallet } from 'zuno-marketplace-sdk/react';

export default function HomePage() {
  const { address, connect, isConnected } = useWallet();
  const { listNFT, batchListNFT } = useExchange();

  // List ERC721 NFT
  const handleList = async () => {
    const { listingId, tx } = await listNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenId: '1',
      price: '1.5',
      duration: 86400,
    });
    console.log('Listed with ID:', listingId, 'TX:', tx.hash);
  };

  // List ERC1155 NFTs with amount (v2.1.2)
  const handleListERC1155 = async () => {
    const { listingId, tx } = await listNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenId: '1',
      amount: '10',  // List 10 tokens
      price: '1.5',
      duration: 86400,
    });
    console.log('Listed 10 tokens with ID:', listingId);
  };

  // Batch list multiple NFTs (v2.1.2)
  const handleBatchList = async () => {
    const { listingIds, tx } = await batchListNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenIds: ['1', '2', '3'],
      amounts: ['5', '10', '15'],
      prices: ['1.0', '2.0', '3.0'],
      duration: 86400,
    });
    console.log('Batch listed:', listingIds.length, 'NFTs');
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={() => connect()}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {address}</p>
          <button onClick={handleList}>List NFT (ERC721)</button>
          <button onClick={handleListERC1155}>List NFTs (ERC1155)</button>
          <button onClick={handleBatchList}>Batch List (3)</button>
        </div>
      )}
    </div>
  );
}
```

## Configuration Options

The `ZunoProvider` accepts the following configuration:

```typescript
interface ZunoConfig {
  apiKey: string;           // Your Zuno API key
  network: string;          // Network: 'mainnet' | 'sepolia' | 'polygon' | etc.
  rpcUrl?: string;         // Optional custom RPC URL
  wagmiConfig?: Config;    // Optional custom Wagmi configuration
  cacheTime?: number;      // Cache duration in ms (default: 300000)
  logger?: {
    level?: 'none' | 'error' | 'warn' | 'info' | 'debug';
    timestamp?: boolean;
    modulePrefix?: boolean;
  };
}
```

### Environment Variables

Create a `.env.local` file:

```bash
# Required
NEXT_PUBLIC_ZUNO_API_KEY=your_api_key_here

# Optional
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_RPC_URL=https://your-rpc-url.com
```

## Common Use Cases

### List an ERC721 NFT for Sale

```tsx
const { listNFT } = useExchange();

const { listingId, tx } = await listNFT.mutateAsync({
  collectionAddress: '0x1234...',
  tokenId: '42',
  price: '1.5',      // Price in ETH
  duration: 86400,   // 24 hours in seconds
});
```

### List ERC1155 NFTs with Amount (v2.1.2)

```tsx
const { listNFT } = useExchange();

const { listingId, tx } = await listNFT.mutateAsync({
  collectionAddress: '0x1234...',
  tokenId: '1',
  amount: '10',      // List 10 tokens
  price: '1.5',      // Price per token
  duration: 86400,
});
```

### Batch List Multiple NFTs (v2.1.2)

```tsx
const { batchListNFT } = useExchange();

const { listingIds, tx } = await batchListNFT.mutateAsync({
  collectionAddress: '0x1234...',
  tokenIds: ['1', '2', '3'],
  amounts: ['5', '10', '15'],
  prices: ['1.0', '2.0', '3.0'],
  duration: 86400,
});
```

### Buy an NFT

```tsx
const { buyNFT } = useExchange();

// ERC721 purchase
const { tx } = await buyNFT.mutateAsync({
  listingId: '0xabcd...',
  value: '1.5',
});

// ERC1155 purchase
const { tx: tx1155 } = await buyNFT.mutateAsync({
  listingId: '0xabcd...',
  amount: '5',
  value: '7.5',  // 5 tokens × 1.5 ETH
});
```

### Create an Auction

```tsx
const { createEnglishAuction } = useAuction();

const { auctionId, tx } = await createEnglishAuction.mutateAsync({
  collectionAddress: '0x5678...',
  tokenId: '7',
  startingBid: '1.0',
  duration: 86400 * 7,  // 7 days
});
```

### Batch Create Auctions (v2.1.2)

```tsx
const { batchCreateEnglishAuction } = useAuction();

const { auctionIds, tx } = await batchCreateEnglishAuction.mutateAsync({
  collectionAddress: '0x5678...',
  tokenIds: ['1', '2', '3', '4', '5'],
  startingBid: '1.0',
  duration: 86400 * 7,
});
```

### Setup Allowlist (v2.1.2)

```tsx
const { setupAllowlist, addToAllowlist } = useCollection();

// Configure allowlist
await setupAllowlist.mutateAsync({
  collectionAddress: '0x...',
  ownerMintLimit: 100,
  allowlistOnly: false,
});

// Add addresses
await addToAllowlist.mutateAsync({
  collectionAddress: '0x...',
  addresses: ['0x...', '0x...'],
});
```

## Available Hooks

The SDK v2.1.2 provides 21+ React hooks organized by module:

::code-group

```tsx [Exchange]
import {
  useExchange,
  useListNFT,
  useBuyNFT,
  useCancelListing,
  useUpdateListingPrice,
  useBatchListNFT,  // v2.1.2
} from 'zuno-marketplace-sdk/react';
```

```tsx [Collection]
import {
  useCollection,
  useCreateERC721,
  useMintERC721,
  useSetupAllowlist,    // v2.1.2
  useAddToAllowlist,    // v2.1.2
  useIsInAllowlist,     // v2.1.2
} from 'zuno-marketplace-sdk/react';
```

```tsx [Auction]
import {
  useAuction,
  useCreateEnglishAuction,
  usePlaceBid,
  useCancelAuction,
  useBatchCreateEnglishAuction,  // v2.1.2
  useBatchCancelAuction,         // v2.1.2
} from 'zuno-marketplace-sdk/react';
```

```tsx [Wallet]
import {
  useWallet,
  useAccount,
  useConnect,
  useDisconnect,
} from 'zuno-marketplace-sdk/react';
```

::

## What's New in v2.1.2

### ERC1155 Support
- `listNFT()` now supports `amount` parameter for ERC1155 multi-token listings
- Auto token detection (ERC721 vs ERC1155)

### Batch Operations
- `batchListNFT()` - List multiple ERC1155 tokens efficiently
- `batchCreateEnglishAuction()` - Create up to 20 auctions per transaction
- `batchCancelAuction()` - Cancel multiple auctions at once

### Allowlist Management
- `setupAllowlist()` - Configure collection minting restrictions
- `addToAllowlist()` - Add addresses to allowlist
- `setAllowlistOnly()` - Enable permanent allowlist-only mode
- `isInAllowlist()` - Query allowlist status

### SSR & Performance
- **WagmiProviderSync** - Automatic SSR-safe provider synchronization
- **Transaction Retry** - Enhanced retry mechanism with history tracking
- **Approval Caching** - Reduced RPC calls with approval status caching
- **DevTools** - In-app debugging panel for development

::alert{type="info"}
**SSR Support:** v2.1.2 includes WagmiProviderSync for automatic SSR compatibility in Next.js App Router. No additional setup required.
::

## Next Steps

Now that you have the basics:

- [Exchange Module](/sdk/core-modules/exchange) - Deep dive into listing and trading with ERC1155
- [Collection Module](/sdk/core-modules/collection) - Create collections with allowlist management
- [Auction Module](/sdk/core-modules/auction) - Implement batch auction functionality
- [React Hooks](/sdk/react-hooks/overview) - Complete hooks reference

## Need Help?

- **Documentation**: [Full API Reference](/sdk)
- **Integration Guides**: See [Integration Guides](/sdk/integration-guides/nextjs-setup)
- **Support**: Open an issue on [GitHub](https://github.com/ZunoKit/zuno-marketplace-sdk/issues)
