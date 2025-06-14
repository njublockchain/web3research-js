# Web3Research TypeScript SDK

`web3research-js` is the official TypeScript software development kit for leveraging datasets on [Web3Research Platform](http://web3resear.ch).

**Frontend-Only Implementation**: This package is designed for frontend applications and uses `@clickhouse/client-web` to connect directly to ClickHouse databases from the browser.

## Installation

```bash
npm install web3research
# or
yarn add web3research
# or  
pnpm add web3research
```

## Quick Start

```typescript
import { Web3Research, Address, SingleEventDecoder } from 'web3research';

// Initialize the client
const w3r = new Web3Research({
  apiToken: 'YOUR_API_TOKEN_HERE'
});

// Get Ethereum provider
const ethProvider = w3r.eth();

// Fetch the latest 10 blocks
const blocks = await ethProvider.blocks({
  orderBy: { number: false }, // descending order
  limit: 10
});

console.log('Latest blocks:', blocks);
```

## Features

### Multi-Chain Support

- **Ethereum**: Blocks, transactions, events, traces
- **Bitcoin**: Blocks, transactions  
- **Tron**: Blocks, transactions

### EVM Event Decoding

```typescript
import { SingleEventDecoder } from 'web3research';

// Define USDT Transfer event ABI
const transferEventABI = {
  type: 'event',
  name: 'Transfer',
  inputs: [
    { indexed: true, name: 'from', type: 'address' },
    { indexed: true, name: 'to', type: 'address' },
    { indexed: false, name: 'value', type: 'uint256' }
  ]
};

// Create decoder
const decoder = new SingleEventDecoder(transferEventABI);

// Get USDT transfer events
const usdtAddress = new Address('0xdac17f958d2ee523a2206206994597c13d831ec7');
const events = await ethProvider.events({
  where: `address = ${usdtAddress}`,
  limit: 1
});

// Decode the event
const decodedEvent = decoder.decode(events[0]);
console.log('Decoded transfer:', decodedEvent);
```

### Address Handling

```typescript
import { Address } from 'web3research';

// Ethereum address
const ethAddr = new Address('0x742d35Cc6635C0532925a3b8D400beb8aE174c4b');
console.log(ethAddr.toString()); // unhex('742d35Cc6635C0532925a3b8D400beb8aE174c4b')

// Tron address (base58)
const tronAddr = new Address('TRX9... '); // base58 format
console.log(tronAddr.addrHex); // hex representation

// Tron address (hex)
const tronAddrHex = new Address('41...'); // hex format starting with 41
```

### Streaming Data

```typescript
// Stream blocks in real-time
for await (const block of ethProvider.blocksStream({
  where: 'number > 18000000',
  limit: 100
})) {
  console.log('New block:', block.number);
}
```

## API Reference

### Web3Research Class

```typescript
const w3r = new Web3Research({ apiToken: 'your-token' });

// Ethereum provider
const eth = w3r.eth();          // or w3r.ethereum()
const btc = w3r.btc();          // or w3r.bitcoin()  
const tron = w3r.tron();
```

### EthereumProvider Methods

```typescript
// Blocks
await eth.blocks({ where: 'number > 18000000', limit: 10 });
for await (const block of eth.blocksStream(options)) { ... }

// Transactions  
await eth.transactions({ where: 'blockNumber = 18000000' });
for await (const tx of eth.transactionsStream(options)) { ... }

// Events
await eth.events({ where: 'address = unhex("...")' });
for await (const event of eth.eventsStream(options)) { ... }

// Traces
await eth.traces({ where: 'blockNumber = 18000000' });
for await (const trace of eth.tracesStream(options)) { ... }
```

### Query Options

```typescript
interface QueryOptions {
  where?: string;                    // SQL WHERE clause
  orderBy?: Record<string, boolean>; // { column: isAscending }
  limit?: number;                    // LIMIT clause
  offset?: number;                   // OFFSET clause  
  parameters?: Record<string, any>;  // Query parameters
}
```

## Examples

### Get Latest USDT Transfers

```typescript
import { Web3Research, Address } from 'web3research';

const w3r = new Web3Research({ apiToken: 'YOUR_TOKEN' });
const eth = w3r.eth();

const usdtAddress = new Address('0xdac17f958d2ee523a2206206994597c13d831ec7');

const transfers = await eth.events({
  where: `address = ${usdtAddress} AND topics[1] IS NOT NULL`,
  orderBy: { blockNumber: false },
  limit: 100
});

console.log(`Found ${transfers.length} USDT transfers`);
```

### Monitor New Blocks

```typescript
import { Web3Research } from 'web3research';

const w3r = new Web3Research({ apiToken: 'YOUR_TOKEN' });
const eth = w3r.eth();

// Get the latest block number first
const latestBlocks = await eth.blocks({
  orderBy: { number: false },
  limit: 1
});

const latestBlockNumber = latestBlocks[0].number;

// Stream newer blocks
for await (const block of eth.blocksStream({
  where: `number > ${latestBlockNumber}`,
  orderBy: { number: true }
})) {
  console.log(`New block ${block.number} with ${block.transactionCount} transactions`);
}
```

### Decode Contract Events

```typescript
import { Web3Research, ContractDecoder } from 'web3research';

const contractABI = [
  {
    type: 'event',
    name: 'Transfer', 
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' }
    ]
  }
  // ... more ABI entries
];

const decoder = new ContractDecoder(contractABI);
const w3r = new Web3Research({ apiToken: 'YOUR_TOKEN' });
const eth = w3r.eth();

const events = await eth.events({
  where: 'blockNumber = 18000000',
  limit: 100
});

for (const event of events) {
  const decoded = decoder.decodeEvent(event);
  if (decoded) {
    console.log('Decoded event:', decoded);
  }
}
```

## Error Handling

```typescript
try {
  const blocks = await eth.blocks({ where: 'number > 18000000' });
} catch (error) {
  console.error('Query failed:', error);
}
```

## Browser Compatibility

This package is designed for modern browsers that support:
- ES2020
- WebAssembly (for ClickHouse client)
- Fetch API
- Async/Await

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run development server
npm run dev

# Run tests
npm test
```

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## Support

- [Documentation](https://doc.web3resear.ch/)
- [GitHub Issues](https://github.com/njublockchain/web3research-js/issues)
- [Web3Research Platform](http://web3resear.ch)
