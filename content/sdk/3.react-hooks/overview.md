---
title: "React Hooks Overview"
package: "sdk"
lastUpdated: "2026-01-27"
scope: "guide"
complexity: "intermediate"
category: "react-hooks"
relatedTopics:
  - "quick-start"
  - "exchange"
  - "collection"
  - "auction"
---

The Zuno SDK v2.1.2 provides 21+ React hooks for building marketplace applications with Wagmi and TanStack Query integration.

## What's New in v2.1.2

- **ERC1155 Support** - `listNFT` now supports `amount` parameter for multi-token listings
- **Batch Operations** - `batchListNFT`, `batchCreateEnglishAuction`, `batchCancelAuction` hooks
- **Allowlist Hooks** - `setupAllowlist`, `addToAllowlist`, `isInAllowlist` for collection access control
- **WagmiProviderSync** - SSR-safe provider state synchronization
- **Enhanced Error Handling** - Transaction retry with history tracking

## Installation

The React hooks are included in the main SDK package:

```bash
npm install zuno-marketplace-sdk @tanstack/react-query wagmi viem
```

## Provider Setup

Wrap your app with `ZunoProvider` (v2.1.2 includes WagmiProviderSync):

```tsx
import { ZunoProvider } from 'zuno-marketplace-sdk/react';

function App({ children }) {
  return (
    <ZunoProvider
      config={{
        apiKey: process.env.NEXT_PUBLIC_ZUNO_API_KEY!,
        network: 'sepolia',
      }}
    >
      {children}
    </ZunoProvider>
  );
}
```

::alert{type="info"}
**SSR-Safe:** v2.1.2 includes WagmiProviderSync for automatic SSR-safe provider state synchronization in Next.js App Router.
::

## Available Hooks

### Exchange Hooks

Hooks for NFT listing and trading (ERC721 & ERC1155):

```tsx
import {
  useExchange,
  useListNFT,
  useBuyNFT,
  useCancelListing,
  useUpdateListingPrice,
  useGetActiveListings,
  useBatchListNFT,  // v2.1.2
} from 'zuno-marketplace-sdk/react';
```

**Example (v2.1.2):**

```tsx
function ListingComponent() {
  const { listNFT, batchListNFT, buyNFT } = useExchange();

  // List ERC721 NFT
  const handleList = async () => {
    const { listingId } = await listNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenId: '1',
      price: '1.5',
      duration: 86400,
    });
  };

  // List ERC1155 NFTs with amount
  const handleListERC1155 = async () => {
    const { listingId } = await listNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenId: '1',
      amount: '10',  // List 10 tokens
      price: '1.5',
      duration: 86400,
    });
  };

  // Batch list multiple ERC1155 tokens
  const handleBatchList = async () => {
    const { listingIds } = await batchListNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenIds: ['1', '2', '3'],
      amounts: ['5', '10', '15'],
      prices: ['1.0', '2.0', '3.0'],
      duration: 86400,
    });
  };
}
```

### Collection Hooks

Hooks for creating and minting NFT collections with allowlist management (v2.1.2):

```tsx
import {
  useCollection,
  useCreateERC721Collection,
  useMintERC721,
  useSetupAllowlist,       // v2.1.2
  useAddToAllowlist,       // v2.1.2
  useIsInAllowlist,        // v2.1.2
} from 'zuno-marketplace-sdk/react';
```

**Example (v2.1.2):**

```tsx
function CollectionComponent() {
  const {
    createERC721Collection,
    mintERC721,
    setupAllowlist,
    addToAllowlist,
    isInAllowlist
  } = useCollection();

  const handleCreateCollection = async () => {
    const { address } = await createERC721Collection.mutateAsync({
      name: 'My NFTs',
      symbol: 'MNFT',
      baseUri: 'ipfs://...',
      maxSupply: 10000,
    });
  };

  const handleSetupAllowlist = async () => {
    await setupAllowlist.mutateAsync({
      collectionAddress: '0x...',
      ownerMintLimit: 100,
      allowlistOnly: false,
    });
  };

  const handleAddToAllowlist = async () => {
    await addToAllowlist.mutateAsync({
      collectionAddress: '0x...',
      addresses: ['0x...', '0x...'],
    });
  };

  // Check allowlist status (query hook)
  const { data: isAllowlisted } = isInAllowlist({
    collectionAddress: '0x...',
    address: '0x...',
  });
}
```

