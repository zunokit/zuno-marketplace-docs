# Brainstorm Report: SDK 2.1.2 Documentation Update

**Date:** 2026-01-26
**Session:** Documentation strategy for zuno-marketplace-sdk v2.1.2

---

## Problem Statement

Current documentation site (`zuno-marketplace-docs`) has:
- **Outdated SDK version**: Docs show v1.1.4, actual SDK is v2.1.2
- **Multi-section complexity**: Sections for sdk/indexer/abis/metadata with dropdown selector
- **No integration guides**: Missing zuno-mini integration examples
- **Content bloat**: Indexer, ABIs, Metadata sections no longer needed

User wants:
- Update to SDK 2.1.2
- Remove indexer/abis/metadata sections completely
- Remove section selector logic (single SDK docs)
- Add detailed integration docs (zuno-sdk + zuno-mini)

---

## Requirements

### Functional
1. Delete all content for indexer, abis, metadata
2. Update SDK docs from v1.1.4 to v2.1.2
3. Remove section selector dropdown from UI
4. Create comprehensive SDK 2.1.2 docs
5. Add integration guides (quick start + separate detailed guides)

### Non-Functional
- Maintain clean, simple navigation
- Preserve existing UI design patterns
- Keep build/deployment working

---

## Evaluated Approaches

### Option A: Complete Redesign (Rejected)
**Description:** Tear down entire docs structure, rebuild from scratch

**Pros:**
- Clean slate, no legacy baggage
- Can reorganize everything optimally

**Cons:**
- **Over-engineering** (violates YAGNI)
- High risk of breaking existing site
- Much longer development time
- Unnecessary for this scope

### Option B: Incremental Migration (Selected)
**Description:** Delete unused sections, update SDK content, simplify navigation

**Pros:**
- Minimal risk, focused changes
- Faster implementation
- Preserves working UI patterns
- Easy to verify each step

**Cons:**
- Must work within existing structure
- Some residual code may remain

---

## Final Solution: Hybrid Documentation Structure

### Content Architecture

```
content/
└── sdk/                          # Only SDK section
    ├── index.md                  # SDK overview (v2.1.2)
    ├── 1.getting-started/        # Quick start + basic integration
    │   ├── installation.md
    │   ├── quick-start.md        # NEW: Basic zuno-mini integration
    │   └── configuration.md
    ├── 2.core-modules/           # Core SDK modules
    │   ├── exchange.md           # Updated for v2.1.2
    │   ├── auction.md            # Updated for v2.1.2
    │   ├── collection.md         # Updated for v2.1.2
    │   └── offers-bundles.md
    ├── 3.react-hooks/            # React hooks reference
    │   ├── overview.md
    │   ├── use-exchange.md
    │   ├── use-auction.md
    │   └── use-collection.md
    ├── 4.integration-guides/     # NEW: Detailed integration
    │   ├── nextjs-setup.md       # Full Next.js setup guide
    │   ├── zuno-mini-reference.md # Real examples from zuno-mini
    │   ├── wallet-integration.md
    │   └── error-handling.md
    ├── 5.api-reference/          # NEW: Full API reference
    │   ├── exchange-api.md
    │   ├── auction-api.md
    │   ├── collection-api.md
    │   └── logger-api.md
    └── 6.advanced/               # NEW: Advanced topics
        ├── batch-operations.md   # v2.0+ batch ops
        ├── erc1155-support.md    # v2.1+ ERC1155
        ├── devtools.md
        └── testing.md
```

### UI Changes

**File:** `app/layouts/docs.vue`

```diff
- const sections = [
-   { label: 'zuno-marketplace-sdk', value: 'sdk' },
-   { label: 'zuno-marketplace-indexer', value: 'indexer' },
-   { label: 'zuno-marketplace-abis', value: 'abis' },
-   { label: 'zuno-marketplace-metadata', value: 'metadata' }
- ]
-
- // Section detection logic (lines 16-22)
- // Section filtering (lines 32-42)
- // USelectMenu dropdown (line 56)
```

**Result:** Single-section docs, no dropdown, clean navigation

### Documentation Content Strategy

#### 1. Getting Started (Hybrid: Quick Start + Integration Teaser)
- Installation for SDK 2.1.2
- Basic Next.js setup
- Quick 5-minute integration
- Link to detailed integration guides

#### 2. Core Modules (Updated for 2.1.2)
- Exchange module (ERC721 + ERC1155 listing)
- Auction module (English/Dutch, batch operations)
- Collection module (create/mint, allowlist)
- All code examples updated

#### 3. React Hooks (Existing, Updated)
- All 21+ hooks documented
- Usage examples
- Type signatures

#### 4. Integration Guides (NEW - Detailed)
- **Next.js Setup**: Full wagmi/query configuration
- **Zuno Mini Reference**: Real code from `zuno-marketplace-mini` explained
  - Provider setup
  - Feature implementation examples
  - Error handling patterns
- **Wallet Integration**: MetaMask, WalletConnect
- **Error Handling**: Common errors, retry logic

#### 5. API Reference (NEW - Full Reference)
- Every method with parameters
- Return types
- Usage examples
- Error conditions

#### 6. Advanced Topics (NEW)
- Batch operations (v2.0+)
- ERC1155 support (v2.1+)
- DevTools configuration
- Testing utilities

---

## Implementation Plan

### Phase 1: Cleanup
1. Delete `content/indexer/`, `content/abis/`, `content/metadata/`
2. Remove section selector logic from `app/layouts/docs.vue`
3. Update navigation config

### Phase 2: Update SDK Docs
1. Update version to 2.1.2 in `content/sdk/index.md`
2. Update all module docs with v2.1.2 features
3. Add ERC1155 examples
4. Add batch operation examples

### Phase 3: Create Integration Guides
1. Create `4.integration-guides/` section
2. Document Next.js setup
3. Extract examples from `zuno-marketplace-mini`
4. Create wallet integration guide
5. Add error handling guide

### Phase 4: API Reference
1. Create `5.api-reference/` section
2. Document all SDK methods
3. Add type signatures
4. Include usage examples

### Phase 5: Advanced Topics
1. Create `6.advanced/` section
2. Document batch operations
3. Document ERC1155 support
4. Document DevTools
5. Document testing utilities

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Broken navigation links | Medium | Test all internal links after deletion |
| Missing API coverage | Low | Use SDK source as reference |
| Outdated examples | Medium | Cross-check with zuno-mini source |
| Build failures | Low | Run build after each phase |

---

## Success Criteria

- [ ] Only SDK section visible on site
- [ ] No section selector dropdown
- [ ] All docs reference SDK 2.1.2
- [ ] Integration guides cover zuno-mini setup
- [ ] API reference covers all public methods
- [ ] All links work (no 404s)
- [ ] Site builds without errors
- [ ] Examples match SDK 2.1.2 actual behavior

---

## Unresolved Questions

1. **Changelog location**: External changelog URL is still linked. Keep or remove?
2. **Migration guide**: Should we add v1.x → v2.1.2 migration guide?
3. **GitHub integration**: Should examples link to GitHub source?

---

## Next Steps

User confirmed:
- Delete indexer/abis/metadata completely
- Hybrid integration docs (quick start + separate guides)
- Full documentation depth (API + guides + examples + workflows)

**Ready for implementation planning.**
