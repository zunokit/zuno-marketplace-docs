---
title: "SDK 2.1.2 Documentation Update"
description: "Update zuno-marketplace-docs from SDK v1.1.4 to v2.1.2 with simplified single-section structure"
status: pending
priority: P1
effort: 6h
branch: develop-claude
tags: [sdk, documentation, cleanup, v2.1.2]
created: 2026-01-26
---

## Overview

Update zuno-marketplace-docs to reflect SDK v2.1.2, removing unused sections (indexer/abis/metadata) and creating comprehensive SDK documentation with integration guides.

**Current State:**
- Docs show SDK v1.1.4 (actual: v2.1.2)
- Multi-section structure with dropdown selector
- Missing integration guides
- Content bloat from unused services

**Target State:**
- Single-section SDK documentation
- SDK v2.1.2 features fully documented
- Comprehensive integration guides
- Clean navigation without selector

## Phases

| Phase | Status | Description |
|-------|--------|-------------|
| [Phase 1: Cleanup](./phase-01-cleanup.md) | pending | Remove unused sections & UI selector |
| [Phase 2: Update SDK Docs](./phase-02-update-sdk-docs.md) | pending | Update content to SDK v2.1.2 |
| [Phase 3: Integration Guides](./phase-03-integration-guides.md) | pending | Create integration documentation |
| [Phase 4: API Reference](./phase-04-api-reference.md) | pending | Document all SDK methods |
| [Phase 5: Advanced Topics](./phase-05-advanced-topics.md) | pending | Document v2.x features |

## Key Dependencies

- **SDK Source:** `E:\zuno-marketplace-sdk\` (v2.1.2)
- **Integration Examples:** `E:\zuno-marketplace-mini\`
- **Current Docs:** `E:\zuno-marketplace-docs\content\`

## Success Criteria

- [ ] Only SDK section visible on site
- [ ] No section selector dropdown
- [ ] All docs reference SDK 2.1.2
- [ ] Integration guides cover zuno-mini setup
- [ ] API reference covers all public methods
- [ ] All links work (no 404s)
- [ ] Site builds without errors
- [ ] Examples match SDK 2.1.2 behavior

## File Structure

```
content/
└── sdk/
    ├── index.md                  # SDK overview (v2.1.2)
    ├── 1.getting-started/
    │   ├── installation.md
    │   ├── quick-start.md        # Basic integration
    │   └── configuration.md
    ├── 2.core-modules/
    │   ├── exchange.md           # Updated for v2.1.2
    │   ├── auction.md
    │   ├── collection.md
    │   └── offers-bundles.md
    ├── 3.react-hooks/
    │   ├── overview.md
    │   ├── use-exchange.md
    │   ├── use-auction.md
    │   └── use-collection.md
    ├── 4.integration-guides/     # NEW
    │   ├── nextjs-setup.md
    │   ├── zuno-mini-reference.md
    │   ├── wallet-integration.md
    │   └── error-handling.md
    ├── 5.api-reference/          # NEW
    │   ├── exchange-api.md
    │   ├── auction-api.md
    │   ├── collection-api.md
    │   └── logger-api.md
    └── 6.advanced/               # NEW
        ├── batch-operations.md
        ├── erc1155-support.md
        ├── devtools.md
        └── testing.md
```

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Broken navigation links | Medium | Test all internal links after deletion |
| Missing API coverage | Low | Use SDK source as reference |
| Outdated examples | Medium | Cross-check with zuno-mini source |
| Build failures | Low | Run build after each phase |

## Unresolved Questions

1. **Changelog location**: External changelog URL still linked. Keep or remove?
2. **Migration guide**: Should we add v1.x → v2.1.2 migration guide?
3. **GitHub integration**: Should examples link to GitHub source?
