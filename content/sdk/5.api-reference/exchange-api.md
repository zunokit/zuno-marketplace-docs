---
title: "Exchange API Reference"
package: "sdk"
scope: "api-reference"
complexity: "intermediate"
category: "api"
---

Complete API reference for the Exchange module handling NFT listings, purchases, and batch operations for both ERC721 and ERC1155 tokens.

## Methods

### getListing

Get a single listing by ID.

**Signature:**
```typescript
function getListing(listingId: string): Promise<Listing>
```

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `listingId` | `string` | Yes | Listing ID |

**Returns:**
```typescript
Promise<Listing>
```

**Example:**
```typescript
const listing = await sdk.exchange.getListing('0xabc123...');
console.log(listing.price); // "1.5"
```

**See Also:** `getActiveListings()`, `getListingsBySeller()`

---

### getActiveListings

Query active marketplace listings with pagination.

**Signature:**
```typescript
function getActiveListings(options: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Listing>>
```

**Parameters:**
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `page` | `number` | No | 1 | Page number |
| `limit` | `number` | No | 20 | Items per page (max 100) |

**Returns:**
```typescript
Promise<{
  items: Listing[];
  total: number;
  page: number;
  limit: number;
}>
```

**Example:**
```typescript
const { items, total } = await sdk.exchange.getActiveListings({
  page: 1,
  limit: 50,
});
console.log(`Found ${items.length} of ${total} listings`);
```

---

### listNFT

Create a new fixed-price listing for ERC721 or ERC1155 NFT.

**Signature:**
```typescript
function listNFT(params: {
  collectionAddress: string;
  tokenId: string;
  price: string;
  duration: number;
  amount?: string; // ERC1155 only
}): Promise<{ listingId: string; tx: TransactionResponse }>
```

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `collectionAddress` | `string` | Yes | NFT contract address |
| `tokenId` | `string` | Yes | Token ID to list |
| `price` | `string` | Yes | Price per token in ETH |
| `duration` | `number` | Yes | Listing duration (seconds) |
| `amount` | `string` | No | Amount for ERC1155 |

**Returns:**
```typescript
Promise<{
  listingId: string;
  tx: TransactionResponse;
}>
```

**Example (ERC721):**
```typescript
const { listingId, tx } = await sdk.exchange.listNFT({
  collectionAddress: '0x...',
  tokenId: '42',
  price: '1.5',
  duration: 86400,
});
await tx.wait();
```

**Example (ERC1155):**
```typescript
const { listingId, tx } = await sdk.exchange.listNFT({
  collectionAddress: '0x...',
  tokenId: '1',
  amount: '10',  // List 10 tokens
  price: '1.5',
  duration: 86400,
});
```

**Errors:**
- `INSUFFICIENT_FUNDS` - Not enough ETH for gas + approval
- `UNAUTHORIZED` - NFT not approved for transfer
- `INVALID_AMOUNT` - Amount exceeds available balance (ERC1155)

---

### batchListNFT (v2.2.1)

List multiple ERC1155 tokens in a single transaction.

**Signature:**
```typescript
function batchListNFT(params: {
  collectionAddress: string;
  tokenIds: string[];
  amounts: string[];
  prices: string[];
  duration: number;
}): Promise<{ listingIds: string[]; tx: TransactionResponse }>
```

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `collectionAddress` | `string` | Yes | NFT contract address |
| `tokenIds` | `string[]` | Yes | Token IDs (max 20) |
| `amounts` | `string[]` | Yes | Amount for each token |
| `prices` | `string[]` | Yes | Price for each token |
| `duration` | `number` | Yes | Listing duration (seconds) |

**Returns:**
```typescript
Promise<{
  listingIds: string[];
  tx: TransactionResponse;
}>
```

**Example:**
```typescript
const { listingIds, tx } = await sdk.exchange.batchListNFT({
  collectionAddress: '0x...',
  tokenIds: ['1', '2', '3'],
  amounts: ['5', '10', '15'],
  prices: ['1.0', '2.0', '3.0'],
  duration: 86400,
});
console.log(`Created ${listingIds.length} listings`);
```

**Errors:**
- `INVALID_BATCH_SIZE` - More than 20 items
- `ARRAY_MISMATCH` - tokenIds/amounts/prices length mismatch

---

### buyNFT

Purchase an NFT from an active listing.

**Signature:**
```typescript
function buyNFT(params: {
  listingId: string;
  value: string;
  amount?: string; // ERC1155 only
}): Promise<{ tx: TransactionResponse }>
```

**Example:**
```typescript
// ERC721
const { tx } = await sdk.exchange.buyNFT({
  listingId: '0x...',
  value: '1.5',
});

// ERC1155
const { tx } = await sdk.exchange.buyNFT({
  listingId: '0x...',
  amount: '5',   // Buy 5 of 10
  value: '7.5',  // 5 × 1.5
});
```

---

### cancelListing

Remove an NFT from sale.

**Signature:**
```typescript
function cancelListing(listingId: string): Promise<{ tx: TransactionResponse }>
```

---

### updateListingPrice

Update the price of an existing listing.

**Signature:**
```typescript
function updateListingPrice(params: {
  listingId: string;
  newPrice: string;
}): Promise<{ tx: TransactionResponse }>
```

## See Also

- [Exchange Module](/core-modules/exchange) - Usage guide
- [Hooks API](/api-reference/hooks-api) - `useExchange` hook
