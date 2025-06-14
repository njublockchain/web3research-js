// Test setup file
import { vi, beforeEach } from 'vitest';

// Mock global fetch for tests
global.fetch = vi.fn();

// Mock console methods to reduce noise in tests
vi.spyOn(console, 'debug').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});

// Setup test environment
beforeEach(() => {
  vi.clearAllMocks();
});

// Mock ClickHouse client for testing
vi.mock('@clickhouse/client-web', () => ({
  createClient: vi.fn(() => ({
    query: vi.fn(),
    close: vi.fn(),
  })),
}));

// Test utilities
export const createMockClickHouseResponse = (data: any[]) => ({
  json: vi.fn().mockResolvedValue(data),
  stream: vi.fn(),
});

export const createMockApiToken = () => 'test-api-token-123';

export const createMockEventLog = () => ({
  address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  blockNumber: 18000000,
  blockHash: '0x123...',
  transactionHash: '0x456...',
  transactionIndex: 0,
  logIndex: 0,
  topics: [
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '0x000000000000000000000000742d35cc6635c0532925a3b8d400beb8ae174c4b',
    '0x000000000000000000000000a0b86a33e6e6b36c3009a1b4b7b2fec3aab7893a'
  ],
  data: '0x0000000000000000000000000000000000000000000000000000000005f5e100',
});

export const createMockBlockData = () => ({
  number: 18000000,
  hash: '0x123...',
  parentHash: '0x456...',
  timestamp: '1692000000',
  gasLimit: '30000000',
  gasUsed: '15000000',
  miner: '0x789...',
  difficulty: '0',
  totalDifficulty: '58750003716598352816469',
  size: 150000,
  transactionCount: 200,
});

export const createMockTransactionData = () => ({
  hash: '0x123...',
  blockNumber: '18000000',
  blockHash: '0x456...',
  transactionIndex: '0',
  from: '0x742d35cc6635c0532925a3b8d400beb8ae174c4b',
  to: '0xa0b86a33e6e6b36c3009a1b4b7b2fec3aab7893a',
  value: '1000000000000000000',
  gas: '21000',
  gasPrice: '20000000000',
  nonce: '42',
  input: '0x',
  type: '2',
  status: '1',
  gasUsed: '21000',
});