### Auction Hooks

Hooks for auction functionality with batch operations (v2.1.2):

```tsx
import {
  useAuction,
  useCreateEnglishAuction,
  usePlaceBid,
  useCancelAuction,
  useGetActiveAuctions,
  useBatchCreateEnglishAuction,  // v2.1.2
  useBatchCancelAuction,         // v2.1.2
} from 'zuno-marketplace-sdk/react';
```

**Example (v2.1.2):**

```tsx
function AuctionComponent() {
  const {
    createEnglishAuction,
    batchCreateEnglishAuction,
    placeBid,
    batchCancelAuction
  } = useAuction();

  const handleCreateAuction = async () => {
    const { auctionId } = await createEnglishAuction.mutateAsync({
      collectionAddress: '0x...',
      tokenId: '1',
      startingBid: '1.0',
      duration: 86400 * 7,
    });
  };

  const handleBatchCreate = async () => {
    const { auctionIds } = await batchCreateEnglishAuction.mutateAsync({
      collectionAddress: '0x...',
      tokenIds: ['1', '2', '3', '4', '5'],
      startingBid: '1.0',
      duration: 86400 * 7,
    });
  };

  const handleBatchCancel = async () => {
    const { cancelledCount } = await batchCancelAuction.mutateAsync([
      'auction-1',
      'auction-2',
      'auction-3',
    ]);
  };
}
```

### Wallet Hooks

Hooks for wallet connection and account management:

```tsx
import {
  useWallet,
  useAccount,
  useConnect,
  useDisconnect,
} from 'zuno-marketplace-sdk/react';
```

**Example:**

```tsx
function WalletComponent() {
  const { address, connect, disconnect, isConnected } = useWallet();

  return (
    <div>
      {!isConnected ? (
        <button onClick={() => connect()}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
```

### Utility Hooks

```tsx
import {
  useZunoSDK,        // Access SDK instance
  useZunoLogger,     // Logger instance
  useProviderSync,   // v2.1.2 - WagmiProviderSync status
  useABIs,           // Contract ABIs
} from 'zuno-marketplace-sdk/react';
```

## Hook Features

All hooks include:

- ✅ **TypeScript Support** - Full type inference
- ✅ **Loading States** - `isLoading`, `isPending`, `isSuccess`
- ✅ **Error Handling** - `error`, `isError`
- ✅ **Caching** - Automatic with TanStack Query
- ✅ **Refetching** - Manual and automatic refetch
- ✅ **Optimistic Updates** - UI updates before confirmation
- ✅ **Retry Logic** - v2.1.2 enhanced transaction retry

## Common Patterns

### Loading States

```tsx
function Component() {
  const { listNFT } = useExchange();

  return (
    <button
      onClick={() => listNFT.mutateAsync({...})}
      disabled={listNFT.isPending}
    >
      {listNFT.isPending ? 'Listing...' : 'List NFT'}
    </button>
  );
}
```

### Error Handling

```tsx
function Component() {
  const { buyNFT } = useExchange();

  return (
    <div>
      <button onClick={() => buyNFT.mutateAsync({...})}>
        Buy NFT
      </button>
      {buyNFT.isError && (
        <p className="error">Error: {buyNFT.error.message}</p>
      )}
    </div>
  );
}
```

### Query Hooks

```tsx
function ListingsComponent() {
  const { data, isLoading } = useGetActiveListings({ page: 1, limit: 20 });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.items.map(listing => (
        <div key={listing.id}>{listing.tokenId}</div>
      ))}
    </div>
  );
}
```

### Batch Operations (v2.1.2)

```tsx
function BatchAuctionsComponent() {
  const { batchCreateEnglishAuction } = useAuction();

  const handleBatchCreate = async () => {
    const { auctionIds } = await batchCreateEnglishAuction.mutateAsync({
      collectionAddress: '0x...',
      tokenIds: ['1', '2', '3', '4', '5'],
      startingBid: '1.0',
      duration: 86400 * 7,
    });

    console.log(`Created ${auctionIds.length} auctions`);
  };

  return (
    <button onClick={handleBatchCreate} disabled={batchCreateEnglishAuction.isPending}>
      {batchCreateEnglishAuction.isPending ? 'Creating...' : 'Create 5 Auctions'}
    </button>
  );
}
```

