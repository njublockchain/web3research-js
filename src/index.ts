// Main exports
export { Web3Research } from './web3research.js';

// Provider exports
export { EthereumProvider } from './eth/provider.js';
export { BitcoinProvider } from './btc/provider.js';
export { TronProvider } from './tron/provider.js';
export { ClickHouseProvider } from './db/provider.js';

// EVM decoder exports
export { SingleEventDecoder, ContractDecoder } from './evm/decoder.js';
export type { EventABI, FunctionABI } from './evm/decoder.js';

// Common types and utilities
export { Address, Hash, ChainStyle, BTCAddressVariant } from './common/types.js';
export type { 
  QueryOptions, 
  BlockData, 
  TransactionData, 
  EventData, 
  TraceData 
} from './common/types.js';

// Format utilities
export { 
  applyColumnFormats,
  groupEventTopics,
  ETHEREUM_BLOCK_COLUMN_FORMATS,
  ETHEREUM_TRANSACTION_COLUMN_FORMATS,
  ETHEREUM_EVENT_COLUMN_FORMATS,
  ETHEREUM_TRACE_COLUMN_FORMATS
} from './common/formats.js';

// Bitcoin and Tron specific types
export type { 
  BitcoinBlockData, 
  BitcoinTransactionData 
} from './btc/provider.js';
export type { 
  TronBlockData, 
  TronTransactionData 
} from './tron/provider.js';

// Configuration types
export type { Web3ResearchConfig } from './web3research.js';
export type { ClickHouseConfig } from './db/provider.js';

// Version
export const VERSION = '0.0.1';