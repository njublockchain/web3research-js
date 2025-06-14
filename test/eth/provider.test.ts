import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EthereumProvider } from '../../src/eth/provider.js';
import { createMockBlockData, createMockTransactionData, createMockEventLog } from '../setup.js';

// Mock the ClickHouse client
vi.mock('@clickhouse/client-web');

describe('EthereumProvider', () => {
  let provider: EthereumProvider;
  let mockQuery: any;
  let mockQueryStream: any;

  beforeEach(() => {
    mockQuery = vi.fn();
    mockQueryStream = vi.fn();

    // Mock the parent class methods
    vi.spyOn(EthereumProvider.prototype, 'query' as any).mockImplementation(mockQuery);
    vi.spyOn(EthereumProvider.prototype, 'queryStream' as any).mockImplementation(mockQueryStream);

    provider = new EthereumProvider({
      apiToken: 'test-token',
      database: 'ethereum'
    });
  });

  describe('constructor', () => {
    it('should create provider with default database', () => {
      const provider = new EthereumProvider({
        apiToken: 'test-token',
        database: 'ethereum'
      });
      expect(provider).toBeInstanceOf(EthereumProvider);
    });

    it('should create provider with custom database', () => {
      const provider = new EthereumProvider({
        apiToken: 'test-token',
        database: 'custom-eth'
      });
      expect(provider).toBeInstanceOf(EthereumProvider);
    });
  });

  describe('blocks', () => {
    it('should query blocks with default options', async () => {
      const mockBlocks = [createMockBlockData()];
      mockQuery.mockResolvedValue(mockBlocks);

      const result = await provider.blocks();

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM ethereum.blocks'),
        { parameters: undefined }
      );
      // Expect formatted data, not raw mock data
      expect(result[0].number).toBe(18000000);
      expect(result[0].timestamp).toBeInstanceOf(Date);
      expect(result[0].gasLimit).toBe(BigInt('30000000'));
      expect(result[0].gasUsed).toBe(BigInt('15000000'));
      expect(result[0].difficulty).toBe(BigInt('0'));
      expect(result[0].totalDifficulty).toBe(BigInt('58750003716598352816469'));
    });

    it('should query blocks with custom options', async () => {
      const mockBlocks = [createMockBlockData()];
      mockQuery.mockResolvedValue(mockBlocks);

      const result = await provider.blocks({
        where: 'number > 18000000',
        orderBy: { number: false },
        limit: 50,
        offset: 10,
        parameters: { minBlock: 18000000 }
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE number > 18000000'),
        { parameters: { minBlock: 18000000 } }
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY number DESC'),
        { parameters: { minBlock: 18000000 } }
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT 50'),
        { parameters: { minBlock: 18000000 } }
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('OFFSET 10'),
        { parameters: { minBlock: 18000000 } }
      );
    });

    it('should apply column formats to blocks', async () => {
      const rawBlock = {
        number: '18000000',
        timestamp: 1692000000,
        gasLimit: '30000000',
        gasUsed: '15000000',
        difficulty: '0',
        totalDifficulty: '58750003716598352816469',
        size: 150000,
        transactionCount: 200
      };
      mockQuery.mockResolvedValue([rawBlock]);

      const result = await provider.blocks();

      expect(result[0].number).toBe(18000000);
      expect(result[0].timestamp).toBeInstanceOf(Date);
      expect(result[0].gasLimit).toBe(BigInt('30000000'));
      expect(result[0].gasUsed).toBe(BigInt('15000000'));
    });
  });

  describe('blocksStream', () => {
    it('should stream blocks', async () => {
      const mockBlocks = [createMockBlockData()];
      
      // Mock async generator
      async function* mockAsyncGenerator() {
        for (const block of mockBlocks) {
          yield block;
        }
      }
      mockQueryStream.mockReturnValue(mockAsyncGenerator());

      const results: any[] = [];
      for await (const block of provider.blocksStream()) {
        results.push(block);
      }

      expect(results).toHaveLength(1);
      expect(mockQueryStream).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM ethereum.blocks'),
        { parameters: undefined }
      );
    });
  });

  describe('transactions', () => {
    it('should query transactions with default options', async () => {
      const rawTxs = [createMockTransactionData()];
      const expectedTxs = [{
        hash: '0x123...',
        blockNumber: 18000000,
        blockHash: '0x456...',
        transactionIndex: 0,
        from: '0x742d35cc6635c0532925a3b8d400beb8ae174c4b',
        to: '0xa0b86a33e6e6b36c3009a1b4b7b2fec3aab7893a',
        value: 1000000000000000000n,
        gas: 21000n,
        gasPrice: 20000000000n,
        nonce: 42,
        input: '0x',
        type: 2,
        status: 1,
        gasUsed: 21000n,
      }];
      mockQuery.mockResolvedValue(rawTxs);

      const result = await provider.transactions();

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM ethereum.transactions'),
        { parameters: undefined }
      );
      expect(result).toEqual(expectedTxs);
    });

    it('should query transactions with WHERE clause', async () => {
      const mockTxs = [createMockTransactionData()];
      mockQuery.mockResolvedValue(mockTxs);

      await provider.transactions({
        where: 'blockNumber = 18000000',
        limit: 200
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE blockNumber = 18000000'),
        { parameters: undefined }
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT 200'),
        { parameters: undefined }
      );
    });

    it('should apply column formats to transactions', async () => {
      const rawTx = {
        blockNumber: '18000000',
        transactionIndex: '42',
        value: '1000000000000000000',
        gas: '21000',
        gasPrice: '20000000000',
        nonce: '5',
        type: '2',
        status: '1',
        gasUsed: '21000'
      };
      mockQuery.mockResolvedValue([rawTx]);

      const result = await provider.transactions();

      expect(result[0].blockNumber).toBe(18000000);
      expect(result[0].transactionIndex).toBe(42);
      expect(result[0].value).toBe(BigInt('1000000000000000000'));
      expect(result[0].gas).toBe(BigInt('21000'));
      expect(result[0].nonce).toBe(5);
    });
  });

  describe('events', () => {
    it('should query events with default options', async () => {
      const mockEvents = [createMockEventLog()];
      mockQuery.mockResolvedValue(mockEvents);

      const result = await provider.events();

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM ethereum.events'),
        { parameters: undefined }
      );
      expect(result).toEqual(mockEvents);
    });

    it('should query events with address filter', async () => {
      const mockEvents = [createMockEventLog()];
      mockQuery.mockResolvedValue(mockEvents);

      await provider.events({
        where: 'address = unhex("dac17f958d2ee523a2206206994597c13d831ec7")',
        orderBy: { blockNumber: false, logIndex: true }
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE address = unhex("dac17f958d2ee523a2206206994597c13d831ec7")'),
        { parameters: undefined }
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY blockNumber DESC, logIndex ASC'),
        { parameters: undefined }
      );
    });

    it('should apply column formats to events', async () => {
      const rawEvent = {
        blockNumber: '18000000',
        transactionIndex: '42',
        logIndex: '7',
        topics: ['0xabc...', '0xdef...']
      };
      mockQuery.mockResolvedValue([rawEvent]);

      const result = await provider.events();

      expect(result[0].blockNumber).toBe(18000000);
      expect(result[0].transactionIndex).toBe(42);
      expect(result[0].logIndex).toBe(7);
      expect(result[0].topics).toEqual(['0xabc...', '0xdef...']);
    });
  });

  describe('traces', () => {
    it('should query traces with default options', async () => {
      const mockTraces = [{
        blockNumber: 18000000,
        transactionHash: '0x123...',
        traceAddress: [0, 1],
        subtraces: 1,
        type: 'call'
      }];
      mockQuery.mockResolvedValue(mockTraces);

      const result = await provider.traces();

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM ethereum.traces'),
        { parameters: undefined }
      );
      expect(result).toEqual(mockTraces);
    });

    it('should apply column formats to traces', async () => {
      const rawTrace = {
        blockNumber: '18000000',
        traceAddress: ['0', '1', '2'],
        subtraces: '3',
        value: '1000000000000000000',
        gas: '21000',
        gasUsed: '21000'
      };
      mockQuery.mockResolvedValue([rawTrace]);

      const result = await provider.traces();

      expect(result[0].blockNumber).toBe(18000000);
      expect(result[0].traceAddress).toEqual([0, 1, 2]);
      expect(result[0].subtraces).toBe(3);
      expect(result[0].value).toBe(BigInt('1000000000000000000'));
      expect(result[0].gas).toBe(BigInt('21000'));
    });
  });

  describe('query building', () => {
    it('should build query without WHERE clause', async () => {
      mockQuery.mockResolvedValue([]);

      await provider.blocks({});

      expect(mockQuery).toHaveBeenCalledWith(
        expect.not.stringContaining('WHERE'),
        { parameters: undefined }
      );
    });

    it('should build query without ORDER BY clause', async () => {
      mockQuery.mockResolvedValue([]);

      await provider.blocks({ orderBy: undefined });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.not.stringContaining('ORDER BY'),
        { parameters: undefined }
      );
    });

    it('should build query without LIMIT clause', async () => {
      mockQuery.mockResolvedValue([]);

      await provider.blocks({ limit: undefined });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.not.stringContaining('LIMIT'),
        { parameters: undefined }
      );
    });

    it('should build query without OFFSET clause', async () => {
      mockQuery.mockResolvedValue([]);

      await provider.blocks({ offset: 0 });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.not.stringContaining('OFFSET'),
        { parameters: undefined }
      );
    });
  });
});
