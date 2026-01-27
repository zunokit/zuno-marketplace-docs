---
title: "ERC1155 Support"
package: "sdk"
scope: "guide"
complexity: "advanced"
category: "advanced"
---

Complete guide for ERC1155 multi-token support in Zuno SDK v2.1.2.

## ERC1155 vs ERC721

| Feature | ERC721 | ERC1155 |
|---------|--------|---------|
| Tokens per ID | 1 | Many |
| Listing | Single token | Multi-token |
| Purchase | Whole token | Partial amount |
| Standard | Unique tokens | Fractional/semi-fungible |

## Auto Token Detection

SDK automatically detects token standard:

```typescript
// Works for both ERC721 and ERC1155
const { listingId } = await sdk.exchange.listNFT({
  collectionAddress: '0x...',
  tokenId: '1',
  price: '1.5',
  duration: 86400,
  // amount optional for ERC1155
});
```

## List ERC1155 with Amount

```typescript
const { listingId, tx } = await sdk.exchange.listNFT({
  collectionAddress: '0x...',
  tokenId: '1',
  amount: '10',   // List 10 tokens
  price: '1.5',   // Price per token
  duration: 86400,
});

// Total listed value: 15 ETH (10 × 1.5)
```

## Buy ERC1155 Tokens

```typescript
const { tx } = await sdk.exchange.buyNFT({
  listingId: '0x...',
  amount: '5',    // Buy 5 of 10 listed
  value: '7.5',   // 5 × 1.5 = 7.5 ETH
});
```

## Query ERC1155 Listings

```typescript
const listing = await sdk.exchange.getListing('0x...');

// ERC1155 listings include amount
if (listing.tokenStandard === 'ERC1155') {
  console.log(`Available: ${listing.amount}`); // e.g., "10"
  console.log(`Price per token: ${listing.price}`);
}
```

## Batch Operations with ERC1155

```typescript
const { listingIds } = await sdk.exchange.batchListNFT({
  collectionAddress: '0x...',
  tokenIds: ['1', '2', '3'],
  amounts: ['5', '10', '15'], // Different amounts per token
  prices: ['1.0', '2.0', '3.0'],
  duration: 86400,
});
```

## Amount Validation

SDK validates amounts before transactions:

```typescript
// Valid: 10 tokens available, listing 5
await listNFT({ amount: '5', ... });  // ✓ OK

// Invalid: Only 10 available, listing 15
await listNFT({ amount: '15', ... }); // ✗ Error: Insufficient amount
```

## React Hooks

```tsx
function ERC1155Component() {
  const { listNFT } = useExchange();

  const handleList = async () => {
    const { listingId } = await listNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenId: '1',
      amount: '10',
      price: '1.5',
      duration: 86400,
    });
  };
}
```

## Best Practices

::alert{type="success"}
**Check available amount:** Verify balance before listing large amounts.
::

::alert{type="info"}
**Use batch for ERC1155:** ERC1155 is designed for batch operations.
::

::alert{type="warning"}
**Validate amount input:** Always validate user-provided amounts.
::

## See Also

- [Batch Operations](/sdk/advanced/batch-operations) - Multi-token batch listings
- [Exchange API](/sdk/api-reference/exchange-api) - Full API reference
