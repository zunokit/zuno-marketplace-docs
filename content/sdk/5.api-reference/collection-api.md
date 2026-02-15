---
title: "Collection API Reference"
package: "sdk"
scope: "api-reference"
complexity: "intermediate"
category: "api"
---

Collection module API for creating NFT collections and managing allowlists (v2.1.2).

## Methods

### getCollection

Get collection details.

```typescript
function getCollection(collectionAddress: string): Promise<Collection>
```

### createERC721Collection

Deploy new ERC721 collection.

```typescript
function createERC721Collection(params: {
  name: string;
  symbol: string;
  baseUri: string;
  maxSupply: number;
}): Promise<{ address: string; tx: TransactionResponse }>
```

**Example:**
```typescript
const { address, tx } = await sdk.collection.createERC721Collection({
  name: 'My NFTs',
  symbol: 'MNFT',
  baseUri: 'ipfs://QmYourHash/',
  maxSupply: 10000,
});
```

### mintERC721

Mint single NFT.

```typescript
function mintERC721(params: {
  collectionAddress: string;
  recipient: string;
  value?: string;
}): Promise<{ tokenId: string; tx: TransactionResponse }>
```

### setupAllowlist (v2.1.2)

Configure allowlist.

```typescript
function setupAllowlist(params: {
  collectionAddress: string;
  ownerMintLimit: number;
  allowlistOnly: boolean;
}): Promise<{ tx: TransactionResponse }>
```

### addToAllowlist (v2.1.2)

Add addresses to allowlist.

```typescript
function addToAllowlist(params: {
  collectionAddress: string;
  addresses: string[];
}): Promise<{ tx: TransactionResponse }>
```

### setAllowlistOnly (v2.1.2)

Enable/disable allowlist-only mode.

```typescript
function setAllowlistOnly(params: {
  collectionAddress: string;
  enabled: boolean;
}): Promise<{ tx: TransactionResponse }>
```

### isInAllowlist (v2.1.2)

Check if address is allowlisted.

```typescript
function isInAllowlist(params: {
  collectionAddress: string;
  address: string;
}): Promise<boolean>
```

## See Also

- [Collection Module](/core-modules/collection) - Usage guide
- [Hooks API](/api-reference/hooks-api) - `useCollection` hook
