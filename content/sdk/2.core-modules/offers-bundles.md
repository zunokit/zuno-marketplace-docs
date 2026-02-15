---
title: "Offers & Bundles"
package: "sdk"
lastUpdated: "2024-11-24"
scope: "api-reference"
complexity: "intermediate"
category: "core-modules"
relatedTopics:
  - "exchange"
  - "auction"
---

Handle NFT offers and bundle sales with the Offers & Bundles module.

## Overview

This module provides functionality for:

- **Make Offers** - Submit offers on NFTs not listed for sale
- **Accept Offers** - Sellers can accept offers on their NFTs
- **Create Bundles** - Package multiple NFTs for bulk sale
- **Buy Bundles** - Purchase NFT bundles at discounted prices

## Make Offer

Submit an offer on an NFT, even if it's not listed.

```typescript
await sdk.offers.makeOffer({
  collectionAddress: '0x...',
  tokenId: '1',
  price: '0.5',
  duration: 86400,  // 24 hours
});
```

**Parameters:**

| Field | Type | Description |
|-------|------|-------------|
| `collectionAddress` | `string` | NFT contract address |
| `tokenId` | `string` | Token ID to make offer on |
| `price` | `string` | Offer amount in ETH |
| `duration` | `number` | Offer expiration in seconds |

## Create Bundle

Package multiple NFTs for sale as a bundle.

```typescript
await sdk.bundles.createBundle({
  nfts: [
    { collection: '0x...', tokenId: '1' },
    { collection: '0x...', tokenId: '2' },
    { collection: '0x...', tokenId: '3' },
  ],
  price: '2.5',
  duration: 86400 * 7,  // 7 days
});
```

**Parameters:**

| Field | Type | Description |
|-------|------|-------------|
| `nfts` | `Array` | Array of NFT objects |
| `price` | `string` | Bundle price in ETH |
| `duration` | `number` | Bundle duration in seconds |

## Use Cases

### Floor Price Offers

Make offers below listing prices to negotiate:

```typescript
// NFT listed at 1.5 ETH
await sdk.offers.makeOffer({
  collectionAddress: '0x...',
  tokenId: '1',
  price: '1.2',  // 20% below floor
  duration: 86400,
});
```

### Bundle Discounts

Sell multiple NFTs at a discounted rate:

```typescript
// Individual NFTs worth 1 ETH each
// Bundle of 3 for 2.5 ETH (17% discount)
await sdk.bundles.createBundle({
  nfts: [...],
  price: '2.5',
  duration: 86400 * 7,
});
```

## See Also

- **[Exchange Module](/core-modules/exchange)** - Standard fixed-price sales
- **[Auction Module](/core-modules/auction)** - Competitive bidding
