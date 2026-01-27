---
title: "Phase 4: API Reference"
description: "Create comprehensive API reference documentation for all SDK methods"
status: pending
priority: P2
effort: 1.5h
branch: develop-claude
tags: [api, reference, documentation]
created: 2026-01-26
---

## Context Links

- **SDK Source:** `E:\zuno-marketplace-sdk\src\`
- **Module Sources:**
  - `src/modules/ExchangeModule.ts`
  - `src/modules/AuctionModule.ts`
  - `src/modules/CollectionModule.ts`
- **React Hooks:** `src/react/hooks/`
- **Types:** `src/types/`

## Overview

Create complete API reference documentation covering all public SDK methods, hooks, and types with signatures, parameters, return values, and usage examples.

**Priority:** P2 - Important for developers
**Current Status:** Pending

## Key Insights

### API Structure to Document

**Exchange Module:**
- Query methods: `getListing()`, `getListingsBySeller()`, `getActiveListings()`
- Mutation methods: `listNFT()`, `buyNFT()`, `cancelListing()`, `updateListingPrice()`
- Batch methods: `batchListNFT()`
- ERC1155 support with `amount` parameter

**Auction Module:**
- Query methods: `getAuction()`, `getAuctionsBySeller()`, `getActiveAuctions()`
- Mutation methods: `createEnglishAuction()`, `createDutchAuction()`, `placeBid()`, `cancelAuction()`
- Batch methods: `batchCreateEnglishAuction()`, `batchCancelAuction()`

**Collection Module:**
- Query methods: `getCollection()`, `isInAllowlist()`
- Mutation methods: `createERC721Collection()`, `mintERC721()`, `setupAllowlist()`
- Allowlist methods: `addToAllowlist()`, `setAllowlistOnly()`

**React Hooks (10 total):**
- `useExchange()`, `useAuction()`, `useCollection()`
- `useWallet()`, `useZunoSDK()`, `useZunoLogger()`
- `useABIs()`, `useApprove()`, `useProviderSync()`, `useBalance()`

## Requirements

### Functional
1. Document every public method with signature
2. Include parameter types and descriptions
3. Document return types
4. Provide usage examples for each method
5. Note error conditions
6. Include type definitions where relevant

### Non-Functional
- Consistent formatting across all docs
- Clear hierarchy (modules → methods)
- Easy to scan for specific methods
- Links between related methods

## Architecture

### New Content Structure
```
content/sdk/5.api-reference/
├── index.md                    # API overview
├── exchange-api.md             # Exchange module reference
├── auction-api.md              # Auction module reference
├── collection-api.md           # Collection module reference
├── hooks-api.md                # React hooks reference
└── types.md                    # Important type definitions
```

## Related Code Files

### SDK Source Files
- `E:\zuno-marketplace-sdk\src\modules\ExchangeModule.ts`
- `E:\zuno-marketplace-sdk\src\modules\AuctionModule.ts`
- `E:\zuno-marketplace-sdk\src\modules\CollectionModule.ts`
- `E:\zuno-marketplace-sdk\src\react\hooks\*.ts`
- `E:\zuno-marketplace-sdk\src\types\*.ts`
- `E:\zuno-marketplace-sdk\src\utils\errors.ts`

### Files to Create
- `content/sdk/5.api-reference/index.md`
- `content/sdk/5.api-reference/exchange-api.md`
- `content/sdk/5.api-reference/auction-api.md`
- `content/sdk/5.api-reference/collection-api.md`
- `content/sdk/5.api-reference/hooks-api.md`
- `content/sdk/5.api-reference/types.md`

## Implementation Steps

### 1. Create API Reference Index
```markdown
# API Reference

Overview of SDK APIs:
- Exchange API - Listings, buying, canceling
- Auction API - English/Dutch auctions, bidding
- Collection API - Create collections, minting, allowlist
- React Hooks - All 10 hooks with signatures
- Types - Important TypeScript types

Quick navigation by module.
```

### 2. Create Exchange API Reference
```markdown
## Template for Each Method:

### methodName

Short description of what the method does.

**Signature:**
```typescript
function methodName(params: MethodParams): Promise<MethodResult>
```

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| ... | ... | ... | ... |

**Returns:**
Promise with `{ ... }`

**Example:**
```typescript
// Usage example
```

**Errors:**
- Error condition description

**See Also:** Related methods

## Methods to Document:
- getListing()
- getListingsBySeller()
- getActiveListings()
- listNFT() - Note ERC1155 amount parameter
- buyNFT()
- cancelListing()
- updateListingPrice()
- batchListNFT()
```

### 3. Create Auction API Reference
```markdown
## Methods to Document:
- getAuction()
- getAuctionsBySeller()
- getActiveAuctions()
- createEnglishAuction()
- createDutchAuction()
- placeBid()
- cancelAuction()
- batchCreateEnglishAuction()
- batchCancelAuction()

Follow same template as Exchange API.
```

### 4. Create Collection API Reference
```markdown
## Methods to Document:
- getCollection()
- createERC721Collection()
- mintERC721()
- setupAllowlist() - New in v2.0
- addToAllowlist()
- setAllowlistOnly()
- isInAllowlist()

Follow same template as Exchange API.
```

### 5. Create Hooks API Reference
```markdown
## Template for Each Hook:

### useHookName

Short description.

**Signature:**
```typescript
function useHookName(): HookReturnValue
```

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| ... | ... | ... |

**Example:**
```tsx
// Usage example
```

**Requirements:**
- Must be used within ZunoProvider
- Requires wallet connected for mutations

## Hooks to Document:
- useExchange()
- useAuction()
- useCollection()
- useWallet()
- useZunoSDK()
- useZunoLogger()
- useABIs()
- useApprove()
- useProviderSync()
- useBalance()
```

### 6. Create Types Reference
```markdown
## Important Types to Document:

### Configuration Types
- ZunoSDKConfig
- LoggerConfig
- NetworkConfig

### Entity Types
- Listing
- Auction
- Collection
- NFT

### Transaction Types
- TransactionResult
- BatchOperationResult

### Error Types
- ZunoSDKError
- ErrorCode enum
- ErrorContext

Include full type definitions.
```

## Success Criteria

- [ ] All Exchange methods documented (8 methods)
- [ ] All Auction methods documented (9 methods)
- [ ] All Collection methods documented (7 methods)
- [ ] All React hooks documented (10 hooks)
- [ ] Key types documented
- [ ] All signatures are accurate
- [ ] All examples compile
- [ ] Cross-references between related methods

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missing methods | Low | Check SDK index.ts exports |
| Incorrect types | Medium | Reference source .ts files |
| Outdated signatures | Low | Use v2.1.2 source |

## Security Considerations

- Document which methods require wallet connection
- Note which methods write to blockchain
- Warn about transaction costs

## Next Steps

- **Phase 5:** Document advanced topics (batch ops, ERC1155, DevTools, testing)
