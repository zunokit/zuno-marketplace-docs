---
title: "Wallet Integration Guide"
package: "sdk"
scope: "guide"
complexity: "beginner"
category: "integration"
---

Comprehensive guide for integrating Web3 wallet connections with Zuno Marketplace SDK v2.1.2, covering MetaMask, WalletConnect, and auto-reconnect patterns.

## Overview

The SDK provides `useWallet` hook for wallet connection, but you can also implement custom wallet providers for advanced use cases like auto-reconnect, balance tracking, and network validation.

## Wallet Options

### Supported Wallets

| Wallet | Type | Notes |
|--------|------|-------|
| MetaMask | Browser Extension | Most popular, works out of box |
| WalletConnect | Mobile | Requires additional setup |
| Coinbase Wallet | Browser/Mobile | Good mobile support |
| Rabby | Desktop | Advanced users |

## Basic Wallet Integration

### Using SDK Hook

```tsx
import { useWallet } from 'zuno-marketplace-sdk/react';

function WalletConnect() {
  const { address, connect, disconnect, isConnected } = useWallet();

  return (
    <div>
      {!isConnected ? (
        <button onClick={() => connect()}>
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>{address}</p>
          <button onClick={() => disconnect()}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
```

## Advanced: Custom Wallet Provider

Based on zuno-mini's `WalletProvider.tsx`, here's a simplified pattern:

### 1. Define Wallet State

```typescript
interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  account: string | null;
  chainId: number | null;
  balance: string | null;
  error: Error | null;
}

const initialState: WalletState = {
  isConnected: false,
  isConnecting: false,
  account: null,
  chainId: null,
  balance: null,
  error: null,
};
```

### 2. Create Reducer

```typescript
enum ActionType {
  CONNECT_START,
  CONNECT_SUCCESS,
  CONNECT_ERROR,
  DISCONNECT,
  UPDATE_BALANCE,
}

function walletReducer(state: WalletState, action: any): WalletState {
  switch (action.type) {
    case ActionType.CONNECT_START:
      return { ...state, isConnecting: true, error: null };

    case ActionType.CONNECT_SUCCESS:
      return {
        ...state,
        isConnected: true,
        isConnecting: false,
        account: action.payload.account,
        chainId: action.payload.chainId,
        balance: action.payload.balance,
      };

    case ActionType.CONNECT_ERROR:
      return { ...state, isConnecting: false, error: action.payload };

    case ActionType.DISCONNECT:
      return initialState;

    case ActionType.UPDATE_BALANCE:
      return { ...state, balance: action.payload };

    default:
      return state;
  }
}
```

### 3. Implement Auto-Reconnect

```typescript
useEffect(() => {
  let mounted = true;

  const attemptReconnect = async () => {
    if (!mounted || state.isConnected) return;

    // Check for saved connection
    const saved = localStorage.getItem('wallet_connection');
    if (!saved) return;

    try {
      const { provider } = await detectWallet();
      const accounts = await provider.send('eth_accounts', []);

      if (accounts.length && accounts[0] === saved.account) {
        // Reconnect successful
        dispatch({
          type: CONNECT_SUCCESS,
          payload: { account: accounts[0], ...otherData },
        });
      }
    } catch (error) {
      console.error('Auto-reconnect failed:', error);
    }
  };

  setTimeout(attemptReconnect, 500); // Delay to avoid race conditions
  return () => { mounted = false; };
}, []);
```

### 4. Handle Network Changes

```typescript
useEffect(() => {
  if (!window.ethereum) return;

  const handleAccountsChanged = (accounts: string[]) => {
    if (!accounts.length) {
      dispatch({ type: DISCONNECT });
      localStorage.removeItem('wallet_connection');
    }
  };

  const handleChainChanged = (chainId: string) => {
    dispatch({ type: UPDATE_CHAIN, payload: parseInt(chainId, 16) });
    // Reload page to ensure clean state
    window.location.reload();
  };

  window.ethereum.on('accountsChanged', handleAccountsChanged);
  window.ethereum.on('chainChanged', handleChainChanged);

  return () => {
    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    window.ethereum.removeListener('chainChanged', handleChainChanged);
  };
}, []);
```

