---
title: "React Hooks API Reference"
package: "sdk"
scope: "api-reference"
complexity: "intermediate"
category: "api"
---

All React hooks with signatures, return values, and examples.

## Core Hooks

### useExchange

Exchange operations hook.

**Signature:**
```typescript
function useExchange(): {
  listNFT: UseMutationResult<...>;
  batchListNFT: UseMutationResult<...>;
  buyNFT: UseMutationResult<...>;
  cancelListing: UseMutationResult<...>;
  updateListingPrice: UseMutationResult<...>;
}
```

**Example:**
```tsx
const { listNFT } = useExchange();
const { listingId } = await listNFT.mutateAsync({...});
```

### useAuction

Auction operations hook.

```typescript
function useAuction(): {
  createEnglishAuction: UseMutationResult<...>;
  batchCreateEnglishAuction: UseMutationResult<...>;
  placeBid: UseMutationResult<...>;
  batchCancelAuction: UseMutationResult<...>;
}
```

### useCollection

Collection operations hook.

```typescript
function useCollection(): {
  createERC721Collection: UseMutationResult<...>;
  mintERC721: UseMutationResult<...>;
  setupAllowlist: UseMutationResult<...>;
  addToAllowlist: UseMutationResult<...>;
}
```

## Wallet Hooks

### useWallet

Wallet connection and account info.

```typescript
function useWallet(): {
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  chainId: number | null;
}
```

## Utility Hooks

### useZunoSDK

Access SDK instance.

```typescript
function useZunoSDK(): ZunoSDK
```

### useZunoLogger

Logger instance.

```typescript
function useZunoLogger(): Logger
```

### useABIs

Contract ABIs.

```typescript
function useABIs(): Record<string, any[]>
```

### useProviderSync (v2.1.2)

WagmiProviderSync status.

```typescript
function useProviderSync(): {
  isSynced: boolean;
  isSyncing: boolean;
}
```

## See Also

- [React Hooks Overview](/sdk/react-hooks/overview) - Hook patterns
- [Integration Guides](/sdk/integration-guides/nextjs-setup) - Setup examples
