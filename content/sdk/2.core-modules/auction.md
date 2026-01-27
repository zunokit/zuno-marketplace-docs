---
title: "Auction Module"
package: "sdk"
lastUpdated: "2026-01-27"
scope: "api-reference"
complexity: "intermediate"
category: "core-modules"
relatedTopics:
  - "exchange"
  - "collection"
---

The Auction module implements English auction functionality for NFT sales with competitive bidding and batch operations.

## Overview

The Auction module provides:

- **Create English auctions** - Time-bound auctions with starting bids
- **Batch create auctions** - Create up to 20 auctions in one transaction (v2.1.2)
- **Place bids** - Submit competitive bids on active auctions
- **Batch cancel auctions** - Cancel multiple auctions at once (v2.1.2)
- **Query auctions** - Get active auctions and auction history
- **Settle auctions** - Finalize auction and transfer NFT to winner

## API Reference

### Create English Auction

Start a new auction for an NFT with a starting bid and duration.

```typescript
const { auctionId, tx } = await sdk.auction.createEnglishAuction({
  collectionAddress: '0x...',
  tokenId: '1',
  startingBid: '1.0',
  duration: 86400 * 7,  // 7 days in seconds
});
```

**Parameters:**

| Field | Type | Description |
|-------|------|-------------|
| `collectionAddress` | `string` | NFT contract address |
| `tokenId` | `string` | Token ID to auction |
| `startingBid` | `string` | Minimum bid in ETH |
| `duration` | `number` | Auction duration in seconds |

**Returns:**

```typescript
{
  auctionId: string;  // Unique auction identifier
  tx: TransactionResponse;
}
```

### Batch Create English Auctions (v2.1.2)

Create multiple auctions in a single transaction (max 20 auctions).

```typescript
const { auctionIds, tx } = await sdk.auction.batchCreateEnglishAuction({
  collectionAddress: '0x...',
  tokenIds: ['1', '2', '3'],     // Up to 20 token IDs
  startingBid: '1.0',             // Same starting bid for all
  duration: 86400 * 7,
});
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `collectionAddress` | `string` | Yes | NFT contract address |
| `tokenIds` | `string[]` | Yes | Token IDs to auction (max 20) |
| `startingBid` | `string` | Yes | Minimum bid in ETH (same for all) |
| `duration` | `number` | Yes | Auction duration in seconds |

**Returns:**

```typescript
{
  auctionIds: string[];  // Array of auction IDs
  tx: TransactionResponse;
}
```

::alert{type="info"}
**Gas Efficient:** Batch operations save significant gas compared to creating auctions individually. Creating 20 auctions separately would cost ~20x more in gas fees.
::

### Place Bid

Submit a bid on an active auction.

```typescript
const { tx } = await sdk.auction.placeBid({
  auctionId: '1',
  amount: '1.5',
});
```

**Parameters:**

| Field | Type | Description |
|-------|------|-------------|
| `auctionId` | `string` | Auction to bid on |
| `amount` | `string` | Bid amount in ETH |

**Bid Requirements:**
- Must be higher than current highest bid
- Must exceed starting bid if first bid
- Typically requires 5-10% minimum increment

### Batch Cancel Auctions (v2.1.2)

Cancel multiple auctions at once.

```typescript
const { cancelledCount, tx } = await sdk.auction.batchCancelAuction([
  'auction-id-1',
  'auction-id-2',
  'auction-id-3',
]);
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `auctionIds` | `string[]` | Yes | Auction IDs to cancel |

**Returns:**

```typescript
{
  cancelledCount: number;  // Number of auctions cancelled
  tx: TransactionResponse;
}
```

### Cancel Auction

Cancel a single active auction.

```typescript
const { tx } = await sdk.auction.cancelAuction('auctionId');
```

**Conditions:**
- Only auction creator can cancel
- Must have no bids (or based on contract rules)
- Auction must still be active

### Get Active Auctions

Query all active auctions with pagination.

```typescript
const { items, total } = await sdk.auction.getActiveAuctions(
  1,   // Page number
  20   // Items per page
);
```

**Returns:**

```typescript
{
  items: Auction[];
  total: number;
}

interface Auction {
  id: string;
  seller: string;
  collectionAddress: string;
  tokenId: string;
  startingBid: string;
  currentBid: string;
  highestBidder: string;
  endsAt: number;
  status: 'active' | 'settled' | 'cancelled';
}
```

### Get Auctions by Seller

Get all auctions created by a specific seller.

```typescript
const { items } = await sdk.auction.getAuctionsBySeller(
  '0xSellerAddress...',
  1,   // Page
  20   // Limit
);
```

## React Hooks

Use the `useAuction` hook for React integration:

