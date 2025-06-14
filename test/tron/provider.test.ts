import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TronProvider } from '../../src/tron/provider.js';

// Mock the ClickHouse client
vi.mock('@clickhouse/client-web');

describe('TronProvider', () => {
  let provider: TronProvider;
  let mockQuery: any;

  beforeEach(() => {
    mockQuery = vi.fn();
    vi.spyOn(TronProvider.prototype, 'query' as any).mockImplementation(mockQuery);

    provider = new TronProvider({
      apiToken: 'test-token',
      database: 'tron'
    });
  });

  describe('constructor', () => {
    it('should create provider with default database', () => {
      const provider = new TronProvider({
        apiToken: 'test-token',
        database: 'tron'
      });
      expect(provider).toBeInstanceOf(TronProvider);
    });

    it('should create provider with custom database', () => {
      const provider = new TronProvider({
        apiToken: 'test-token',
        database: 'custom-tron'
      });
      expect(provider).toBeInstanceOf(TronProvider);
    });
  });

  describe('blocks', () => {
    it('should query Tron blocks with default options', async () => {
      const mockBlocks = [{
        number: 50000000,
        hash: '0x123...',
        parentHash: '0x456...',
        timestamp: new Date('2023-08-14T12:00:00.000Z'),
        witnessAddress: 'TLyqzVGLV1srkB7dToTAEqgDSfPtXRJZYH',
        version: 1,
        size: 2000,
        transactionCount: 150
      }];
      mockQuery.mockResolvedValue(mockBlocks);

      const result = await provider.blocks();

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM tron.blocks'),
        { parameters: undefined }
      );
      expect(result).toEqual(mockBlocks);
    });

    it('should query blocks with custom options', async () => {
      const mockBlocks = [];
      mockQuery.mockResolvedValue(mockBlocks);

      await provider.blocks({
        where: 'number > 50000000',
        orderBy: { number: false },
        limit: 25,
        offset: 5
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE number > 50000000'),
        { parameters: undefined }
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY number DESC'),
        { parameters: undefined }
      );
    });

    it('should apply Tron block column formats', async () => {
      const rawBlock = {
        number: '50000000',
        timestamp: '2023-08-14T12:00:00.000Z',
        version: '1',
        size: '2000',
        transactionCount: '150'
      };
      mockQuery.mockResolvedValue([rawBlock]);

      const result = await provider.blocks();

      expect(result[0].number).toBe(50000000);
      expect(result[0].timestamp).toBeInstanceOf(Date);
      expect(result[0].version).toBe(1);
      expect(result[0].size).toBe(2000);
      expect(result[0].transactionCount).toBe(150);
    });
  });

  describe('transactions', () => {
    it('should query Tron transactions with default options', async () => {
      const mockTxs = [{
        hash: '0x123...',
        blockNumber: 50000000,
        blockHash: '0x456...',
        type: 'TransferContract',
        ownerAddress: 'TLyqzVGLV1srkB7dToTAEqgDSfPtXRJZYH',
        toAddress: 'TMuA6YqfCeX8EhbfYEg5y7S4DqzSJireY9',
        amount: BigInt('1000000'),
        energy: BigInt('0'),
        energyUsage: BigInt('0'),
        bandwidth: BigInt('268'),
        bandwidthUsage: BigInt('268'),
        fee: BigInt('0'),
        result: 'SUCCESS'
      }];
      mockQuery.mockResolvedValue(mockTxs);

      const result = await provider.transactions();

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM tron.transactions'),
        { parameters: undefined }
      );
      expect(result).toEqual(mockTxs);
    });

    it('should apply Tron transaction column formats', async () => {
      const rawTx = {
        blockNumber: '50000000',
        amount: '1000000',
        energy: '0',
        energyUsage: '0',
        bandwidth: '268',
        bandwidthUsage: '268',
        fee: '0'
      };
      mockQuery.mockResolvedValue([rawTx]);

      const result = await provider.transactions();

      expect(result[0].blockNumber).toBe(50000000);
      expect(result[0].amount).toBe(BigInt('1000000'));
      expect(result[0].energy).toBe(BigInt('0'));
      expect(result[0].energyUsage).toBe(BigInt('0'));
      expect(result[0].bandwidth).toBe(BigInt('268'));
      expect(result[0].bandwidthUsage).toBe(BigInt('268'));
      expect(result[0].fee).toBe(BigInt('0'));
    });

    it('should handle null values in optional fields', async () => {
      const rawTx = {
        blockNumber: '50000000',
        amount: null,
        energy: '',
        energyUsage: undefined,
        bandwidth: '0',
        bandwidthUsage: '0',
        fee: null
      };
      mockQuery.mockResolvedValue([rawTx]);

      const result = await provider.transactions();

      expect(result[0].blockNumber).toBe(50000000);
      expect(result[0].amount).toBeUndefined();
      expect(result[0].energy).toBeUndefined();
      expect(result[0].energyUsage).toBeUndefined();
      expect(result[0].bandwidth).toBe(BigInt('0'));
      expect(result[0].fee).toBeUndefined();
    });
  });
});
