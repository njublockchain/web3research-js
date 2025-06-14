import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClickHouseProvider } from '../../src/db/provider.js';
import { createClient } from '@clickhouse/client-web';

// Mock the ClickHouse client
vi.mock('@clickhouse/client-web');

describe('ClickHouseProvider', () => {
  let mockClient: any;
  let provider: ClickHouseProvider;

  beforeEach(() => {
    mockClient = {
      query: vi.fn(),
      close: vi.fn(),
    };

    (createClient as any).mockReturnValue(mockClient);

    provider = new ClickHouseProvider({
      apiToken: 'test-token',
      database: 'test-db',
      backend: 'https://test.example.com:443'
    });
  });

  describe('constructor', () => {
    it('should create provider with valid config', () => {
      expect(provider).toBeInstanceOf(ClickHouseProvider);
      expect(createClient).toHaveBeenCalledWith({
        url: 'https://test.example.com:443',
        username: 'test-token',
        password: '',
        database: 'test-db',
        clickhouse_settings: undefined,
      });
    });

    it('should throw error without API token', () => {
      expect(() => new ClickHouseProvider({
        apiToken: '',
        database: 'test-db'
      })).toThrow('api_token is required');
    });

    it('should throw error without database', () => {
      expect(() => new ClickHouseProvider({
        apiToken: 'test-token',
        database: ''
      })).toThrow('database is required');
    });

    it('should use default backends when none specified', () => {
      // Reset mock to test default backend behavior
      vi.clearAllMocks();
      
      new ClickHouseProvider({
        apiToken: 'test-token',
        database: 'test-db'
      });

      // Should try to create client (at least once for default backends)
      expect(createClient).toHaveBeenCalled();
    });

    it('should handle settings and generic args', () => {
      vi.clearAllMocks();
      
      new ClickHouseProvider({
        apiToken: 'test-token',
        database: 'test-db',
        backend: 'https://test.example.com:443',
        settings: { max_memory_usage: '1000000' },
        genericArgs: { timeout: 30000 }
      });

      expect(createClient).toHaveBeenCalledWith({
        url: 'https://test.example.com:443',
        username: 'test-token',
        password: '',
        database: 'test-db',
        clickhouse_settings: { max_memory_usage: '1000000' },
        timeout: 30000,
      });
    });
  });

  describe('query', () => {
    it('should execute query successfully', async () => {
      const mockResult = {
        json: vi.fn().mockResolvedValue([{ id: 1, name: 'test' }])
      };
      mockClient.query.mockResolvedValue(mockResult);

      const result = await provider.query('SELECT * FROM test');

      expect(mockClient.query).toHaveBeenCalledWith({
        query: 'SELECT * FROM test',
        query_params: undefined,
        format: 'JSONEachRow',
      });
      expect(result).toEqual([{ id: 1, name: 'test' }]);
    });

    it('should handle query with parameters', async () => {
      const mockResult = {
        json: vi.fn().mockResolvedValue([{ id: 1 }])
      };
      mockClient.query.mockResolvedValue(mockResult);

      await provider.query('SELECT * FROM test WHERE id = {id:UInt32}', {
        parameters: { id: 1 },
        format: 'JSON'
      });

      expect(mockClient.query).toHaveBeenCalledWith({
        query: 'SELECT * FROM test WHERE id = {id:UInt32}',
        query_params: { id: 1 },
        format: 'JSON',
      });
    });

    it('should handle query errors', async () => {
      const error = new Error('Query failed');
      mockClient.query.mockRejectedValue(error);

      await expect(provider.query('SELECT * FROM test')).rejects.toThrow('Query failed');
    });

    it('should handle non-array JSON results', async () => {
      const mockResult = {
        json: vi.fn().mockResolvedValue({ count: 5 })
      };
      mockClient.query.mockResolvedValue(mockResult);

      const result = await provider.query('SELECT COUNT(*) as count FROM test');

      expect(result).toEqual([{ count: 5 }]);
    });
  });

  describe('queryStream', () => {
    it('should stream query results', async () => {
      const mockResult = {
        json: vi.fn().mockResolvedValue([
          { id: 1, name: 'test1' },
          { id: 2, name: 'test2' }
        ])
      };
      mockClient.query.mockResolvedValue(mockResult);

      const results: any[] = [];
      for await (const item of provider.queryStream('SELECT * FROM test')) {
        results.push(item);
      }

      expect(results).toEqual([
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' }
      ]);
    });

    it('should handle stream with parameters', async () => {
      const mockResult = {
        json: vi.fn().mockResolvedValue([{ id: 1 }])
      };
      mockClient.query.mockResolvedValue(mockResult);

      const results: any[] = [];
      for await (const item of provider.queryStream('SELECT * FROM test WHERE id = {id:UInt32}', {
        parameters: { id: 1 }
      })) {
        results.push(item);
      }

      expect(mockClient.query).toHaveBeenCalledWith({
        query: 'SELECT * FROM test WHERE id = {id:UInt32}',
        query_params: { id: 1 },
        format: 'JSONEachRow',
      });
    });

    it('should handle stream errors', async () => {
      const error = new Error('Stream failed');
      mockClient.query.mockRejectedValue(error);

      const generator = provider.queryStream('SELECT * FROM test');
      await expect(generator.next()).rejects.toThrow('Stream failed');
    });
  });

  describe('close', () => {
    it('should close the client connection', async () => {
      await provider.close();
      expect(mockClient.close).toHaveBeenCalled();
    });
  });
});
