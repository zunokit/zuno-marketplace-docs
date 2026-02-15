---
title: "Advanced Topics"
package: "sdk"
scope: "guide"
complexity: "advanced"
category: "advanced"
---

Advanced SDK features for power users: batch operations, ERC1155 support, DevTools, testing, and SSR.

## Topics

::card-grid
  ::card{icon="i-heroicons-queue-list" title="Batch Operations" to="/advanced/batch-operations"}
  Execute multiple operations efficiently with batch APIs
  ::
  ::card{icon="i-heroicons-layer-group" title="ERC1155 Support" to="/advanced/erc1155-support"}
  Multi-token listings with automatic detection
  ::
  ::card{icon="i-heroicons-wrench-screwdriver" title="DevTools" to="/advanced/devtools"}
  In-app debugging panel for development
  ::
  ::card{icon="i-heroicons-beaker" title="Testing" to="/advanced/testing"}
  Test your SDK integration with examples
  ::
  ::card{icon="i-heroicons-server" title="SSR Support" to="/advanced/ssr-support"}
  Use SDK with Next.js SSR and App Router
  ::
::

## When to Use Each Feature

| Feature | Use Case | Benefit |
|----------|----------|---------|
| **Batch Operations** | Listing multiple NFTs | ~20x gas savings |
| **ERC1155** | Multi-token NFTs | Sell quantities efficiently |
| **DevTools** | Development | Debug transactions & state |
| **Testing** | CI/CD | Ensure integration stability |
| **SSR** | Next.js App Router | SEO + initial page load |

## Quick Reference

### Batch Operations Limits

- **Max items per batch:** 20
- **Same collection only:** Yes (for efficiency)
- **Progress events:** Available during execution
- **Error handling:** Partial failure not supported

### ERC1155 Key Differences

- **Amount parameter:** Required for listings/purchases
- **Auto-detection:** SDK detects token standard
- **Batch-friendly:** Designed for batch operations
- **Amount validation:** Checks available balance

### DevTools Options

| Option | Type | Default |
|--------|------|---------|
| `showLogger` | boolean | true |
| `showTransactions` | boolean | true |
| `showCache` | boolean | true |
| `showNetwork` | boolean | true |
| `position` | string | "bottom-right" |

## See Also

- [API Reference](/api-reference/exchange-api) - Method signatures
- [Integration Tutorial](/integration-guides/zuno-mini-tutorial) - Complete integration walkthrough
- [Integration Reference](/integration-guides/zuno-mini-reference) - Real implementation examples
