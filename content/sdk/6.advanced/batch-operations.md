---
title: "Batch Operations"
package: "sdk"
scope: "guide"
complexity: "advanced"
category: "advanced"
---

Execute multiple blockchain operations in a single transaction with batch operations (v2.1.2).

## Overview

Batch operations allow you to execute multiple similar operations in a single transaction, providing:

- **Gas Savings** ~20x cheaper than individual transactions
- **Atomicity** All operations succeed or fail together
- **Efficiency** Reduced RPC calls and confirmation times

## Limitations

| Constraint | Value | Notes |
|------------|-------|-------|
| Max items per batch | 20 | Hard limit |
| Same collection | Required | For efficiency |
| Partial failure | Not supported | All or nothing |

## Batch List NFTs

List multiple ERC1155 tokens at once.

```typescript
const { listingIds, tx } = await sdk.exchange.batchListNFT({
  collectionAddress: '0x...',
  tokenIds: ['1', '2', '3', '4', '5'],
  amounts: ['5', '10', '15', '20', '25'],
  prices: ['1.0', '2.0', '3.0', '4.0', '5.0'],
  duration: 86400,
});

console.log(`Created ${listingIds.length} listings`);
await tx.wait();
```

## Batch Create Auctions

Create up to 20 English auctions.

```typescript
const { auctionIds, tx } = await sdk.auction.batchCreateEnglishAuction({
  collectionAddress: '0x...',
  tokenIds: ['1', '2', '3', '4', '5'],
  startingBid: '1.0',
  duration: 86400 * 7,
});

console.log(`Created ${auctionIds.length} auctions`);
await tx.wait();
```

## Batch Cancel Auctions

Cancel multiple auctions at once.

```typescript
const { cancelledCount, tx } = await sdk.auction.batchCancelAuction([
  'auction-1',
  'auction-2',
  'auction-3',
]);

console.log(`Cancelled ${cancelledCount} auctions`);
await tx.wait();
```

## Progress Tracking

Track batch operation progress (when supported):

```typescript
// Note: Progress tracking is planned for future versions
// Currently, batch operations return final results
```

## React Hooks

```tsx
function BatchListComponent() {
  const { batchListNFT } = useExchange();

  const handleBatchList = async () => {
    const { listingIds } = await batchListNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenIds: ['1', '2', '3'],
      amounts: ['5', '10', '15'],
      prices: ['1.0', '2.0', '3.0'],
      duration: 86400,
    });

    toast.success(`Listed ${listingIds.length} NFTs`);
  };

  return <button onClick={handleBatchList}>Batch List (3)</button>;
}
```

## Best Practices

::alert{type="success"}
**Use for same collection:** Batch operations are most efficient when all items are from the same collection.
::

::alert{type="warning"}
**Validate arrays first:** Ensure all arrays have matching lengths before calling batch methods.
::

::alert{type="info"}
**Consider splitting large batches:** If you have 100+ items, split into multiple batches of 20.
::

## See Also

- [ERC1155 Support](/sdk/advanced/erc1155-support) - Batch operations work best with ERC1155
- [Exchange API](/sdk/api-reference/exchange-api) - Method signatures
