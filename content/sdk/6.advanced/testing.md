---
title: "Testing"
package: "sdk"
scope: "guide"
complexity: "advanced"
category: "advanced"
---

Testing SDK integration with Vitest/Jest and React Testing Library.

## Setup

Install testing dependencies:

```bash
pnpm add -D @testing-library/react @testing-library/jest-dom vitest jsdom
```

Configure `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
```

## Test Wrapper

Create mock provider wrapper:

```typescript
// test-utils.tsx
import { render } from '@testing-library/react';
import { ZunoProvider } from 'zuno-marketplace-sdk/react';

const mockConfig = {
  apiKey: 'test-key',
  network: 31337,
  apiUrl: 'http://test',
};

export function renderWithProviders(ui: React.ReactElement) {
  return render(<ZunoProvider config={mockConfig}>{ui}</ZunoProvider>);
}
```

## Test Mutations

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useExchange } from 'zuno-marketplace-sdk/react';

describe('useExchange', () => {
  it('should list NFT', async () => {
    const { result } = renderHook(() => useExchange(), {
      wrapper: ({ children }) => (
        <ZunoProvider config={mockConfig}>{children}</ZunoProvider>
      ),
    });

    // Mock successful transaction
    vi.spyOn(result.current.listNFT, 'mutateAsync').mockResolvedValue({
      listingId: 'test-listing-id',
      tx: { hash: '0xtx', wait: vi.fn() },
    });

    await act(async () => {
      await result.current.listNFT.mutateAsync({
        collectionAddress: '0x...',
        tokenId: '1',
        price: '1.0',
        duration: 86400,
      });
    });

    expect(result.current.listNFT.isSuccess).toBe(true);
  });
});
```

## Test Queries

```typescript
describe('getActiveListings', () => {
  it('should fetch listings', async () => {
    const { result } = renderHook(
      () => useActiveListings({ page: 1, limit: 20 }),
      { wrapper: ZunoTestWrapper }
    );

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
      expect(result.current.data.items).toHaveLength(20);
    });
  });
});
```

## Mock Wallet

```typescript
const mockWallet = {
  address: '0xTest...',
  isConnected: true,
  connect: vi.fn(),
  disconnect: vi.fn(),
};

vi.mock('zuno-marketplace-sdk/react', () => ({
  useWallet: () => mockWallet,
}));
```

## See Also

- [Integration Guides](/integration-guides/nextjs-setup) - Setup examples
- [Hooks API](/api-reference/hooks-api) - Hook signatures
