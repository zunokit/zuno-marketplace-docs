# Implementation Plan Created: SDK 2.1.2 Documentation Update

**Date:** 2026-01-26
**Session:** Documentation update planning for zuno-marketplace-sdk v2.1.2
**Plan Location:** `plans/260126-2255-sdk-21x-docs-update/`

---

## Summary

Created comprehensive implementation plan for updating zuno-marketplace-docs from SDK v1.1.4 to v2.1.2. Plan includes cleanup, content updates, integration guides, API reference, and advanced topics documentation.

---

## Problem Statement

Current documentation site has:
- Outdated SDK version (v1.1.4 vs actual v2.1.2)
- Multi-section complexity (sdk/indexer/abis/metadata)
- Missing integration guides
- Content bloat from unused sections

---

## Solution Structure

### 5-Phase Implementation

| Phase | Focus | Effort | Status |
|-------|-------|--------|--------|
| 1. Cleanup | Remove unused sections & UI selector | 0.5h | Pending |
| 2. Update SDK Docs | Update all content to v2.1.2 | 1.5h | Pending |
| 3. Integration Guides | Create integration docs | 1.5h | Pending |
| 4. API Reference | Document all methods | 1.5h | Pending |
| 5. Advanced Topics | Document v2.x features | 1h | Pending |

**Total Effort:** 6 hours

---

## Content Architecture

```
content/
└── sdk/
    ├── index.md                      # SDK overview (v2.1.2)
    ├── 1.getting-started/
    │   ├── installation.md
    │   ├── quick-start.md            # Basic zuno-mini integration
    │   └── configuration.md
    ├── 2.core-modules/
    │   ├── exchange.md               # ERC1155 + batch operations
    │   ├── auction.md                # Batch operations
    │   ├── collection.md             # Allowlist management
    │   └── offers-bundles.md
    ├── 3.react-hooks/
    │   ├── overview.md               # 10 hooks total
    │   ├── use-exchange.md
    │   ├── use-auction.md
    │   └── use-collection.md
    ├── 4.integration-guides/         # NEW
    │   ├── nextjs-setup.md           # Full Next.js setup
    │   ├── zuno-mini-reference.md    # Real examples
    │   ├── wallet-integration.md     # Wallet patterns
    │   └── error-handling.md         # Best practices
    ├── 5.api-reference/              # NEW
    │   ├── exchange-api.md           # 8 methods
    │   ├── auction-api.md            # 9 methods
    │   ├── collection-api.md         # 7 methods
    │   └── hooks-api.md              # 10 hooks
    └── 6.advanced/                   # NEW
        ├── batch-operations.md       # v2.0+ batch ops
        ├── erc1155-support.md        # v2.1+ ERC1155
        ├── devtools.md               # DevTools component
        ├── testing.md                # Testing utilities
        └── ssr-support.md            # SSR considerations
```

---

## Key SDK 2.1.2 Features to Document

### v2.1.2 / v2.1.1
- ERC1155 listing support with `amount` parameter
- Auto token detection (ERC721 vs ERC1155)
- Allowlist cache invalidation fixes

### v2.1.0
- WagmiProviderSync for SSR support
- Transaction retry logic
- Batch progress events
- ListingId validation
- Dutch auction warnings

### v2.0.0
- Batch operations (English auctions, listings)
- Allowlist management
- DevTools component
- Testing utilities
- Standalone logger module

---

## Integration Content Sources

### zuno-marketplace-mini Reference Files

**Provider Setup:**
- `src/app/app-provider.tsx` - ZunoProvider + WagmiProviderSync pattern
- `src/app/layout.tsx` - Root layout structure

**Wallet Integration:**
- `src/providers/WalletProvider.tsx` - Custom wallet provider (610 lines)
- Auto-reconnect logic
- Network validation
- Event handling

**Configuration:**
- `src/lib/config/zuno-sdk.ts` - Config validation
- `src/lib/utils/sdk-logger.ts` - Logger setup
- `src/lib/utils/error-handler.ts` - Error utilities

**Hooks:**
- `src/hooks/useAuctionQueries.ts` - Custom hook patterns
- `src/hooks/useMarketplaceListings.ts` - Query patterns

---

## UI Changes

### File: `app/layouts/docs.vue`

**To Remove:**
```diff
- const sections = [
-   { label: 'zuno-marketplace-sdk', value: 'sdk' },
-   { label: 'zuno-marketplace-indexer', value: 'indexer' },
-   { label: 'zuno-marketplace-abis', value: 'abis' },
-   { label: 'zuno-marketplace-metadata', value: 'metadata' }
- ]
- // Section detection logic (lines 16-22)
- // Section filtering (lines 32-42)
- // USelectMenu dropdown (line 56)
```

**Result:** Single-section docs, clean navigation

---

## Success Criteria

- [ ] Only SDK section visible on site
- [ ] No section selector dropdown
- [ ] All docs reference SDK 2.1.2
- [ ] Integration guides cover zuno-mini setup
- [ ] API reference covers all public methods (24+ methods, 10 hooks)
- [ ] All links work (no 404s)
- [ ] Site builds without errors
- [ ] Examples match SDK 2.1.2 actual behavior

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Broken navigation links | Medium | Test all links after deletion |
| Missing API coverage | Low | Use SDK source as reference |
| Outdated examples | Medium | Cross-check with zuno-mini |
| Build failures | Low | Run build after each phase |

---

## Files Created

### Plan Root
- `plans/260126-2255-sdk-21x-docs-update/plan.md` - Overview with status tracking

### Phase Files
- `phase-01-cleanup.md` - Remove unused sections & UI selector
- `phase-02-update-sdk-docs.md` - Update content to v2.1.2
- `phase-03-integration-guides.md` - Create integration documentation
- `phase-04-api-reference.md` - Document all SDK methods
- `phase-05-advanced-topics.md` - Document v2.x features

---

## Next Steps

1. **Start Implementation:** Begin with Phase 1 (cleanup)
2. **Follow Sequence:** Complete phases in order (1 → 2 → 3 → 4 → 5)
3. **Test After Each Phase:** Run `pnpm build` and verify navigation
4. **Reference Sources:** Use SDK source and zuno-mini for accurate examples

---

## Unresolved Questions

1. **Changelog location:** External changelog URL still linked. Keep or remove?
2. **Migration guide:** Should we add v1.x → v2.1.2 migration guide?
3. **GitHub integration:** Should examples link to GitHub source?

---

## Source References

- **SDK v2.1.2:** `E:\zuno-marketplace-sdk\`
- **Integration Examples:** `E:\zuno-marketplace-mini\`
- **Current Docs:** `E:\zuno-marketplace-docs\content\`
- **Brainstorm Report:** `plans/reports/brainstormer-260126-2246-sdk-21x-docs-cleanup.md`
