---
title: "API Reference"
package: "sdk"
scope: "api-reference"
complexity: "intermediate"
category: "api"
---

Complete API reference for Zuno SDK v2.1.2. All methods, hooks, and types with signatures, parameters, return values, and examples.

## APIs

::card-grid
  ::card{icon="i-heroicons-arrow-path" title="Exchange API" to="/sdk/api-reference/exchange-api"}
  NFT listings, purchases, price updates, batch operations for ERC721 & ERC1155
  ::
  ::card{icon="i-heroicons-gavel" title="Auction API" to="/sdk/api-reference/auction-api"}
  English/Dutch auctions, bidding, batch operations
  ::
  ::card{icon="i-heroicons-cube" title="Collection API" to="/sdk/api-reference/collection-api"}
  Create collections, minting, allowlist management
  ::
  ::card{icon="i-heroicons-code-bracket" title="React Hooks" to="/sdk/api-reference/hooks-api"}
  All 10+ hooks with signatures and return values
  ::
  ::card{icon="i-heroicons-tag" title="Types" to="/sdk/api-reference/types"}
  Configuration, entity, transaction, and error types
  ::
::

## Quick Navigation

### Query Methods

| Method | Module | Description |
|--------|--------|-------------|
| `getListing()` | Exchange | Get single listing by ID |
| `getActiveListings()` | Exchange | Paginated active listings |
| `getListingsBySeller()` | Exchange | Seller's listings |
| `getAuction()` | Auction | Get single auction |
| `getActiveAuctions()` | Auction | Paginated active auctions |
| `getAuctionsBySeller()` | Auction | Seller's auctions |
| `getCollection()` | Collection | Collection details |
| `isInAllowlist()` | Collection | Check allowlist status |

### Mutation Methods

| Method | Module | Description |
|--------|--------|-------------|
| `listNFT()` | Exchange | List ERC721/ERC1155 |
| `batchListNFT()` | Exchange | Batch list (v2.1.2) |
| `buyNFT()` | Exchange | Purchase NFT |
| `cancelListing()` | Exchange | Remove listing |
| `updateListingPrice()` | Exchange | Update price |
| `createEnglishAuction()` | Auction | Create auction |
| `batchCreateEnglishAuction()` | Auction | Batch create (v2.1.2) |
| `placeBid()` | Auction | Submit bid |
| `batchCancelAuction()` | Auction | Batch cancel (v2.1.2) |
| `createERC721Collection()` | Collection | Deploy collection |
| `mintERC721()` | Collection | Mint NFT |
| `setupAllowlist()` | Collection | Config allowlist (v2.1.2) |
| `addToAllowlist()` | Collection | Add addresses (v2.1.2) |
| `setAllowlistOnly()` | Collection | Enable mode (v2.1.2) |

## See Also

- [Core Modules](/sdk/core-modules/exchange) - Usage guides
- [React Hooks](/sdk/react-hooks/overview) - Hook patterns
- [Integration Guides](/sdk/integration-guides/nextjs-setup) - Setup examples
