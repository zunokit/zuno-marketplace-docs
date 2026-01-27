---
title: "Phase 5: Advanced Topics"
description: "Document advanced SDK features: batch operations, ERC1155 support, DevTools, and testing"
status: pending
priority: P2
effort: 1h
branch: develop-claude
tags: [advanced, batch, erc1155, devtools, testing]
created: 2026-01-26
---

## Context Links

- **SDK Source:** `E:\zuno-marketplace-sdk\src\`
- **SDK README:** `E:\zuno-marketplace-sdk\README.md` (v2.0+ features section)
- **DevTools Source:** `src/react/components/`
- **Testing Utils:** `src/testing/`
- **Batch Utils:** `src/utils/batch.ts`

## Overview

Document advanced SDK features introduced in v2.0+: batch operations, ERC1155 support, DevTools component, and testing utilities.

**Priority:** P2 - Important for power users
**Current Status:** Pending

## Key Insights

### Advanced Features to Cover

**Batch Operations (v2.0+):**
- `batchListNFT()` - List multiple NFTs in one transaction
- `batchCreateEnglishAuction()` - Create multiple auctions
- `batchCancelAuction()` - Cancel multiple auctions
- Progress events during execution
- Max 20 items per batch

**ERC1155 Support (v2.1+):**
- `amount` parameter in `listNFT()`
- Auto-detection of ERC721 vs ERC1155
- `buyNFT()` overloads for both types
- Query methods return both types

**DevTools (v2.0+):**
- `<ZunoDevTools />` component
- Logger panel with search/filter
- Transaction history with retry
- Cache inspection
- Network status display
- Position & visibility options

**Testing Utilities:**
- Mock providers
- Test helpers
- Jest/Vitest configuration
- Example test cases

**SSR Support (v2.1+):**
- `WagmiProviderSync` for SSR safety
- No-op fallbacks during SSR
- Proper hydration handling

## Requirements

### Functional
1. Document batch operation usage and limits
2. Explain ERC1155 support in detail
3. Document DevTools configuration options
4. Provide testing setup examples
5. Cover SSR considerations

### Non-Functional
- Clear explanation of when to use these features
- Performance considerations
- Common pitfalls

## Architecture

### New Content Structure
```
content/sdk/6.advanced/
├── index.md                    # Advanced topics overview
├── batch-operations.md         # Batch operations guide
├── erc1155-support.md          # ERC1155 detailed guide
├── devtools.md                 # DevTools documentation
├── testing.md                  # Testing with SDK
└── ssr-support.md              # SSR & Next.js considerations
```

## Related Code Files

### SDK Source Files
- `E:\zuno-marketplace-sdk\src\modules\ExchangeModule.ts` - batchListNFT
- `E:\zuno-marketplace-sdk\src\modules\AuctionModule.ts` - batch auction methods
- `E:\zuno-marketplace-sdk\src\react\components\ZunoDevTools.tsx`
- `E:\zuno-marketplace-sdk\src\testing\`
- `E:\zuno-marketplace-sdk\src\react\provider\WagmiProviderSync.tsx`

### Files to Create
- `content/sdk/6.advanced/index.md`
- `content/sdk/6.advanced/batch-operations.md`
- `content/sdk/6.advanced/erc1155-support.md`
- `content/sdk/6.advanced/devtools.md`
- `content/sdk/6.advanced/testing.md`
- `content/sdk/6.advanced/ssr-support.md`

## Implementation Steps

### 1. Create Advanced Topics Index
```markdown
# Advanced Topics

Overview of advanced SDK features:
- Batch Operations - Execute multiple operations efficiently
- ERC1155 Support - Work with ERC1155 tokens
- DevTools - Debug your integration
- Testing - Write tests for SDK usage
- SSR Support - Use with Next.js SSR

When to use each feature.
```

### 2. Create Batch Operations Guide
```markdown
## Content Outline:
1. What are batch operations?
2. Benefits (gas savings, atomicity)
3. Limitations (max 20 items, same collection)
4. Batch listing NFTs
5. Batch creating auctions
6. Batch canceling
7. Progress tracking events
8. Error handling
9. Best practices

