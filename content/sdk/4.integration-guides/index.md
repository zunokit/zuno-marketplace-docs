---
title: "Integration Guides"
package: "sdk"
scope: "guide"
complexity: "intermediate"
category: "integration"
---

Comprehensive integration documentation for building production-ready NFT marketplace applications with Zuno SDK v2.1.2.

## Overview

These guides provide real-world implementation patterns from [zuno-marketplace-mini](https://github.com/ZunoKit/zuno-marketplace-mini), a production NFT marketplace built with Next.js 15 and the Zuno SDK.

## Guides

::card-grid
  ::card{icon="i-heroicons-server" title="Next.js Setup" to="/sdk/integration-guides/nextjs-setup"}
  Complete Next.js 15 setup with App Router, SSR support, and environment configuration
  ::
  ::card{icon="i-heroicons-code-bracket" title="Zuno Mini Reference" to="/sdk/integration-guides/zuno-mini-reference"}
  Real implementation patterns from production marketplace application
  ::
  ::card{icon="i-heroicons-wallet" title="Wallet Integration" to="/sdk/integration-guides/wallet-integration"}
  Wallet connection patterns with MetaMask, WalletConnect, and auto-reconnect
  ::
  ::card{icon="i-heroicons-shield-check" title="Error Handling" to="/sdk/integration-guides/error-handling"}
  Transaction errors, network issues, and user-friendly error messages
  ::
::

## What You'll Learn

Each guide includes:

- **Step-by-step instructions** - From setup to deployment
- **Real code examples** - Copy-pasteable from zuno-mini
- **Common pitfalls** - Issues developers encounter
- **Best practices** - Production-ready patterns
- **Type safety** - Full TypeScript examples

## Prerequisites

Before following these guides, ensure you have:

- **Node.js** 18+ installed
- **pnpm** (recommended) or npm/yarn
- **MetaMask** or compatible Web3 wallet
- **Basic familiarity** with React and TypeScript

## Quick Reference

| Guide | Duration | Difficulty | Topics Covered |
|-------|----------|------------|-----------------|
| Next.js Setup | 15 min | Beginner | Project init, providers, config |
| Zuno Mini Reference | 20 min | Intermediate | Architecture, patterns, state |
| Wallet Integration | 10 min | Beginner | Connection, events, validation |
| Error Handling | 10 min | Intermediate | Types, messages, retry logic |

## See Also

- [Quick Start](/sdk/getting-started/quick-start) - 5-minute introduction
- [Installation](/sdk/getting-started/installation) - SDK installation guide
- [React Hooks](/sdk/react-hooks/overview) - Complete hooks reference