### Allowlist Management (v2.1.2)

```tsx
function AllowlistComponent() {
  const { setupAllowlist, addToAllowlist } = useCollection();

  const handleSetup = async () => {
    await setupAllowlist.mutateAsync({
      collectionAddress: '0x...',
      ownerMintLimit: 100,
      allowlistOnly: false,
    });
  };

  const handleAddAddresses = async () => {
    await addToAllowlist.mutateAsync({
      collectionAddress: '0x...',
      addresses: ['0x...', '0x...'],
    });
  };

  return (
    <div>
      <button onClick={handleSetup}>Setup Allowlist</button>
      <button onClick={handleAddAddresses}>Add Addresses</button>
    </div>
  );
}
```

## Best Practices

::alert{type="success"}
**Use mutation hooks for writes:**

```tsx
const { listNFT } = useExchange();
await listNFT.mutateAsync({...});
```
::

::alert{type="success"}
**Use query hooks for reads:**

```tsx
const { data } = useGetActiveListings({ page: 1, limit: 20 });
```
::

::alert{type="info"}
**Handle loading states:**

```tsx
{mutation.isPending && <Spinner />}
```
::

::alert{type="warning"}
**Always handle errors:**

```tsx
{mutation.isError && <ErrorMessage error={mutation.error} />}
```
::

::alert{type="info"}
**Use batch operations for efficiency (v2.1.2):**

```tsx
// Gas-efficient batch listing
const { listingIds } = await batchListNFT.mutateAsync({
  collectionAddress: '0x...',
  tokenIds: ['1', '2', '3'],
  amounts: ['5', '10', '15'],
  prices: ['1.0', '2.0', '3.0'],
  duration: 86400,
});
```
::

## Complete Example (v2.1.2)

```tsx
import {
  useExchange,
  useWallet,
  useCollection,
} from 'zuno-marketplace-sdk/react';

function NFTMarketplace() {
  const { address, connect, isConnected } = useWallet();
  const { listNFT, batchListNFT, buyNFT } = useExchange();
  const { mintERC721, setupAllowlist, addToAllowlist } = useCollection();

  const handleList = async () => {
    try {
      // ERC721 listing
      const { listingId, tx } = await listNFT.mutateAsync({
        collectionAddress: '0x...',
        tokenId: '1',
        price: '1.5',
        duration: 86400,
      });
      await tx.wait();
      alert(`Listed with ID: ${listingId}`);
    } catch (error) {
      console.error('Failed to list:', error);
    }
  };

  const handleBatchList = async () => {
    try {
      // ERC1155 batch listing
      const { listingIds } = await batchListNFT.mutateAsync({
        collectionAddress: '0x...',
        tokenIds: ['1', '2', '3'],
        amounts: ['5', '10', '15'],
        prices: ['1.0', '2.0', '3.0'],
        duration: 86400,
      });
      alert(`Listed ${listingIds.length} NFTs`);
    } catch (error) {
      console.error('Batch listing failed:', error);
    }
  };

  if (!isConnected) {
    return <button onClick={connect}>Connect Wallet</button>;
  }

  return (
    <div>
      <p>Connected: {address}</p>
      <button onClick={handleList} disabled={listNFT.isPending}>
        {listNFT.isPending ? 'Listing...' : 'List NFT'}
      </button>
      <button onClick={handleBatchList} disabled={batchListNFT.isPending}>
        {batchListNFT.isPending ? 'Listing...' : 'Batch List (3)'}
      </button>
    </div>
  );
}
```

## See Also

- **[Quick Start](/sdk/getting-started/quick-start)** - Setup guide
- **[Exchange Module](/sdk/core-modules/exchange)** - Trading API
- **[Collection Module](/sdk/core-modules/collection)** - NFT creation with allowlist
- **[Auction Module](/sdk/core-modules/auction)** - Auction API
