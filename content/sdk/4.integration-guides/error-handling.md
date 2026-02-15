---
title: "Error Handling Guide"
package: "sdk"
scope: "guide"
complexity: "intermediate"
category: "integration"
---

Comprehensive error handling patterns for Zuno SDK v2.1.2, covering transaction errors, network issues, and user-friendly messaging.

## Error Types

### 1. Transaction Errors

Errors that occur during blockchain transactions:

| Error Code | Description | Common Cause |
|------------|-------------|---------------|
| `INSUFFICIENT_FUNDS` | Not enough ETH for gas | Account balance too low |
| `USER_REJECTED` | User cancelled transaction | MetaMask rejection |
| `INVALID_ARGUMENT` | Invalid parameter passed | Wrong value format |
| `CALL_EXCEPTION` | Contract call failed | Reverted by contract |
| `NETWORK_ERROR` | Network RPC failure | RPC timeout/down |

### 2. Network Errors

Errors related to blockchain connectivity:

| Error | Description | Solution |
|-------|-------------|----------|
| `RPC_TIMEOUT` | RPC request timeout | Retry with longer timeout |
| `INVALID_NETWORK` | Wrong chain/network | Switch to correct network |
| `CONNECTION_FAILED` | Can't reach RPC | Check RPC URL configuration |

### 3. Validation Errors

Errors from invalid inputs:

| Error | Description | Prevention |
|-------|-------------|------------|
| `INVALID_ADDRESS` | Invalid Ethereum address | Validate address format |
| `INVALID_AMOUNT` | Amount <= 0 | Check before sending |
| `INVALID_DURATION` | Duration too short/long | Validate range |

## Error Handling Pattern

### Basic try-catch with User Feedback

```tsx
import { useExchange } from 'zuno-marketplace-sdk/react';
import { toast } from 'sonner'; // or your toast library

function ListNFTComponent() {
  const { listNFT } = useExchange();

  const handleList = async () => {
    try {
      const { listingId, tx } = await listNFT.mutateAsync({
        collectionAddress: '0x...',
        tokenId: '1',
        price: '1.5',
        duration: 86400,
      });

      await tx.wait();
      toast.success(`NFT listed! ID: ${listingId}`);

    } catch (error) {
      handleError(error, 'Failed to list NFT');
    }
  };

  return <button onClick={handleList}>List NFT</button>;
}
```

### Centralized Error Handler

```typescript
// lib/utils/error-handler.ts

export function handleError(error: unknown, context: string): void {
  const errorMessage = getUserFriendlyMessage(error);

  if (shouldLogError(error)) {
    logger.error(`${context} failed`, error, { context });
  }

  toast.error(errorMessage);
}

function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof Error) {
    // Known error patterns
    if (error.message.includes('insufficient funds')) {
      return 'Insufficient balance. Please add more ETH to cover gas fees.';
    }
    if (error.message.includes('user rejected') || error.code === 4001) {
      return 'Transaction was cancelled.';
    }
    if (error.message.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
  }

  // Default message
  return 'An unexpected error occurred. Please try again.';
}

function shouldLogError(error: unknown): boolean {
  // Don't log user cancellations
  if (error instanceof Error) {
    if (error.code === 4001) return false; // User rejected
    if (error.message.includes('User rejected')) return false;
  }
  return true;
}
```

## Transaction Error Handling

### Handle Insufficient Funds

```typescript
async function handleTransactionWithBalanceCheck() {
  const { provider } = useWallet();
  const { listNFT } = useExchange();

  try {
    // Check balance first
    const balance = await provider.getBalance(address);
    const balanceInEth = parseFloat(ethers.formatEther(balance));

    // Estimate gas for transaction
    const gasEstimate = await listNFT.mutateAsync({...}).catch(() => {
      // Fallback estimation
      return BigInt('200000'); // ~0.0002 ETH gas
    });

    const gasPrice = await provider.getGasPrice();
    const estimatedGasCost = Number(gasEstimate) * Number(gasPrice);

    if (balanceInEth < estimatedGasCost) {
      throw new Error(`Insufficient balance. Need ~${ethers.formatEther(gasCost)} ETH for gas.`);
    }

    // Proceed with transaction
    const { listingId, tx } = await listNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenId: '1',
      price: '1.5',
      duration: 86400,
    });

    await tx.wait();

  } catch (error) {
    handleError(error, 'Transaction failed');
  }
}
```

### Handle User Rejection

```typescript
try {
  const { tx } = await listNFT.mutateAsync({...});
  await tx.wait();
} catch (error: any) {
  if (error.code === 4001 || error.message?.includes('User rejected')) {
    toast.info('Transaction was cancelled');
    return;
  }
  throw error;
}
```

### Handle Contract Reverts

```typescript
try {
  const { tx } = await sdk.collection.mintERC721({...});
  await tx.wait();
} catch (error: any) {
  if (error.message?.includes('execution reverted')) {
    // Parse revert reason if available
    const revertReason = parseRevertReason(error);
    throw new Error(`Transaction failed: ${revertReason}`);
  }
  throw error;
}

function parseRevertReason(error: any): string {
  // Try to extract revert reason from error data
  if (error.data) {
    return error.data; // Contract-specific revert reason
  }
  return 'Transaction reverted by contract';
}
```

