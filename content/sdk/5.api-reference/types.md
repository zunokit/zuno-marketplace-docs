---
title: "Type Definitions"
package: "sdk"
scope: "api-reference"
complexity: "intermediate"
category: "api"
---

Important TypeScript types used throughout the SDK.

## Configuration Types

### ZunoSDKConfig

SDK configuration object.

```typescript
interface ZunoSDKConfig {
  apiKey: string;
  network: number | "mainnet" | "sepolia" | "polygon" | "arbitrum";
  apiUrl?: string;
  rpcUrl?: string;
  wagmiConfig?: Config;
  cache?: {
    ttl?: number;
    gcTime?: number;
  };
  retryPolicy?: {
    maxRetries?: number;
    backoff?: "exponential" | "linear";
  };
  logger?: {
    level?: "none" | "error" | "warn" | "info" | "debug";
    timestamp?: boolean;
    modulePrefix?: boolean;
  };
}
```

## Entity Types

### Listing

NFT listing entity.

```typescript
interface Listing {
  id: string;
  seller: string;
  collectionAddress: string;
  tokenId: string;
  amount?: string;           // ERC1155 only (v2.1.2)
  price: string;
  expiresAt: number;
  tokenStandard: "ERC721" | "ERC1155";  // v2.1.2
  status: "active" | "sold" | "cancelled";
}
```

### Auction

Auction entity.

```typescript
interface Auction {
  id: string;
  seller: string;
  collectionAddress: string;
  tokenId: string;
  startingBid: string;
  currentBid: string;
  highestBidder: string;
  endsAt: number;
  status: "active" | "settled" | "cancelled";
}
```

### Collection

Collection entity.

```typescript
interface Collection {
  address: string;
  name: string;
  symbol: string;
  baseUri: string;
  maxSupply: number;
  totalSupply: number;
  owner: string;
}
```

## Transaction Types

### TransactionResult

Standard transaction result.

```typescript
interface TransactionResult {
  tx: TransactionResponse;
  listingId?: string;
  auctionId?: string;
  tokenId?: string;
}
```

### BatchOperationResult (v2.1.2)

Batch operation result.

```typescript
interface BatchOperationResult {
  listingIds: string[];
  auctionIds: string[];
  cancelledCount: number;
  tx: TransactionResponse;
}
```

## Error Types

### ZunoSDKError

SDK error class.

```typescript
class ZunoSDKError extends Error {
  code: ErrorCode;
  context?: Record<string, unknown>;
}
```

### ErrorCode

Error codes enum.

```typescript
enum ErrorCode {
  INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
  UNAUTHORIZED = "UNAUTHORIZED",
  INVALID_ADDRESS = "INVALID_ADDRESS",
  INVALID_AMOUNT = "INVALID_AMOUNT",
  NETWORK_ERROR = "NETWORK_ERROR",
  USER_REJECTED = "USER_REJECTED",
  CALL_EXCEPTION = "CALL_EXCEPTION",
}
```

## See Also

- [Error Handling](/sdk/integration-guides/error-handling) - Error patterns
- [Installation](/sdk/getting-started/installation) - Configuration
