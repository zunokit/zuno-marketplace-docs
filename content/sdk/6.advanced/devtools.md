---
title: "DevTools"
package: "sdk"
scope: "guide"
complexity: "advanced"
category: "advanced"
---

ZunoDevTools provides an in-app debugging panel for development.

## Installation

```tsx
import { ZunoDevTools } from 'zuno-marketplace-sdk/react';

function App() {
  return (
    <ZunoProvider config={config}>
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

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showLogger` | boolean | true | Show logger output panel |
| `showTransactions` | boolean | true | Show transaction history |
| `showCache` | boolean | true | Show query cache status |
| `showNetwork` | boolean | true | Show network/chain info |
| `position` | string | "bottom-right" | Panel position |
| `defaultCollapsed` | boolean | false | Start collapsed |

## Panels

### Logger Panel

- Real-time SDK logs
- Search and filter
- Log levels (debug, info, warn, error)
- Export logs

### Transaction Panel

- Transaction history
- Status (pending, confirmed, failed)
- Retry failed transactions
- View transaction details

### Cache Panel

- Query cache status
- Cache entries with TTL
- Manual cache invalidation
- Inspect cached data

### Network Panel

- Current chain ID
- Connected network name
- RPC endpoint status
- API health check

## Position Options

```typescript
position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
```

## Production Considerations

::alert{type="warning"}
**Never use in production:** DevTools should only be enabled when `NODE_ENV === 'development'`.
::

## See Also

- [Next.js Setup](/sdk/integration-guides/nextjs-setup) - DevTools in setup
- [Installation](/sdk/getting-started/installation) - Configuration
