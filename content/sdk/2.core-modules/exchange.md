---
title: "Exchange Module"
package: "sdk"
lastUpdated: "2026-01-27"
scope: "api-reference"
complexity: "intermediate"
category: "core-modules"
relatedTopics:
  - "collection"
  - "auction"
  - "offers-bundles"
---

The Exchange module handles NFT listings, purchases, price updates, and cancellations for both ERC721 and ERC1155 tokens.

## Overview

The Exchange module provides methods for:

- **Listing NFTs** for sale at fixed prices (ERC721 & ERC1155)
- **Buying NFTs** from active listings
- **Updating listing prices** for active listings
- **Canceling listings** to remove NFTs from sale
- **Batch operations** for efficient multi-token listings
- **Querying listings** to get active marketplace data

## ERC721 & ERC1155 Support

::alert{type="info"}
**v2.1.2 Feature:** The Exchange module now supports both ERC721 and ERC1155 tokens. The SDK automatically detects the token standard based on the contract.

- **ERC721:** Single token listings (backward compatible)
- **ERC1155:** Multi-token listings with `amount` parameter
::

## API Reference

### List NFT for Sale

Create a new fixed-price listing for an NFT.

**ERC721 Listing (backward compatible):**

```typescript
const { listingId, tx } = await sdk.exchange.listNFT({
  collectionAddress: '0x...',
  tokenId: '1',
  price: '1.5',        // Price in ETH
  duration: 86400,     // Duration in seconds (24 hours)
});
```

**ERC1155 Listing (with amount):**

```typescript
const { listingId, tx } = await sdk.exchange.listNFT({
  collectionAddress: '0x...',
  tokenId: '1',
  amount: '10',        // List 10 tokens (ERC1155 only)
  price: '1.5',        // Price per token in ETH
  duration: 86400,
});
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `collectionAddress` | `string` | Yes | NFT contract address |
| `tokenId` | `string` | Yes | Token ID to list |
| `price` | `string` | Yes | Listing price in ETH |
| `duration` | `number` | Yes | Listing duration in seconds |
| `amount` | `string` | No | Amount for ERC1155 (defaults to "1") |

**Returns:**

```typescript
{
  listingId: string;  // Unique listing identifier
  tx: TransactionResponse;  // Ethers transaction object
}
```

### Batch List NFTs (v2.1.2)

List multiple ERC1155 tokens in a single transaction (max 20).

```typescript
const { listingIds, tx } = await sdk.exchange.batchListNFT({
  collectionAddress: '0x...',
  tokenIds: ['1', '2', '3'],      // Up to 20 token IDs
  amounts: ['5', '10', '15'],     // Corresponding amounts
  prices: ['1.0', '2.0', '3.0'],  // Price per token
  duration: 86400,
});
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `collectionAddress` | `string` | Yes | NFT contract address |
| `tokenIds` | `string[]` | Yes | Token IDs to list (max 20) |
| `amounts` | `string[]` | Yes | Amount for each token ID |
| `prices` | `string[]` | Yes | Price for each token ID |
| `duration` | `number` | Yes | Listing duration in seconds |

**Returns:**

```typescript
{
  listingIds: string[];  // Array of listing IDs
  tx: TransactionResponse;
}
```

### Buy NFT

Purchase an NFT from an active listing.

**ERC721 Purchase:**

```typescript
const { tx } = await sdk.exchange.buyNFT({
  listingId: '0x...',
  value: '1.5',  // Must match listing price
});
```

**ERC1155 Purchase:**

```typescript
const { tx } = await sdk.exchange.buyNFT({
  listingId: '0x...',
  amount: '5',   // Number of tokens to buy
  value: '7.5',  // price × amount
});
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `listingId` | `string` | Yes | Listing ID to purchase |
| `value` | `string` | Yes | Total purchase amount in ETH |
| `amount` | `string` | No | Amount for ERC1155 (defaults to "1") |

### Update Listing Price

Update the price of an existing listing.

```typescript
const { tx } = await sdk.exchange.updateListingPrice(
  'listingId',
  '2.0'  // New price in ETH
);
```

### Cancel Listing

Remove an NFT from sale by canceling its listing.

```typescript
const { tx } = await sdk.exchange.cancelListing('listingId');
```

### Get Active Listings

Query active marketplace listings with pagination.

```typescript
const { items, total } = await sdk.exchange.getActiveListings(
  1,   // Page number
  20   // Items per page
);
```

**Returns:**

```typescript
{
  items: Listing[];
  total: number;
  page: number;
  limit: number;
}
```

**Listing Object:**

```typescript
interface Listing {
  id: string;
  seller: string;
  collectionAddress: string;
  tokenId: string;
  amount?: string;      // ERC1155 amount (v2.1.2)
  price: string;
  expiresAt: number;
  tokenStandard: 'ERC721' | 'ERC1155';  // v2.1.2
  status: 'active' | 'sold' | 'cancelled';
}
```

## React Hooks

For React applications, use the `useExchange` hook:

```tsx
import { useExchange } from 'zuno-marketplace-sdk/react';

