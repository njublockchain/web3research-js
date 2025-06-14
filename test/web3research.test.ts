import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Web3Research } from '../src/web3research.js';
import { EthereumProvider } from '../src/eth/provider.js';
import { BitcoinProvider } from '../src/btc/provider.js';
import { TronProvider } from '../src/tron/provider.js';

// Mock the provider classes
vi.mock('../src/eth/provider.js');
vi.mock('../src/btc/provider.js');
vi.mock('../src/tron/provider.js');

describe('Web3Research', () => {
  let w3r: Web3Research;
  const apiToken = 'test-api-token-123';

  beforeEach(() => {
    vi.clearAllMocks();
    w3r = new Web3Research({ apiToken });
  });

  describe('constructor', () => {
    it('should create Web3Research instance with API token', () => {
      expect(w3r).toBeInstanceOf(Web3Research);
    });

    it('should throw error without API token', () => {
      expect(() => new Web3Research({ apiToken: '' })).toThrow('API token is required');
    });
  });

  describe('eth()', () => {
    it('should create EthereumProvider with default options', () => {
      const provider = w3r.eth();

      expect(EthereumProvider).toHaveBeenCalledWith({
        apiToken,
        backend: undefined,
        database: 'ethereum',
        settings: undefined,
        genericArgs: undefined,
      });
      expect(provider).toBeInstanceOf(EthereumProvider);
    });

    it('should create EthereumProvider with custom options', () => {
      const options = {
        backend: 'https://custom.backend.com',
        database: 'custom-eth',
        settings: { max_memory_usage: '1000000' },
        genericArgs: { timeout: 30000 }
      };

      const provider = w3r.eth(options);

      expect(EthereumProvider).toHaveBeenCalledWith({
        apiToken,
        ...options,
      });
    });
  });

  describe('ethereum()', () => {
    it('should be alias for eth()', () => {
      const provider = w3r.ethereum();

      expect(EthereumProvider).toHaveBeenCalledWith({
        apiToken,
        backend: undefined,
        database: 'ethereum',
        settings: undefined,
        genericArgs: undefined,
      });
      expect(provider).toBeInstanceOf(EthereumProvider);
    });
  });

  describe('btc()', () => {
    it('should create BitcoinProvider with default options', () => {
      const provider = w3r.btc();

      expect(BitcoinProvider).toHaveBeenCalledWith({
        apiToken,
        backend: undefined,
        database: 'bitcoin',
        settings: undefined,
        genericArgs: undefined,
      });
      expect(provider).toBeInstanceOf(BitcoinProvider);
    });

    it('should create BitcoinProvider with custom options', () => {
      const options = {
        backend: 'https://custom.backend.com',
        database: 'custom-btc',
        settings: { max_memory_usage: '500000' }
      };

      const provider = w3r.btc(options);

      expect(BitcoinProvider).toHaveBeenCalledWith({
        apiToken,
        ...options,
      });
    });
  });

  describe('bitcoin()', () => {
    it('should be alias for btc()', () => {
      const provider = w3r.bitcoin();

      expect(BitcoinProvider).toHaveBeenCalledWith({
        apiToken,
        backend: undefined,
        database: 'bitcoin',
        settings: undefined,
        genericArgs: undefined,
      });
      expect(provider).toBeInstanceOf(BitcoinProvider);
    });
  });

  describe('tron()', () => {
    it('should create TronProvider with default options', () => {
      const provider = w3r.tron();

      expect(TronProvider).toHaveBeenCalledWith({
        apiToken,
        backend: undefined,
        database: 'tron',
        settings: undefined,
        genericArgs: undefined,
      });
      expect(provider).toBeInstanceOf(TronProvider);
    });

    it('should create TronProvider with custom options', () => {
      const options = {
        backend: 'https://custom.backend.com',
        database: 'custom-tron',
        settings: { max_memory_usage: '2000000' },
        genericArgs: { compress: true }
      };

      const provider = w3r.tron(options);

      expect(TronProvider).toHaveBeenCalledWith({
        apiToken,
        ...options,
      });
    });
  });

  describe('multiple providers', () => {
    it('should create multiple providers independently', () => {
      const ethProvider = w3r.eth();
      const btcProvider = w3r.btc();
      const tronProvider = w3r.tron();

      expect(EthereumProvider).toHaveBeenCalledTimes(1);
      expect(BitcoinProvider).toHaveBeenCalledTimes(1);
      expect(TronProvider).toHaveBeenCalledTimes(1);

      expect(ethProvider).toBeInstanceOf(EthereumProvider);
      expect(btcProvider).toBeInstanceOf(BitcoinProvider);
      expect(tronProvider).toBeInstanceOf(TronProvider);
    });

    it('should pass same API token to all providers', () => {
      w3r.eth();
      w3r.btc();
      w3r.tron();

      expect(EthereumProvider).toHaveBeenCalledWith(
        expect.objectContaining({ apiToken })
      );
      expect(BitcoinProvider).toHaveBeenCalledWith(
        expect.objectContaining({ apiToken })
      );
      expect(TronProvider).toHaveBeenCalledWith(
        expect.objectContaining({ apiToken })
      );
    });
  });

  describe('configuration inheritance', () => {
    it('should pass through backend configuration', () => {
      const backend = 'https://test.backend.com';
      
      w3r.eth({ backend });
      w3r.btc({ backend });
      w3r.tron({ backend });

      expect(EthereumProvider).toHaveBeenCalledWith(
        expect.objectContaining({ backend })
      );
      expect(BitcoinProvider).toHaveBeenCalledWith(
        expect.objectContaining({ backend })
      );
      expect(TronProvider).toHaveBeenCalledWith(
        expect.objectContaining({ backend })
      );
    });

    it('should pass through settings configuration', () => {
      const settings = { max_memory_usage: '1000000' };
      
      w3r.eth({ settings });
      w3r.btc({ settings });
      w3r.tron({ settings });

      expect(EthereumProvider).toHaveBeenCalledWith(
        expect.objectContaining({ settings })
      );
      expect(BitcoinProvider).toHaveBeenCalledWith(
        expect.objectContaining({ settings })
      );
      expect(TronProvider).toHaveBeenCalledWith(
        expect.objectContaining({ settings })
      );
    });

    it('should pass through generic args configuration', () => {
      const genericArgs = { timeout: 30000, compress: true };
      
      w3r.eth({ genericArgs });
      w3r.btc({ genericArgs });
      w3r.tron({ genericArgs });

      expect(EthereumProvider).toHaveBeenCalledWith(
        expect.objectContaining({ genericArgs })
      );
      expect(BitcoinProvider).toHaveBeenCalledWith(
        expect.objectContaining({ genericArgs })
      );
      expect(TronProvider).toHaveBeenCalledWith(
        expect.objectContaining({ genericArgs })
      );
    });
  });
});