```tsx
import { useAuction } from 'zuno-marketplace-sdk/react';

function AuctionComponent() {
  const {
    createEnglishAuction,
    batchCreateEnglishAuction,
    placeBid,
    batchCancelAuction,
    cancelAuction
  } = useAuction();

  // Create single auction
  const handleCreateAuction = async () => {
    const { auctionId, tx } = await createEnglishAuction.mutateAsync({
      collectionAddress: '0x...',
      tokenId: '1',
      startingBid: '1.0',
      duration: 86400 * 7,
    });

    console.log('Auction created:', auctionId);
    await tx.wait();
  };

  // Batch create multiple auctions
  const handleBatchCreate = async () => {
    const { auctionIds, tx } = await batchCreateEnglishAuction.mutateAsync({
      collectionAddress: '0x...',
      tokenIds: ['1', '2', '3', '4', '5'],
      startingBid: '1.0',
      duration: 86400 * 7,
    });

    console.log('Created auctions:', auctionIds.length);
    await tx.wait();
  };

  // Place bid
  const handlePlaceBid = async () => {
    const { tx } = await placeBid.mutateAsync({
      auctionId: '1',
      amount: '1.5',
    });

    await tx.wait();
  };

  // Batch cancel auctions
  const handleBatchCancel = async () => {
    const { cancelledCount, tx } = await batchCancelAuction.mutateAsync([
      'auction-1',
      'auction-2',
      'auction-3',
    ]);

    console.log('Cancelled:', cancelledCount);
    await tx.wait();
  };

  return (
    <div>
      <button onClick={handleCreateAuction}>Create Auction</button>
      <button onClick={handleBatchCreate}>Batch Create (5)</button>
      <button onClick={handlePlaceBid}>Place Bid</button>
      <button onClick={handleBatchCancel}>Batch Cancel</button>
    </div>
  );
}
```

## Complete Example

```typescript
import { ZunoSDK } from 'zuno-marketplace-sdk';

const sdk = new ZunoSDK({
  apiKey: 'your-api-key',
  network: 'sepolia',
});

async function runAuction() {
  // Step 1: Create single auction
  const { auctionId, tx: createTx } =
    await sdk.auction.createEnglishAuction({
      collectionAddress: '0x1234...',
      tokenId: '42',
      startingBid: '1.0',
      duration: 86400 * 3,  // 3 days
    });

  await createTx.wait();
  console.log('Auction created:', auctionId);

  // Step 2: Batch create multiple auctions
  const { auctionIds, tx: batchTx } =
    await sdk.auction.batchCreateEnglishAuction({
      collectionAddress: '0x1234...',
      tokenIds: ['1', '2', '3', '4', '5'],
      startingBid: '0.5',
      duration: 86400 * 7,
    });

  await batchTx.wait();
  console.log('Created', auctionIds.length, 'auctions');

  // Step 3: Place bid
  const { tx: bidTx } = await sdk.auction.placeBid({
    auctionId,
    amount: '1.2',
  });

  await bidTx.wait();
  console.log('Bid placed successfully');

  // Step 4: Query active auctions
  const { items } = await sdk.auction.getActiveAuctions(1, 20);
  console.log(`Found ${items.length} active auctions`);

  // Step 5: Batch cancel auctions (if needed)
  const { cancelledCount, tx: cancelTx } =
    await sdk.auction.batchCancelAuction(auctionIds.slice(0, 3));

  await cancelTx.wait();
  console.log('Cancelled', cancelledCount, 'auctions');
}

runAuction();
```

## Auction Lifecycle

```mermaid
graph LR
    A[Create Auction] --> B[Active]
    B --> C[Receive Bids]
    C --> D{Duration Ended?}
    D -->|Yes| E[Settle Auction]
    D -->|No| C
    E --> F[Transfer NFT to Winner]
    B --> G[Cancel]
    H[Batch Create] --> B
    B --> I[Batch Cancel]
```

## Error Handling

```typescript
try {
  await sdk.auction.placeBid({
    auctionId: '1',
    amount: '1.5',
  });
} catch (error) {
  if (error.message.includes('Bid too low')) {
    console.error('Your bid must be higher than current bid');
  } else if (error.message.includes('Auction ended')) {
    console.error('This auction has already ended');
  } else if (error.code === 'INSUFFICIENT_FUNDS') {
    console.error('Insufficient balance for bid');
  } else {
    console.error('Bid failed:', error);
  }
}
```

## Best Practices

::alert{type="success"}
**Approve NFT before creating auction:**

```typescript
const approval = await nftContract.approve(
  AUCTION_CONTRACT_ADDRESS,
  tokenId
);
await approval.wait();
```
::

::alert{type="info"}
**Use batch operations for efficiency** - When listing multiple NFTs for auction:

```typescript
// More efficient than individual calls
const { auctionIds } = await sdk.auction.batchCreateEnglishAuction({
  collectionAddress: '0x...',
  tokenIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  startingBid: '1.0',
  duration: 86400 * 7,
});
```
::

::alert{type="warning"}
**Check auction end time** before bidding:

```typescript
const { items } = await sdk.auction.getActiveAuctions(1, 100);
const auction = items.find(a => a.id === auctionId);

if (auction.endsAt < Date.now() / 1000) {
  console.warn('Auction has ended');
}
```
::

## See Also

- **[Exchange Module](/sdk/core-modules/exchange)** - Fixed-price NFT sales
- **[Collection Module](/sdk/core-modules/collection)** - Create NFT collections
- **[Offers & Bundles](/sdk/core-modules/offers-bundles)** - Alternative sale methods
