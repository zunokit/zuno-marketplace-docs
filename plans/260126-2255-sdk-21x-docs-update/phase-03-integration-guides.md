---
title: "Phase 3: Integration Guides"
description: "Create detailed integration documentation with real examples from zuno-marketplace-mini"
status: pending
priority: P1
effort: 1.5h
branch: develop-claude
tags: [integration, nextjs, examples, zuno-mini]
created: 2026-01-26
---

## Context Links

- **zuno-mini Source:** `E:\zuno-marketplace-mini\`
- **zuno-mini App Provider:** `src/app/app-provider.tsx`
- **zuno-mini Wallet Provider:** `src/providers/WalletProvider.tsx`
- **SDK README:** `E:\zuno-marketplace-sdk\README.md`

## Overview

Create comprehensive integration guides based on real implementation patterns from zuno-marketplace-mini, covering Next.js setup, wallet integration, and error handling.

**Priority:** P1 - Critical for user onboarding
**Current Status:** Pending

## Key Insights

### Integration Patterns from zuno-mini

**Provider Setup:**
- `ZunoProvider` wraps entire app
- `WagmiProviderSync` handles wallet signer sync
- Validation before initialization
- DevTools in development only

**Wallet Integration:**
- Custom `WalletProvider` with ethers.js
- Auto-reconnect on mount
- Network validation
- Balance refresh every 30s
- Event listeners for account/chain changes

**Configuration:**
- Environment-based config
- Validation function for required env vars
- Logger integration
- Error handling utilities

## Requirements

### Functional
1. Create Next.js setup guide with full wagmi/query config
2. Document zuno-mini integration patterns
3. Create wallet integration guide
4. Add error handling best practices
5. Include real code examples from zuno-mini

### Non-Functional
- Clear, step-by-step instructions
- Copy-pasteable code examples
- Explanation of why, not just what
- Common pitfalls section

## Architecture

### New Content Structure
```
content/sdk/4.integration-guides/
├── index.md                    # Overview of integration docs
├── nextjs-setup.md             # Full Next.js + Wagmi setup
├── zuno-mini-reference.md      # Real implementation patterns
├── wallet-integration.md       # Wallet connection guide
└── error-handling.md           # Error handling & retry logic
```

## Related Code Files

### zuno-mini Reference Files
- `E:\zuno-marketplace-mini\src\app\app-provider.tsx` - Provider setup
- `E:\zuno-marketplace-mini\src\app\layout.tsx` - Root layout
- `E:\zuno-marketplace-mini\src\providers\WalletProvider.tsx` - Wallet implementation
- `E:\zuno-marketplace-mini\src\lib\config\zuno-sdk.ts` - Config validation
- `E:\zuno-marketplace-mini\src\lib\utils\sdk-logger.ts` - Logger setup
- `E:\zuno-marketplace-mini\src\lib\utils\error-handler.ts` - Error utilities

### Files to Create
- `content/sdk/4.integration-guides/index.md`
- `content/sdk/4.integration-guides/nextjs-setup.md`
- `content/sdk/4.integration-guides/zuno-mini-reference.md`
- `content/sdk/4.integration-guides/wallet-integration.md`
- `content/sdk/4.integration-guides/error-handling.md`

## Implementation Steps

### 1. Create Integration Guides Index
```markdown
# Integration Guides

Overview of available integration resources:
- Next.js Setup - Full project setup guide
- Zuno Mini Reference - Real implementation examples
- Wallet Integration - Wallet connection patterns
- Error Handling - Best practices for errors

Quick links to each guide with descriptions.
```

### 2. Create Next.js Setup Guide
```markdown
## Content Outline:
1. Prerequisites (Node.js, pnpm, wallet)
2. Project initialization (npx create-next-app)
3. Install dependencies (SDK, wagmi, viem, tanstack-query)
4. Environment configuration (.env setup)
5. Provider setup (ZunoProvider + WagmiProviderSync)
6. Configuration validation
7. DevTools setup
8. First component example

## Code Examples:
- package.json dependencies
- .env.example
- lib/config/zuno-sdk.ts (from zuno-mini)
- app/layout.tsx (from zuno-mini)
- app/app-provider.tsx (from zuno-mini)
- Basic page component with useExchange
```

### 3. Create Zuno Mini Reference
```markdown
## Content Outline:
1. Overview of zuno-mini architecture
2. Provider layer breakdown
3. State management patterns
4. Component patterns (from app/auctions, app/marketplace)
5. Hook patterns (hooks/useAuctionQueries.ts)
6. Error handling examples
7. Configuration patterns

## Code Examples:
- App provider structure
- Wallet provider key methods
- Custom hook patterns
- Page component patterns
- API route patterns
```

### 4. Create Wallet Integration Guide
```markdown
## Content Outline:
1. Wallet options (MetaMask, WalletConnect, Coinbase)
2. Zuno's useWallet hook
3. Custom wallet provider pattern (from zuno-mini)
4. Auto-reconnect implementation
5. Network switching
6. Account change handling
7. Balance tracking
8. Common issues & solutions

## Code Examples:
- Basic useWallet usage
- Custom WalletProvider (from zuno-mini)
- Reconnect logic
- Network validation
- Event listener setup
```

### 5. Create Error Handling Guide
```markdown
## Content Outline:
1. Error types (transaction, network, validation)
2. SDK error codes (ErrorCodes enum)
3. try-catch patterns
4. User-friendly error messages
5. Retry logic with transactionStore
6. Logging best practices
7. Common errors & solutions

## Code Examples:
- Error handling wrapper function
- Transaction error handling
- Network error handling
- Validation error handling
- Logger usage (from zuno-mini)
```

## Success Criteria

- [ ] 4 integration guides created
- [ ] All examples from zuno-mini source
- [ ] Next.js setup produces working app
- [ ] Wallet guide covers common scenarios
- [ ] Error guide covers all error types
- [ ] Code examples are copy-pasteable
- [ ] Each guide has "Common Pitfalls" section

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Outdated examples | Medium | Cross-check with latest zuno-mini |
| Missing edge cases | Low | Add "Common Issues" sections |
| Over-complexity | Medium | Keep examples minimal but complete |

## Security Considerations

- Document secure API key handling
- Warn against hardcoding private keys
- Show proper env var usage
- Note wallet signature security

## Next Steps

- **Phase 4:** Create comprehensive API reference
- **Phase 5:** Document advanced topics (batch ops, ERC1155, DevTools)
