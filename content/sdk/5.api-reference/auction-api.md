---
title: "Auction API Reference"
package: "sdk"
scope: "api-reference"
complexity: "intermediate"
category: "api"
---

Auction module API for English auctions, bidding, and batch operations.

## Methods

### getAuction

Get single auction by ID.

```typescript
function getAuction(auctionId: string): Promise<Auction>
```

### getActiveAuctions

Query active auctions with pagination.

```typescript
function getActiveAuctions(options?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Auction>>
```

### createEnglishAuction

Create a new English auction.

```typescript
function createEnglishAuction(params: {
  collectionAddress: string;
  tokenId: string;
  startingBid: string;
  duration: number;
}): Promise<{ auctionId: string; tx: TransactionResponse }>
```

**Example:**
```typescript
const { auctionId, tx } = await sdk.auction.createEnglishAuction({
  collectionAddress: '0x...',
  tokenId: '1',
  startingBid: '1.0',
  duration: 86400 * 7,  // 7 days
});
```

### batchCreateEnglishAuction (v2.1.2)

Create multiple auctions (max 20).

```typescript
function batchCreateEnglishAuction(params: {
  collectionAddress: string;
  tokenIds: string[];
  startingBid: string;
  duration: number;
}): Promise<{ auctionIds: string[]; tx: TransactionResponse }>
```

**Example:**
```typescript
const { auctionIds } = await sdk.auction.batchCreateEnglishAuction({
  collectionAddress: '0x...',
  tokenIds: ['1', '2', '3', '4', '5'],
  startingBid: '1.0',
  duration: 86400 * 7,
});
```

### placeBid

Submit a bid on an auction.

```typescript
function placeBid(params: {
  auctionId: string;
  amount: string;
}): Promise<{ tx: TransactionResponse }>
```

### batchCancelAuction (v2.1.2)

Cancel multiple auctions.

```typescript
function batchCancelAuction(auctionIds: string[]): Promise<{
  cancelledCount: number;
  tx: TransactionResponse;
}>
```

## See Also

- [Auction Module](/sdk/core-modules/auction) - Usage guide
- [Hooks API](/sdk/api-reference/hooks-api) - `useAuction` hook
