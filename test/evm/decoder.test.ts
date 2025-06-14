import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SingleEventDecoder, ContractDecoder } from '../../src/evm/decoder.js';
import { createMockEventLog } from '../setup.js';

// Create mock functions
const mockParseLog = vi.fn();
const mockGetEvent = vi.fn();
const mockParseTransaction = vi.fn();
const mockGetFunction = vi.fn();

// Mock ethers Interface
vi.mock('ethers', () => ({
  Interface: vi.fn().mockImplementation(() => ({
    parseLog: mockParseLog,
    getEvent: mockGetEvent,
    parseTransaction: mockParseTransaction,
    getFunction: mockGetFunction,
  }))
}));

describe('SingleEventDecoder', () => {
  const transferEventABI = {
    type: 'event' as const,
    name: 'Transfer',
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' }
    ]
  };

  let decoder: SingleEventDecoder;

  beforeEach(() => {
    vi.clearAllMocks();
    decoder = new SingleEventDecoder(transferEventABI);
  });

  describe('constructor', () => {
    it('should create decoder with event ABI', () => {
      expect(decoder).toBeInstanceOf(SingleEventDecoder);
    });

    it('should use custom event name', () => {
      const customDecoder = new SingleEventDecoder(transferEventABI, 'CustomTransfer');
      expect(customDecoder).toBeInstanceOf(SingleEventDecoder);
    });
  });

  describe('decode', () => {
    it('should decode event log successfully', () => {
      const eventLog = createMockEventLog();
      const mockParsedLog = {
        name: 'Transfer',
        signature: 'Transfer(address,address,uint256)',
        args: [
          '0x742d35cc6635c0532925a3b8d400beb8ae174c4b',
          '0xa0b86a33e6e6b36c3009a1b4b7b2fec3aab7893a',
          BigInt('100000000')
        ],
        fragment: {
          inputs: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' }
          ]
        }
      };

      mockParseLog.mockReturnValue(mockParsedLog);
      mockGetEvent.mockReturnValue({
        inputs: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' }
        ]
      });

      const result = decoder.decode(eventLog);

      expect(mockParseLog).toHaveBeenCalledWith({
        topics: eventLog.topics,
        data: eventLog.data,
        address: eventLog.address,
        blockNumber: eventLog.blockNumber,
        blockHash: eventLog.blockHash,
        transactionHash: eventLog.transactionHash,
        transactionIndex: eventLog.transactionIndex,
        index: eventLog.logIndex,
        removed: false,
      });

      expect(result).toEqual({
        from: '0x742d35cc6635c0532925a3b8d400beb8ae174c4b',
        to: '0xa0b86a33e6e6b36c3009a1b4b7b2fec3aab7893a',
        value: BigInt('100000000')
      });
    });

    it('should throw error when parsing fails', () => {
      const eventLog = createMockEventLog();
      mockParseLog.mockReturnValue(null);

      expect(() => decoder.decode(eventLog)).toThrow('Failed to parse event log');
    });

    it('should throw error when ethers throws', () => {
      const eventLog = createMockEventLog();
      mockParseLog.mockImplementation(() => {
        throw new Error('Invalid log');
      });

      expect(() => decoder.decode(eventLog)).toThrow('Failed to decode event: Error: Invalid log');
    });
  });
});

