import { describe, it, expect } from 'vitest';

// Import all exports from the main index file
import {
  // Main exports
  Web3Research,
  
  // Provider exports
  EthereumProvider,
  BitcoinProvider,
  TronProvider,
  ClickHouseProvider,
  
  // EVM decoder exports
  SingleEventDecoder,
  ContractDecoder,
  
  // Common types and utilities
  Address,
  Hash,
  ChainStyle,
  BTCAddressVariant,
  
  // Format utilities
  applyColumnFormats,
  groupEventTopics,
  ETHEREUM_BLOCK_COLUMN_FORMATS,
  ETHEREUM_TRANSACTION_COLUMN_FORMATS,
  ETHEREUM_EVENT_COLUMN_FORMATS,
  ETHEREUM_TRACE_COLUMN_FORMATS,
  
  // Version
  VERSION
} from '../src/index.js';

import type {
  EventABI,
  FunctionABI,
  QueryOptions,
  BlockData,
  TransactionData,
  EventData,
  TraceData,
  BitcoinBlockData,
  BitcoinTransactionData,
  TronBlockData,
  TronTransactionData,
  Web3ResearchConfig,
  ClickHouseConfig
} from '../src/index.js';

describe('Index Exports', () => {
  describe('Main Class Exports', () => {
    it('should export Web3Research class', () => {
      expect(Web3Research).toBeDefined();
      expect(typeof Web3Research).toBe('function');
    });
  });

  describe('Provider Exports', () => {
    it('should export EthereumProvider class', () => {
      expect(EthereumProvider).toBeDefined();
      expect(typeof EthereumProvider).toBe('function');
    });

    it('should export BitcoinProvider class', () => {
      expect(BitcoinProvider).toBeDefined();
      expect(typeof BitcoinProvider).toBe('function');
    });

    it('should export TronProvider class', () => {
      expect(TronProvider).toBeDefined();
      expect(typeof TronProvider).toBe('function');
    });

    it('should export ClickHouseProvider class', () => {
      expect(ClickHouseProvider).toBeDefined();
      expect(typeof ClickHouseProvider).toBe('function');
    });
  });

  describe('EVM Decoder Exports', () => {
    it('should export SingleEventDecoder class', () => {
      expect(SingleEventDecoder).toBeDefined();
      expect(typeof SingleEventDecoder).toBe('function');
    });

    it('should export ContractDecoder class', () => {
      expect(ContractDecoder).toBeDefined();
      expect(typeof ContractDecoder).toBe('function');
    });
  });

  describe('Common Type Exports', () => {
    it('should export Address class', () => {
      expect(Address).toBeDefined();
      expect(typeof Address).toBe('function');
    });

    it('should export Hash class', () => {
      expect(Hash).toBeDefined();
      expect(typeof Hash).toBe('function');
    });

    it('should export ChainStyle enum', () => {
      expect(ChainStyle).toBeDefined();
      expect(typeof ChainStyle).toBe('object');
      expect(ChainStyle.ETH).toBe('chain:eth');
      expect(ChainStyle.BTC).toBe('chain:btc');
      expect(ChainStyle.TRON).toBe('chain:tron');
    });

    it('should export BTCAddressVariant enum', () => {
      expect(BTCAddressVariant).toBeDefined();
      expect(typeof BTCAddressVariant).toBe('object');
      expect(BTCAddressVariant.P2PKH).toBe('p2pkh');
      expect(BTCAddressVariant.P2SH).toBe('p2sh');
      expect(BTCAddressVariant.BECH32).toBe('bech32');
    });
  });

  describe('Format Utility Exports', () => {
    it('should export applyColumnFormats function', () => {
      expect(applyColumnFormats).toBeDefined();
      expect(typeof applyColumnFormats).toBe('function');
    });

    it('should export groupEventTopics function', () => {
      expect(groupEventTopics).toBeDefined();
      expect(typeof groupEventTopics).toBe('function');
    });

    it('should export format constants', () => {
      expect(ETHEREUM_BLOCK_COLUMN_FORMATS).toBeDefined();
      expect(typeof ETHEREUM_BLOCK_COLUMN_FORMATS).toBe('object');
      
      expect(ETHEREUM_TRANSACTION_COLUMN_FORMATS).toBeDefined();
      expect(typeof ETHEREUM_TRANSACTION_COLUMN_FORMATS).toBe('object');
      
      expect(ETHEREUM_EVENT_COLUMN_FORMATS).toBeDefined();
      expect(typeof ETHEREUM_EVENT_COLUMN_FORMATS).toBe('object');
      
      expect(ETHEREUM_TRACE_COLUMN_FORMATS).toBeDefined();
      expect(typeof ETHEREUM_TRACE_COLUMN_FORMATS).toBe('object');
    });
  });

  describe('Version Export', () => {
    it('should export VERSION constant', () => {
      expect(VERSION).toBeDefined();
      expect(typeof VERSION).toBe('string');
      expect(VERSION).toBe('0.0.1');
    });
  });

  describe('Type Exports', () => {
    it('should be able to use exported types', () => {
      // Test that types can be used (TypeScript compilation test)
      const queryOptions: QueryOptions = {
        limit: 100,
        offset: 0
      };
      expect(queryOptions).toBeDefined();

      const config: Web3ResearchConfig = {
        apiToken: 'test-token',
        backend: 'https://test.example.com'
      };
      expect(config).toBeDefined();

      const clickhouseConfig: ClickHouseConfig = {
        apiToken: 'test-token',
        database: 'test_db'
      };
      expect(clickhouseConfig).toBeDefined();
    });
  });

  describe('Integration Test', () => {
    it('should be able to create instances of exported classes', () => {
      // Test Address creation
      const address = new Address('0x742d35Cc6634C0532925a3b8D5c48E0b11a0e9df');
      expect(address).toBeInstanceOf(Address);
      expect(address.addr).toBe('0x742d35Cc6634C0532925a3b8D5c48E0b11a0e9df');

      // Test Hash creation
      const hash = new Hash('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
      expect(hash).toBeInstanceOf(Hash);
      expect(hash.hash).toBe('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');

      // Test ClickHouseProvider creation
      const clickHouseProvider = new ClickHouseProvider({
        apiToken: 'test-token',
        database: 'test_db'
      });
      expect(clickHouseProvider).toBeInstanceOf(ClickHouseProvider);

      // Test EthereumProvider creation
      const ethProvider = new EthereumProvider({
        apiToken: 'test-token',
        database: 'ethereum'
      });
      expect(ethProvider).toBeInstanceOf(EthereumProvider);

      // Test BitcoinProvider creation
      const btcProvider = new BitcoinProvider({
        apiToken: 'test-token',
        database: 'bitcoin'
      });
      expect(btcProvider).toBeInstanceOf(BitcoinProvider);

      // Test TronProvider creation
      const tronProvider = new TronProvider({
        apiToken: 'test-token',
        database: 'tron'
      });
      expect(tronProvider).toBeInstanceOf(TronProvider);

      // Test Web3Research creation
      const w3r = new Web3Research({
        apiToken: 'test-token',
        backend: 'https://test.example.com'
      });
      expect(w3r).toBeInstanceOf(Web3Research);
    });

    it('should be able to use format utilities', () => {
      const mockData = [
        { number: '123', hash: '0xabc' },
        { number: '456', hash: '0xdef' }
      ];

      const formatted = applyColumnFormats(mockData, ETHEREUM_BLOCK_COLUMN_FORMATS);
      expect(formatted).toBeDefined();
      expect(Array.isArray(formatted)).toBe(true);
    });

    it('should be able to create EVM decoders', () => {
      const eventABI: EventABI = {
        type: 'event',
        name: 'Transfer',
        inputs: [
          { name: 'from', type: 'address', indexed: true },
          { name: 'to', type: 'address', indexed: true },
          { name: 'value', type: 'uint256', indexed: false }
        ]
      };

      const decoder = new SingleEventDecoder(eventABI);
      expect(decoder).toBeInstanceOf(SingleEventDecoder);

      const contractDecoder = new ContractDecoder([eventABI]);
      expect(contractDecoder).toBeInstanceOf(ContractDecoder);
    });
  });

  describe('Re-export Consistency', () => {
    it('should have consistent exports with source modules', async () => {
      // Import directly from source modules to compare
      const { Web3Research: SourceWeb3Research } = await import('../src/web3research.js');
      const { EthereumProvider: SourceEthereumProvider } = await import('../src/eth/provider.js');
      const { Address: SourceAddress } = await import('../src/common/types.js');

      expect(Web3Research).toBe(SourceWeb3Research);
      expect(EthereumProvider).toBe(SourceEthereumProvider);
      expect(Address).toBe(SourceAddress);
    });
  });
});