## Network Error Handling

### Retry with Exponential Backoff

```typescript
class RetryHandler {
  private static MAX_RETRIES = 3;

  static async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Don't retry certain errors
        if (!this.shouldRetry(error)) {
          throw error;
        }

        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        logger.warn(`${context} failed, retrying in ${delay}ms (attempt ${attempt}/${this.MAX_RETRIES})`);

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error(`${context} failed after ${this.MAX_RETRIES} attempts: ${lastError.message}`);
  }

  static shouldRetry(error: Error): boolean {
    const retryableErrors = [
      'NETWORK_ERROR',
      'TIMEOUT',
      'rate limit',
      'too many requests',
    ];

    return retryableErrors.some(pattern =>
      error.message.toLowerCase().includes(pattern)
    );
  }
}

// Usage
const { tx } = await RetryHandler.executeWithRetry(
  () => sdk.exchange.listNFT({...}),
  'listNFT'
);
```

### RPC Fallback

```typescript
async function executeWithFallback() {
  const rpcUrls = [
    process.env.NEXT_PUBLIC_RPC_URL,
    'https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY',
    'https://sepolia.infura.io/v3/YOUR_KEY',
  ];

  for (const rpcUrl of rpcUrls) {
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const balance = await provider.getBalance(address);
      return balance;
    } catch (error) {
      logger.warn(`RPC ${rpcUrl} failed, trying next...`);
    }
  }

  throw new Error('All RPC endpoints failed');
}
```

## Validation Error Handling

### Pre-Transaction Validation

```typescript
interface ListNFTParams {
  collectionAddress: string;
  tokenId: string;
  price: string;
  duration: number;
}

function validateListNFTParams(params: ListNFTParams): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate address
  if (!ethers.isAddress(params.collectionAddress)) {
    errors.push('Invalid collection address');
  }

  // Validate price
  const priceNum = parseFloat(params.price);
  if (isNaN(priceNum) || priceNum <= 0) {
    errors.push('Price must be a positive number');
  }

  // Validate duration
  if (params.duration < 60) {
    errors.push('Duration must be at least 60 seconds');
  }
  if (params.duration > 30 * 24 * 3600) {
    errors.push('Duration cannot exceed 30 days');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Usage
const validation = validateListNFTParams(params);
if (!validation.isValid) {
  toast.error(validation.errors.join(', '));
  return;
}
```

## Logging Best Practices

### Structured Logging

```typescript
import { logger } from '@/lib/utils/sdk-logger';

// Good: Structured with context
logger.error('Failed to list NFT', error, {
  component: 'ListNFTComponent',
  action: 'listNFT',
  collectionAddress,
  tokenId,
  price,
  duration,
});

// Bad: Unstructured
console.log('Error listing NFT:', error);
```

### Log Levels

```typescript
// Debug: Detailed development info
logger.debug('Wallet state updated', { account, chainId });

// Info: Important state changes
logger.info('Transaction submitted', { txHash, from, to });

// Warn: Unexpected but recoverable
logger.warn('RPC endpoint slow', { rpcUrl, responseTime });

// Error: Failures requiring attention
logger.error('Transaction failed', error, { context });
```

## User-Friendly Messages

### Error Message Mapping

```typescript
const errorMessages: Record<string, string> = {
  'insufficient funds': 'Not enough ETH. Please add more funds to cover gas.',
  'user rejected': 'Transaction was cancelled.',
  'network error': 'Network error. Please check your connection.',
  'timeout': 'Request timeout. Please try again.',
  'invalid address': 'Invalid wallet address. Please check and try again.',
  'unauthorized': 'Not authorized. Please connect your wallet.',
  'invalid amount': 'Invalid amount. Must be greater than 0.',
};

function getUserFriendlyMessage(error: Error): string {
  const lowerMessage = error.message.toLowerCase();

  for (const [key, message] of Object.entries(errorMessages)) {
    if (lowerMessage.includes(key)) {
      return message;
    }
  }

  return error.message; // Default to original message
}
```

## Best Practices

::alert{type="success"}
**Validate early:** Check inputs before sending transactions.
::

::alert{type="success"}
**Retry intelligently:** Only retry transient errors (network, rate limits).
::

::alert{type="success"}
**Log structured data:** Include context for debugging.
::

::alert{type="warning"}
**Don't log everything:** Filter out user cancellations and expected errors.
::

::alert{type="info"}
**Show actionable messages:** Tell users what to do next.
::

## See Also

- [Integration Tutorial](/integration-guides/zuno-mini-tutorial) - Complete error handling walkthrough
- [Integration Reference](/integration-guides/zuno-mini-reference) - Error handler implementation
- [Wallet Integration](/integration-guides/wallet-integration) - Connection error handling
- [Installation](/getting-started/installation) - Environment configuration
