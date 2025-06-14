import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BitcoinProvider } from '../../src/btc/provider.js';

// Mock the ClickHouse client
vi.mock('@clickhouse/client-web');

describe('BitcoinProvider', () => {
  let provider: BitcoinProvider;
  let mockQuery: any;

  beforeEach(() => {
    mockQuery = vi.fn();
    vi.spyOn(BitcoinProvider.prototype, 'query' as any).mockImplementation(mockQuery);

    provider = new BitcoinProvider({
      apiToken: 'test-token',
      database: 'bitcoin'
    });
  });

  describe('constructor', () => {
    it('should create provider with default database', () => {
      const provider = new BitcoinProvider({
        apiToken: 'test-token',
        database: 'bitcoin'
      });
      expect(provider).toBeInstanceOf(BitcoinProvider);
    });

    it('should create provider with custom database', () => {
      const provider = new BitcoinProvider({
        apiToken: 'test-token',
        database: 'custom-btc'
      });
      expect(provider).toBeInstanceOf(BitcoinProvider);
    });
  });

  describe('blocks', () => {
    it('should query Bitcoin blocks with default options', async () => {
      const mockBlocks = [{
        height: 800000,
        hash: '0x123...',
        previousBlockHash: '0x456...',
        timestamp: '1692000000',
        size: 1500000,
        weight: 4000000,
        version: 1,
        merkleRoot: '0x789...',
        nonce: 12345,
        bits: '386469955',
        difficulty: '31.25T',
        transactionCount: 2500
      }];
      mockQuery.mockResolvedValue(mockBlocks);

      const result = await provider.blocks();

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM bitcoin.blocks'),
        { parameters: undefined }
      );
      expect(result).toEqual(mockBlocks);
    });

    it('should query blocks with custom options', async () => {
      const mockBlocks = [];
      mockQuery.mockResolvedValue(mockBlocks);

      await provider.blocks({
        where: 'height > 800000',
        orderBy: { height: false },
        limit: 50,
        offset: 10
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE height > 800000'),
        { parameters: undefined }
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY height DESC'),
        { parameters: undefined }
      );
    });

    it('should apply Bitcoin block column formats', async () => {
      const rawBlock = {
        height: '800000',
        timestamp: 1692000000,
        size: '1500000',
        weight: '4000000',
        version: '1',
        nonce: '12345',
        difficulty: '31.25',
        transactionCount: '2500'
      };
      mockQuery.mockResolvedValue([rawBlock]);

      const result = await provider.blocks();

      expect(result[0].height).toBe(800000);
      expect(result[0].timestamp).toBeInstanceOf(Date);
      expect(result[0].size).toBe(1500000);
      expect(result[0].weight).toBe(4000000);
      expect(result[0].version).toBe(1);
      expect(result[0].nonce).toBe(12345);
      expect(result[0].difficulty).toBe(31.25);
      expect(result[0].transactionCount).toBe(2500);
    });
  });

  describe('transactions', () => {
    it('should query Bitcoin transactions with default options', async () => {
      const mockTxs = [{
        hash: '0x123...',
        blockHeight: 800000,
        blockHash: '0x456...',
        version: 1,
        size: 250,
        weight: 1000,
        lockTime: 0,
        inputCount: 1,
        outputCount: 2,
        fee: 10000
      }];
      mockQuery.mockResolvedValue(mockTxs);

      const result = await provider.transactions();

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM bitcoin.transactions'),
        { parameters: undefined }
      );
      expect(result).toEqual(mockTxs);
    });

    it('should apply Bitcoin transaction column formats', async () => {
      const rawTx = {
        blockHeight: '800000',
        version: '1',
        size: '250',
        weight: '1000',
        lockTime: '0',
        inputCount: '1',
        outputCount: '2',
        fee: '10000'
      };
      mockQuery.mockResolvedValue([rawTx]);

      const result = await provider.transactions();

      expect(result[0].blockHeight).toBe(800000);
      expect(result[0].version).toBe(1);
      expect(result[0].size).toBe(250);
      expect(result[0].weight).toBe(1000);
      expect(result[0].lockTime).toBe(0);
      expect(result[0].inputCount).toBe(1);
      expect(result[0].outputCount).toBe(2);
      expect(result[0].fee).toBe(10000);
    });
  });
});
