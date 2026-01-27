---
title: "Installation"
package: "sdk"
lastUpdated: "2026-01-27"
scope: "guide"
complexity: "beginner"
category: "installation"
relatedTopics:
  - "quick-start"
  - "configuration"
---

Get started with the Zuno SDK v2.1.2 for building NFT marketplace applications with type-safe, React-first integration.

## Prerequisites

Before installing the SDK, ensure you have:

- **Node.js** 18+
- **npm**, **pnpm**, or **yarn**
- **React** 19+ (for React hooks)
- **TypeScript** 5.6+ (recommended)

## Install Package

Install the SDK along with required peer dependencies:

::code-group

```bash [npm]
npm install zuno-marketplace-sdk ethers@6 @tanstack/react-query wagmi viem
```

```bash [pnpm]
pnpm add zuno-marketplace-sdk ethers@6 @tanstack/react-query wagmi viem
```

```bash [yarn]
yarn add zuno-marketplace-sdk ethers@6 @tanstack/react-query wagmi viem
```

::

### Dependencies Explained

| Package | Purpose | Version |
|---------|---------|---------|
| `zuno-marketplace-sdk` | Core SDK with TypeScript APIs | v2.1.2+ |
| `ethers` | Ethereum library for contract interactions | v6.x |
| `@tanstack/react-query` | Data fetching & caching for React | v5.x |
| `wagmi` | React hooks for Ethereum | v2.x |
| `viem` | TypeScript Ethereum library | v2.x |

## Verify Installation

Check that the SDK is installed correctly:

```bash
npm list zuno-marketplace-sdk
```

You should see output similar to:

```
zuno-marketplace-sdk@2.1.2
```

## What's Included

The SDK v2.1.2 provides:

- 🎨 **Complete NFT Marketplace** - Exchange, Auctions, Offers, Bundles
- ⚛️ **React Integration** - 21+ hooks with Wagmi & React Query
- 🔐 **Type-Safe** - Full TypeScript support with strict typing
- 📦 **Smart Caching** - Built-in ABI caching with TanStack Query
- 🎯 **Modular Design** - Use only what you need
- 🔥 **ERC1155 Support** - Multi-token listings with amount handling
- ⚡ **Batch Operations** - Create up to 20 auctions per transaction
- 🛠️ **DevTools** - In-app debugging panel
- 🌐 **SSR Support** - WagmiProviderSync for Next.js App Router

## Provider Setup (v2.1.2)

### Basic Setup

```tsx
// app/layout.tsx (Next.js App Router)
import { ZunoProvider } from 'zuno-marketplace-sdk/react';

export default function RootLayout({ children }) {
  return (
    <ZunoProvider
      config={{
        apiKey: process.env.NEXT_PUBLIC_ZUNO_API_KEY!,
        network: 'sepolia',
      }}
    >
      {children}
    </ZunoProvider>
  );
}
```

### With Custom Wagmi Config

For advanced use cases, you can provide your own Wagmi configuration:

```tsx
import { ZunoProvider } from 'zuno-marketplace-sdk/react';
import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';

const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

export default function App({ children }) {
  return (
    <ZunoProvider
      config={{
        apiKey: process.env.NEXT_PUBLIC_ZUNO_API_KEY!,
        network: 'sepolia',
        wagmiConfig,  // Custom Wagmi config
      }}
    >
      {children}
    </ZunoProvider>
  );
}
```

::alert{type="info"}
**WagmiProviderSync:** v2.1.2 includes automatic WagmiProviderSync for SSR-safe provider state synchronization. No additional setup required for Next.js App Router.
::

## DevTools Setup (v2.1.2)

Enable the in-app debugging panel for development:

```tsx
import { ZunoDevTools } from 'zuno-marketplace-sdk/react';

function App({ children }) {
  return (
    <ZunoProvider config={{ apiKey: process.env.NEXT_PUBLIC_ZUNO_API_KEY!, network: 'sepolia' }}>
      {children}

      {process.env.NODE_ENV === 'development' && (
        <ZunoDevTools
          config={{
            showLogger: true,
            showTransactions: true,
            showCache: true,
            showNetwork: true,
            position: 'bottom-right',
          }}
        />
      )}
    </ZunoProvider>
  );
}
```

**DevTools Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showLogger` | `boolean` | `true` | Show logger output |
| `showTransactions` | `boolean` | `true` | Show transaction history |
| `showCache` | `boolean` | `true` | Show query cache status |
| `showNetwork` | `boolean` | `true` | Show network info |
| `position` | `string` | `'bottom-right'` | Panel position |

## Next Steps

After installation, proceed with:

- [Quick Start Guide](/sdk/getting-started/quick-start) - Set up your first marketplace integration
- [Core Modules](/sdk/core-modules/exchange) - Learn about Exchange, Collection, Auction modules
- [React Hooks](/sdk/react-hooks/overview) - Explore React hooks for wallet and contract interactions

## Troubleshooting

::collapse{title="Peer dependency warnings"}
If you see peer dependency warnings, ensure you're using compatible versions:

- React 19+
- Ethers 6.x (not v5)
- Wagmi 2.x
- TanStack Query v5.x
- Node.js 18+

Install missing peer dependencies as indicated in the warning messages.
::

::collapse{title="TypeScript errors"}
Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```
::

::collapse{title="SSR hydration errors"}
If you see hydration mismatches in Next.js, ensure you're using the `ZunoProvider` with SSR-safe configuration. The SDK v2.1.2 includes WagmiProviderSync for automatic SSR compatibility.

```tsx
// Correct - SDK handles SSR automatically
<ZunoProvider config={{ apiKey, network }}>
  {children}
</ZunoProvider>
```
::