### 5. Balance Tracking

```typescript
const refreshBalance = useCallback(async () => {
  if (!state.provider || !state.account) return;

  try {
    const balance = await state.provider.getBalance(state.account);
    dispatch({
      type: UPDATE_BALANCE,
      payload: ethers.formatEther(balance),
    });
  } catch (error) {
    console.error('Failed to refresh balance:', error);
  }
}, [state.provider, state.account]);

// Refresh every 30 seconds
useEffect(() => {
  if (!state.isConnected) return;

  const interval = setInterval(refreshBalance, 30000);
  return () => clearInterval(interval);
}, [state.isConnected, refreshBalance]);
```

## Network Switching

### Automatic Network Prompt

```typescript
async function connectWithNetworkCheck() {
  const provider = await detectWallet();
  const network = await provider.getNetwork();
  const currentChainId = Number(network.chainId);
  const expectedChainId = parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID);

  if (currentChainId !== expectedChainId) {
    const shouldSwitch = confirm(
      `Wrong network (${currentChainId}). Switch to ${expectedChainId}?`
    );

    if (shouldSwitch) {
      await switchNetwork(provider, expectedChainId);
      // Will trigger chainChanged event and page reload
      return;
    }
  }

  // Proceed with connection
  const accounts = await provider.send('eth_requestAccounts', []);
  // ... rest of connection logic
}

async function switchNetwork(provider: ethers.BrowserProvider, targetChainId: number) {
  const hexChainId = `0x${targetChainId.toString(16)}`;

  try {
    await provider.send('wallet_switchEthereumChain', [
      { chainId: hexChainId },
    ]);
  } catch (error: any) {
    // Chain not added, try to add it
    if (error.code === 4902) {
      throw new Error(
        `Chain ${targetChainId} not in wallet. Please add manually.`
      );
    }
    throw error;
  }
}
```

## Common Wallet Issues

::collapse{title="User cancels connection"}
**Problem:** User rejects MetaMask connection prompt.

**Solution:** Handle user rejection gracefully:

```typescript
try {
  const accounts = await provider.send('eth_requestAccounts', []);
  // ...
} catch (error) {
  if (error.code === 4001) {
    // User rejected
    console.info('User cancelled connection');
  } else {
    throw error;
  }
}
```
::

::collapse{title="Wrong network"}
**Problem:** User is on mainnet but app requires sepolia.

**Solution:** Prompt to switch networks:

```typescript
const expectedChainId = 11155111; // Sepolia
const currentChainId = Number(network.chainId);

if (currentChainId !== expectedChainId) {
  const shouldSwitch = confirm(
    `Switch from chain ${currentChainId} to ${expectedChainId}?`
  );

  if (shouldSwitch) {
    await switchNetwork(provider, expectedChainId);
  }
}
```
::

::collapse{title="Balance not updating"}
**Problem:** User's balance doesn't reflect recent transactions.

**Solution:** Implement periodic refresh:

```typescript
useEffect(() => {
  const interval = setInterval(refreshBalance, 30000); // Every 30s
  return () => clearInterval(interval);
}, [isConnected]);
```
::

::collapse{title="Page refresh loses connection"}
**Problem:** After page refresh, wallet appears disconnected.

**Solution:** Implement auto-reconnect pattern from above.
::

## Best Practices

::alert{type="success"}
**Persist connection:** Save wallet address to localStorage for auto-reconnect.
::

::alert{type="success"}
**Validate network:** Check chain ID before allowing transactions.
::

::alert{type="info"}
**Listen to events:** Handle `accountsChanged` and `chainChanged` events.
::

::alert{type="warning"}
**Clear on disconnect:** Remove saved connection when user disconnects.
::

## See Also

- [Zuno Mini Reference](/sdk/integration-guides/zuno-mini-reference) - Full provider implementation
- [Next.js Setup](/sdk/integration-guides/nextjs-setup) - Project configuration
- [Error Handling](/sdk/integration-guides/error-handling) - Error management patterns