describe('ContractDecoder', () => {
  const contractABI = [
    {
      type: 'event' as const,
      name: 'Transfer',
      inputs: [
        { indexed: true, name: 'from', type: 'address' },
        { indexed: true, name: 'to', type: 'address' },
        { indexed: false, name: 'value', type: 'uint256' }
      ]
    },
    {
      type: 'function' as const,
      name: 'transfer',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' }
      ]
    }
  ];

  let decoder: ContractDecoder;

  beforeEach(() => {
    vi.clearAllMocks();
    decoder = new ContractDecoder(contractABI);
  });

  describe('constructor', () => {
    it('should create decoder with contract ABI', () => {
      expect(decoder).toBeInstanceOf(ContractDecoder);
    });
  });

  describe('decodeEvent', () => {
    it('should decode event successfully', () => {
      const eventLog = createMockEventLog();
      const mockParsedLog = {
        name: 'Transfer',
        signature: 'Transfer(address,address,uint256)',
        args: ['0x123...', '0x456...', BigInt('100')],
        fragment: {
          inputs: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' }
          ]
        }
      };

      mockParseLog.mockReturnValue(mockParsedLog);

      const result = decoder.decodeEvent(eventLog);

      expect(result).toEqual({
        eventName: 'Transfer',
        eventSignature: 'Transfer(address,address,uint256)',
        from: '0x123...',
        to: '0x456...',
        value: BigInt('100')
      });
    });

    it('should return null when parsing fails', () => {
      const eventLog = createMockEventLog();
      mockParseLog.mockReturnValue(null);

      const result = decoder.decodeEvent(eventLog);

      expect(result).toBeNull();
    });

    it('should return null when ethers throws', () => {
      const eventLog = createMockEventLog();
      mockParseLog.mockImplementation(() => {
        throw new Error('Invalid log');
      });

      const result = decoder.decodeEvent(eventLog);

      expect(result).toBeNull();
    });
  });

  describe('decodeFunction', () => {
    it('should decode function input successfully', () => {
      const functionInput = '0xa9059cbb000000000000000000000000742d35cc6635c0532925a3b8d400beb8ae174c4b0000000000000000000000000000000000000000000000000000000005f5e100';
      const mockParsedTx = {
        name: 'transfer',
        signature: 'transfer(address,uint256)',
        args: ['0x742d35cc6635c0532925a3b8d400beb8ae174c4b', BigInt('100000000')],
        fragment: {
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' }
          ]
        }
      };

      mockParseTransaction.mockReturnValue(mockParsedTx);

      const result = decoder.decodeFunction(functionInput);

      expect(mockParseTransaction).toHaveBeenCalledWith({ data: functionInput });
      expect(result).toEqual({
        functionName: 'transfer',
        functionSignature: 'transfer(address,uint256)',
        to: '0x742d35cc6635c0532925a3b8d400beb8ae174c4b',
        value: BigInt('100000000')
      });
    });

    it('should return null when parsing fails', () => {
      const functionInput = '0xinvalid';
      mockParseTransaction.mockReturnValue(null);

      const result = decoder.decodeFunction(functionInput);

      expect(result).toBeNull();
    });
  });

  describe('getEventTopic', () => {
    it('should get event topic hash', () => {
      const mockEventFragment = {
        topicHash: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
      };
      mockGetEvent.mockReturnValue(mockEventFragment);

      const result = decoder.getEventTopic('Transfer');

      expect(mockGetEvent).toHaveBeenCalledWith('Transfer');
      expect(result).toBe('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef');
    });

    it('should return null when event not found', () => {
      mockGetEvent.mockReturnValue(null);

      const result = decoder.getEventTopic('NonExistentEvent');

      expect(result).toBeNull();
    });

    it('should return null when ethers throws', () => {
      mockGetEvent.mockImplementation(() => {
        throw new Error('Event not found');
      });

      const result = decoder.getEventTopic('Transfer');

      expect(result).toBeNull();
    });
  });

  describe('getFunctionSelector', () => {
    it('should get function selector', () => {
      const mockFunctionFragment = {
        selector: '0xa9059cbb'
      };
      mockGetFunction.mockReturnValue(mockFunctionFragment);

      const result = decoder.getFunctionSelector('transfer');

      expect(mockGetFunction).toHaveBeenCalledWith('transfer');
      expect(result).toBe('0xa9059cbb');
    });

    it('should return null when function not found', () => {
      mockGetFunction.mockReturnValue(null);

      const result = decoder.getFunctionSelector('nonExistentFunction');

      expect(result).toBeNull();
    });

    it('should return null when ethers throws', () => {
      mockGetFunction.mockImplementation(() => {
        throw new Error('Function not found');
      });

      const result = decoder.getFunctionSelector('transfer');

      expect(result).toBeNull();
    });
  });
});