function MarketplaceComponent() {
  const {
    listNFT,
    batchListNFT,
    buyNFT,
    updateListingPrice,
    cancelListing
  } = useExchange();

  // List ERC721 NFT
  const handleListERC721 = async () => {
    const { listingId, tx } = await listNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenId: '1',
      price: '1.5',
      duration: 86400,
    });
  };

  // List ERC1155 NFTs with amount
  const handleListERC1155 = async () => {
    const { listingId, tx } = await listNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenId: '1',
      amount: '10',  // List 10 tokens
      price: '1.5',
      duration: 86400,
    });
  };

  // Batch list multiple ERC1155 tokens
  const handleBatchList = async () => {
    const { listingIds, tx } = await batchListNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenIds: ['1', '2', '3'],
      amounts: ['5', '10', '15'],
      prices: ['1.0', '2.0', '3.0'],
      duration: 86400,
    });
  };

  // Buy NFT
  const handleBuy = async () => {
    const { tx } = await buyNFT.mutateAsync({
      listingId: '0x...',
      amount: '5',
      value: '7.5',
    });
  };
}
```

## Complete Example

```typescript
import { ZunoSDK } from 'zuno-marketplace-sdk';

const sdk = new ZunoSDK({
  apiKey: 'your-api-key',
  network: 'sepolia',
});

// Step 1: List ERC721 NFT
const { listingId: erc721Listing, tx: listTx } = await sdk.exchange.listNFT({
  collectionAddress: '0x1234...',
  tokenId: '42',
  price: '1.5',
  duration: 86400 * 7,
});
await listTx.wait();

// Step 2: List ERC1155 tokens with amount
const { listingId: erc1155Listing, tx: list1155Tx } = await sdk.exchange.listNFT({
  collectionAddress: '0x5678...',
  tokenId: '1',
  amount: '10',
  price: '0.5',
  duration: 86400 * 7,
});
await list1155Tx.wait();

// Step 3: Batch list multiple ERC1155 tokens
const { listingIds, tx: batchTx } = await sdk.exchange.batchListNFT({
  collectionAddress: '0x5678...',
  tokenIds: ['2', '3', '4'],
  amounts: ['5', '10', '15'],
  prices: ['0.5', '1.0', '1.5'],
  duration: 86400 * 7,
});
await batchTx.wait();

// Step 4: Get active listings
const { items } = await sdk.exchange.getActiveListings(1, 20);
console.log('Active listings:', items.length);

// Step 5: Update price
const { tx: updateTx } = await sdk.exchange.updateListingPrice(
  erc721Listing,
  '2.0'
);
await updateTx.wait();

// Step 6: Cancel listing
const { tx: cancelTx } = await sdk.exchange.cancelListing(erc721Listing);
await cancelTx.wait();
```

## Error Handling

```typescript
try {
  const { tx } = await sdk.exchange.buyNFT({
    listingId: '0x...',
    amount: '5',
    value: '7.5',
  });
  await tx.wait();
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    console.error('Insufficient balance');
  } else if (error.message.includes('Listing expired')) {
    console.error('This listing has expired');
  } else if (error.message.includes('Insufficient amount')) {
    console.error('Not enough tokens available');
  } else {
    console.error('Transaction failed:', error);
  }
}
```

## Best Practices

::alert{type="success"}
**Auto token detection** - The SDK automatically detects ERC721 vs ERC1155. You don't need to specify the token standard:

```typescript
// Works for both ERC721 and ERC1155
const { listingId } = await sdk.exchange.listNFT({
  collectionAddress: '0x...',
  tokenId: '1',
  price: '1.5',
  duration: 86400,
  // amount is optional - SDK handles it
});
```
::

::alert{type="warning"}
**Check available amount** before buying ERC1155:

```typescript
const listing = await sdk.exchange.getListing('0x...');

if (listing.tokenStandard === 'ERC1155' && listing.amount) {
  const maxBuyable = parseInt(listing.amount);
  if (maxBuyable < parseInt(yourDesiredAmount)) {
    console.warn('Not enough tokens available');
  }
}
```
::

::alert{type="info"}
**Batch operations are gas-efficient** - Use `batchListNFT` for listing multiple ERC1155 tokens:

```typescript
// More efficient than individual calls
const { listingIds } = await sdk.exchange.batchListNFT({
  collectionAddress: '0x...',
  tokenIds: ['1', '2', '3', '4', '5'],
  amounts: ['10', '10', '10', '10', '10'],
  prices: ['1.0', '1.0', '1.0', '1.0', '1.0'],
  duration: 86400,
});
```
::

## See Also

- **[Collection Module](/core-modules/collection)** - Create and mint NFT collections
- **[Auction Module](/core-modules/auction)** - Implement auction functionality
- **[Offers & Bundles](/core-modules/offers-bundles)** - Handle offers and bundle sales
