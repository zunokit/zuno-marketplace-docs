---
title: "Phase 1: Cleanup - Remove Unused Sections"
description: "Delete indexer/abis/metadata sections and remove UI selector logic"
status: pending
priority: P1
effort: 0.5h
branch: develop-claude
tags: [cleanup, ui, navigation]
created: 2026-01-26
---

## Context Links

- **Brainstorm Report:** `plans/reports/brainstormer-260126-2246-sdk-21x-docs-cleanup.md`
- **Current Layout:** `app/layouts/docs.vue`
- **Content Root:** `content/`

## Overview

Remove unused documentation sections (indexer, abis, metadata) and simplify the UI by removing the section selector dropdown.

**Priority:** P1 - Must be done first to avoid broken references
**Current Status:** Pending

## Key Insights

- Current docs has 4 sections: sdk, indexer, abis, metadata
- Only SDK section is needed (zuno-marketplace-sdk is the product)
- Section selector adds unnecessary complexity
- Deleting sections is safe - no internal links to preserve

## Requirements

### Functional
1. Delete `content/indexer/`, `content/abis/`, `content/metadata/` directories
2. Remove section selector logic from `app/layouts/docs.vue`
3. Update navigation to show only SDK content
4. Ensure site builds without errors

### Non-Functional
- Maintain clean, working navigation
- No broken links
- Preserved UI design patterns

## Architecture

### Files to Delete
```
content/indexer/
content/abis/
content/metadata/
```

### Files to Modify
```
app/layouts/docs.vue  - Remove sections array & selector logic
content/index.md       - Update to reference only SDK
```

## Related Code Files

### To Delete
- `E:\zuno-marketplace-docs\content\indexer\`
- `E:\zuno-marketplace-docs\content\abis\`
- `E:\zuno-marketplace-docs\content\metadata\`

### To Modify
- `E:\zuno-marketplace-docs\app\layouts\docs.vue`
- `E:\zuno-marketplace-docs\content\index.md`

## Implementation Steps

1. **Delete unused content directories**
   ```bash
   rm -rf content/indexer content/abis content/metadata
   ```

2. **Simplify docs.vue layout**
   - Remove `sections` array (lines 8-13)
   - Remove `getCurrentSection()` function (lines 16-22)
   - Remove `selectedSection` state (line 24)
   - Remove route watcher (lines 27-29)
   - Replace `filteredNavigation` with direct `navigation` usage
   - Remove `USelectMenu` component (lines 56-62)

3. **Update content/index.md**
   - Remove references to indexer/abis/metadata
   - Update card grid to show only SDK docs

4. **Verify build**
   ```bash
   pnpm build
   ```

5. **Test navigation**
   - Start dev server
   - Verify all links work
   - Check for 404 errors

## Success Criteria

- [ ] `content/indexer/`, `content/abis/`, `content/metadata/` deleted
- [ ] No section selector dropdown visible
- [ ] Navigation shows only SDK section
- [ ] Site builds without errors
- [ ] No 404 errors on navigation
- [ ] All internal links resolve correctly

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Broken internal links | Low | No internal links to deleted sections |
| Build failure | Low | Simple changes, easy to verify |
| Missing context | Medium | Keep SDK docs intact |

## Security Considerations

- No auth/authorization changes
- No data exposure risks

## Next Steps

- **Phase 2:** Update SDK docs to v2.1.2
- **Phase 3:** Create integration guides
