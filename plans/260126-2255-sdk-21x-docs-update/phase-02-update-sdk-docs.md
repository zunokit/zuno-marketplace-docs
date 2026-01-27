---
title: "Phase 2: Update SDK Documentation to v2.1.2"
description: "Update all SDK documentation to reflect v2.1.2 features and changes"
status: pending
priority: P1
effort: 1.5h
branch: develop-claude
tags: [sdk, v2.1.2, documentation]
created: 2026-01-26
---

## Context Links

- **SDK Source:** `E:\zuno-marketplace-sdk\`
- **SDK Changelog:** `E:\zuno-marketplace-sdk\CHANGELOG.md`
- **Current SDK Docs:** `content/sdk/`
- **SDK README:** `E:\zuno-marketplace-sdk\README.md`

## Overview

Update all SDK documentation content from v1.1.4 to v2.1.2, including new features like ERC1155 support, batch operations, and WagmiProviderSync.

**Priority:** P1 - Core content update
**Current Status:** Pending

## Key Insights

### SDK 2.1.2 Features to Document
- **ERC1155 Listing Support** - `listNFT()` now supports `amount` parameter
- **Auto Token Detection** - Automatic ERC721 vs ERC1155 detection
- **Batch Operations** - `batchListNFT()`, `batchCreateEnglishAuction()`
- **Allowlist Management** - `addToAllowlist()`, `setAllowlistOnly()`, `isInAllowlist()`
- **WagmiProviderSync** - SSR-safe provider synchronization
- **Transaction Retry** - Enhanced `transactionStore` with retry logic
- **DevTools Component** - In-app debugging panel

### v2.1.1 Bug Fixes
- Allowlist cache invalidation
- ERC1155 listing with amounts
- Query invalidation corrections

## Requirements

### Functional
1. Update `content/sdk/index.md` version badge and features
2. Update all module docs with v2.1.2 examples
3. Add ERC1155 examples throughout
4. Document batch operations
5. Update code examples to match v2.1.2 API

### Non-Functional
- Maintain consistent formatting
- Preserve existing structure
- Ensure all code examples compile

## Architecture

### Content Structure
```
content/sdk/
├── index.md                    # Main SDK landing page
├── 1.getting-started/
│   ├── installation.md         # Update for v2.1.2
│   ├── quick-start.md          # Basic integration example
│   └── configuration.md        # New: detailed config options
├── 2.core-modules/
│   ├── exchange.md             # Add ERC1155 examples
│   ├── auction.md              # Add batch operations
│   ├── collection.md           # Add allowlist methods
│   └── offers-bundles.md       # Review for updates
└── 3.react-hooks/
    ├── overview.md             # Update for v2.1.2
    ├── use-exchange.md         # ERC1155 examples
    ├── use-auction.md          # Batch operations
    └── use-collection.md       # Allowlist hooks
```

## Related Code Files

### SDK Source References
- `E:\zuno-marketplace-sdk\src\modules\ExchangeModule.ts` - Exchange methods
- `E:\zuno-marketplace-sdk\src\modules\AuctionModule.ts` - Auction methods
- `E:\zuno-marketplace-sdk\src\modules\CollectionModule.ts` - Collection methods
- `E:\zuno-marketplace-sdk\src\react\hooks\` - React hooks
- `E:\zuno-marketplace-sdk\src\react\components\` - DevTools

### Docs to Update
- `content/sdk/index.md`
- `content/sdk/1.getting-started/*.md`
- `content/sdk/2.core-modules/*.md`
- `content/sdk/3.react-hooks/*.md`

## Implementation Steps

### 1. Update SDK Index Page
```markdown
- Change version badge from v1.1.4 to v2.1.2
- Update "What's New" section with v2.1.2 features
- Update quick start example with ZunoProvider + WagmiProviderSync
- Update feature list
- Remove references to indexer/abis/metadata in "See Also"
```

### 2. Update Installation Guide
```markdown
- Verify package installation command
- Add peer dependencies versions
- Add ZunoProvider setup with WagmiProviderSync
- Add DevTools setup snippet
```

### 3. Update Quick Start Guide
```markdown
- Use zuno-mini app-provider.tsx as reference
- Show ZunoProvider + WagmiProviderSync pattern
- Add basic wallet connection example
- Show first hook usage (useExchange or useCollection)
```

### 4. Update Exchange Module Docs
```markdown
- Add ERC1155 listing examples with amount parameter
- Document auto-detection behavior
- Add batchListNFT examples
- Update all code snippets to v2.1.2 API
```

### 5. Update Auction Module Docs
```markdown
- Add batchCreateEnglishAuction examples
- Document batch operations (max 20 per tx)
- Update code examples
```

### 6. Update Collection Module Docs
```markdown
- Add allowlist management methods
- Document setupAllowlist for owner mint
- Add allowlist query hooks
```

### 7. Update React Hooks Overview
```markdown
- Update hook list (10 hooks total)
- Add WagmiProviderSync documentation
- Add SSR-safe behavior notes
```

### 8. Update Individual Hook Docs
```markdown
use-exchange.md:
- Add listNFT with amount parameter
- Add batchListNFT mutation

use-auction.md:
- Add batchCreateEnglishAuction
- Add batchCancelAuction

use-collection.md:
- Add useSetupAllowlist
- Add allowlist query hooks
```

## Success Criteria

- [ ] All version badges show v2.1.2
- [ ] ERC1155 examples present in exchange docs
- [ ] Batch operations documented in auction docs
- [ ] Allowlist methods documented in collection docs
- [ ] WagmiProviderSync shown in setup guides
- [ ] All code examples use v2.1.2 API
- [ ] No v1.1.4 references remain
- [ ] DevTools setup documented

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missing v2.1.2 features | Medium | Cross-check with SDK README |
| Incorrect API usage | High | Reference SDK source files |
| Outdated examples | Medium | Test examples from SDK tests |

## Security Considerations

- No security changes in SDK v2.1.2
- Document proper error handling for transactions
- Note SSR-safe patterns for WagmiProviderSync

## Next Steps

- **Phase 3:** Create integration guides from zuno-mini examples
- **Phase 4:** Document full API reference

## Unresolved Questions

1. Should we include migration guide from v1.x to v2.1.2?
2. Should code snippets link to GitHub source?