## Code Examples:
```typescript
// Batch list NFTs
const { listingIds, tx } = await sdk.exchange.batchListNFT({
  collectionAddress: "0x...",
  tokenIds: ["1", "2", "3"],
  amounts: ["5", "10", "15"], // ERC1155
  prices: ["1.0", "2.0", "3.0"],
  duration: 86400,
});

// Batch create auctions
const { auctionIds, tx } = await sdk.auction.batchCreateEnglishAuction({
  collectionAddress: "0x...",
  tokenIds: ["1", "2", "3"],
  startingBid: "1.0",
  duration: 86400 * 7,
});

// Progress events
sdk.on('batchProgress', (progress) => {
  console.log(`${progress.completed}/${progress.total}`);
});
```
```

### 3. Create ERC1155 Support Guide
```markdown
## Content Outline:
1. ERC1155 vs ERC721 differences
2. Automatic token detection
3. Listing ERC1155 with amounts
4. Buying ERC1155 tokens
5. Querying ERC1155 listings
6. Batch operations with ERC1155
7. Amount validation

## Code Examples:
```typescript
// List ERC1155 with amount
const { listingId } = await sdk.exchange.listNFT({
  collectionAddress: "0x...",
  tokenId: "1",
  amount: "10",  // List 10 tokens
  price: "1.5",
  duration: 86400,
});

// Buy ERC1155
await sdk.exchange.buyNFT({
  listingId: "0x...",
  amount: "5",  // Buy 5 of 10 listed
});

// Get listing (works for both)
const listing = await sdk.exchange.getListing("0x...");
console.log(listing.amount); // "10" for ERC1155, undefined for ERC721
```
```

### 4. Create DevTools Documentation
```markdown
## Content Outline:
1. What is DevTools?
2. Installation
3. Configuration options
4. Logger panel
5. Transaction history
6. Cache inspector
7. Network status
8. Production considerations

## Code Examples:
```tsx
import { ZunoDevTools } from 'zuno-marketplace-sdk/react';

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === 'development' && (
        <ZunoDevTools
          config={{
            showLogger: true,
            showTransactions: true,
            showCache: true,
            showNetwork: true,
            position: 'bottom-right',
            defaultCollapsed: true,
          }}
        />
      )}
    </>
  );
}
```

## Features:
- Logger: Search, filter, export logs
- Transactions: View history, retry failed
- Cache: Inspect Query cache
- Network: Chain ID, API status
```

### 5. Create Testing Guide
```markdown
## Content Outline:
1. Testing setup (Jest/Vitest)
2. Mocking SDK
3. Mocking wallet
4. Testing mutations
5. Testing queries
6. Example test cases

## Code Examples:
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useExchange } from 'zuno-marketplace-sdk/react';

describe('useExchange', () => {
  it('should list NFT', async () => {
    const { result } = renderHook(() => useExchange(), {
      wrapper: ZunoTestWrapper,
    });

    await act(async () => {
      await result.current.listNFT.mutateAsync({
        collectionAddress: '0x...',
        tokenId: '1',
        price: '1.0',
        duration: 86400,
      });
    });

    expect(result.current.listNFT.isSuccess).toBe(true);
  });
});
```
```

### 6. Create SSR Support Guide
```markdown
## Content Outline:
1. SSR challenges with Web3
2. WagmiProviderSync for SSR safety
3. No-op fallbacks
4. Next.js App Router setup
5. Hydration considerations
6. Common issues

## Code Examples:
```tsx
// app/layout.tsx
import { ZunoProvider, WagmiProviderSync } from 'zuno-marketplace-sdk/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ZunoProvider config={config}>
          <WagmiProviderSync>
            {children}
          </WagmiProviderSync>
        </ZunoProvider>
      </body>
    </html>
  );
}

// Hooks are SSR-safe
'use client';
import { useExchange } from 'zuno-marketplace-sdk/react';

function MyComponent() {
  const { listNFT } = useExchange(); // No-op during SSR
  // ...
}
```
```

## Success Criteria

- [ ] All 6 advanced guides created
- [ ] Batch operations fully documented
- [ ] ERC1155 support explained
- [ ] DevTools configuration documented
- [ ] Testing setup examples provided
- [ ] SSR considerations covered
- [ ] Code examples compile
- [ ] Performance notes included

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Incorrect batch limits | Low | Verify with SDK source |
| Missing ERC1155 edge cases | Medium | Test with actual ERC1155 |
| Outdated Dev options | Low | Check component props |

## Security Considerations

- Note that DevTools should never be in production
- Warn about testing with real wallets
- Document safe test practices

## Next Steps

**Complete!** All documentation phases finished. Review and publish.

## Unresolved Questions

1. Should we include video tutorials for advanced topics?
2. Should we add performance benchmarking guide?
