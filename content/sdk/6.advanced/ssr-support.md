---
title: "SSR Support"
package: "sdk"
scope: "guide"
complexity: "advanced"
category: "advanced"
---

Server-Side Rendering support for Next.js App Router with WagmiProviderSync (v2.1.2).

## SSR Challenges

Web3 libraries typically assume browser environment:
- `window.ethereum` doesn't exist on server
- Wallet connection requires browser
- State hydration mismatches

## WagmiProviderSync (v2.1.2)

Zuno SDK includes automatic SSR-safe provider synchronization.

```tsx
import { ZunoProvider, WagmiProviderSync } from 'zuno-marketplace-sdk/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ZunoProvider config={config}>
          <WagmiProviderSync
            reconnectDelay={500}
            clearOnDisconnect={true}
          >
            {children}
          </WagmiProviderSync>
        </ZunoProvider>
      </body>
    </html>
  );
}
```

## How It Works

1. **Server-side:** Hooks return no-op fallbacks
2. **Client hydration:** State synchronizes automatically
3. **Auto-reconnect:** Attempts to reconnect wallet on mount

## SSR-Safe Hooks

All hooks are SSR-safe:

```tsx
'use client';
import { useExchange } from 'zuno-marketplace-sdk/react';

// Works in SSR - no-op during server render
function MyComponent() {
  const { listNFT } = useExchange();
  // ...
}
```

## Hydration Handling

SDK handles hydration automatically:

```tsx
// No "text content does not match" errors
// Wallet state syncs after hydration
```

## Common Issues

::collapse{title="Hydration mismatch"}
**Problem:** React hydration warnings.

**Solution:** Ensure you're using `WagmiProviderSync` wrapper.
::

::collapse{title="Window not defined"}
**Problem:** `window is not defined` on server.

**Solution:** SDK handles this internally. Ensure components using hooks are marked `'use client'`.
::

## Best Practices

::alert{type="success"}
**Use 'use client':** Mark components that use SDK hooks.
::

::alert{type="success"}
**Wrap root layout:** Include `WagmiProviderSync` in root layout.
::

## See Also

- [Next.js Setup](/integration-guides/nextjs-setup) - Full SSR setup
- [Installation](/getting-started/installation) - Provider configuration
