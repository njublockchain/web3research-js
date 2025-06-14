import { describe, it, expect } from 'vitest';
import { 
  applyColumnFormats,
  groupEventTopics,
  ETHEREUM_BLOCK_COLUMN_FORMATS,
  ETHEREUM_TRANSACTION_COLUMN_FORMATS,
  ETHEREUM_EVENT_COLUMN_FORMATS,
  ETHEREUM_TRACE_COLUMN_FORMATS
} from '../../src/common/formats.js';

describe('Column Formats', () => {
  describe('applyColumnFormats', () => {
    it('should apply formats to data correctly', () => {
      const data = [
        { number: '18000000', timestamp: 1692000000, gasLimit: '30000000' },
        { number: '18000001', timestamp: 1692000012, gasLimit: '30000000' }
      ];

      const formatted = applyColumnFormats(data, ETHEREUM_BLOCK_COLUMN_FORMATS);

      expect(formatted[0].number).toBe(18000000);
      expect(formatted[0].timestamp).toBeInstanceOf(Date);
      expect(formatted[0].gasLimit).toBe(BigInt('30000000'));
      expect(formatted[1].number).toBe(18000001);
    });

    it('should handle missing columns gracefully', () => {
      const data = [{ other: 'value' }];
      const formats = { number: (v: any) => parseInt(v) };

      const formatted = applyColumnFormats(data, formats);

      expect(formatted[0]).toEqual({ other: 'value' });
    });

    it('should handle formatting errors gracefully', () => {
      const data = [{ number: 'invalid' }];
      const formats = { number: (v: any) => parseInt(v) };

      // Should not throw, but log warning
      const formatted = applyColumnFormats(data, formats);

      expect(formatted[0].number).toBeNaN();
    });
  });

  describe('groupEventTopics', () => {
    it('should group topics correctly', () => {
      const topics = [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x000000000000000000000000742d35cc6635c0532925a3b8d400beb8ae174c4b',
        '0x000000000000000000000000a0b86a33e6e6b36c3009a1b4b7b2fec3aab7893a'
      ];

      const grouped = groupEventTopics(topics);

      expect(grouped.topic0).toBe(topics[0]);
      expect(grouped.topic1).toBe(topics[1]);
      expect(grouped.topic2).toBe(topics[2]);
      expect(grouped.topic3).toBeUndefined();
    });

    it('should handle empty topics array', () => {
      const grouped = groupEventTopics([]);

      expect(grouped.topic0).toBeUndefined();
      expect(grouped.topic1).toBeUndefined();
      expect(grouped.topic2).toBeUndefined();
      expect(grouped.topic3).toBeUndefined();
    });
  });
});

describe('Ethereum Block Column Formats', () => {
  it('should format number correctly', () => {
    expect(ETHEREUM_BLOCK_COLUMN_FORMATS.number('18000000')).toBe(18000000);
    expect(ETHEREUM_BLOCK_COLUMN_FORMATS.number(18000000)).toBe(18000000);
  });

  it('should format timestamp correctly', () => {
    const timestamp = ETHEREUM_BLOCK_COLUMN_FORMATS.timestamp(1692000000);
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.getTime()).toBe(1692000000 * 1000);
  });

  it('should format gas values correctly', () => {
    expect(ETHEREUM_BLOCK_COLUMN_FORMATS.gasLimit('30000000')).toBe(BigInt('30000000'));
    expect(ETHEREUM_BLOCK_COLUMN_FORMATS.gasUsed('15000000')).toBe(BigInt('15000000'));
  });

  it('should format baseFeePerGas correctly', () => {
    expect(ETHEREUM_BLOCK_COLUMN_FORMATS.baseFeePerGas('20000000000')).toBe(BigInt('20000000000'));
    expect(ETHEREUM_BLOCK_COLUMN_FORMATS.baseFeePerGas(null)).toBeUndefined();
    expect(ETHEREUM_BLOCK_COLUMN_FORMATS.baseFeePerGas('')).toBeUndefined();
  });

  it('should format difficulty correctly', () => {
    expect(ETHEREUM_BLOCK_COLUMN_FORMATS.difficulty('1000000')).toBe(BigInt('1000000'));
    expect(ETHEREUM_BLOCK_COLUMN_FORMATS.totalDifficulty('58750003716598352816469')).toBe(BigInt('58750003716598352816469'));
  });
});

describe('Ethereum Transaction Column Formats', () => {
  it('should format transaction fields correctly', () => {
    expect(ETHEREUM_TRANSACTION_COLUMN_FORMATS.blockNumber('18000000')).toBe(18000000);
    expect(ETHEREUM_TRANSACTION_COLUMN_FORMATS.transactionIndex('42')).toBe(42);
    expect(ETHEREUM_TRANSACTION_COLUMN_FORMATS.value('1000000000000000000')).toBe(BigInt('1000000000000000000'));
    expect(ETHEREUM_TRANSACTION_COLUMN_FORMATS.gas('21000')).toBe(BigInt('21000'));
    expect(ETHEREUM_TRANSACTION_COLUMN_FORMATS.gasPrice('20000000000')).toBe(BigInt('20000000000'));
    expect(ETHEREUM_TRANSACTION_COLUMN_FORMATS.nonce('42')).toBe(42);
    expect(ETHEREUM_TRANSACTION_COLUMN_FORMATS.type('2')).toBe(2);
    expect(ETHEREUM_TRANSACTION_COLUMN_FORMATS.status('1')).toBe(1);
    expect(ETHEREUM_TRANSACTION_COLUMN_FORMATS.gasUsed('21000')).toBe(BigInt('21000'));
  });

  it('should handle optional EIP-1559 fields', () => {
    expect(ETHEREUM_TRANSACTION_COLUMN_FORMATS.maxFeePerGas('30000000000')).toBe(BigInt('30000000000'));
    expect(ETHEREUM_TRANSACTION_COLUMN_FORMATS.maxFeePerGas(null)).toBeUndefined();
    expect(ETHEREUM_TRANSACTION_COLUMN_FORMATS.maxPriorityFeePerGas('2000000000')).toBe(BigInt('2000000000'));
    expect(ETHEREUM_TRANSACTION_COLUMN_FORMATS.maxPriorityFeePerGas('')).toBeUndefined();
  });
});

describe('Ethereum Event Column Formats', () => {
  it('should format event fields correctly', () => {
    expect(ETHEREUM_EVENT_COLUMN_FORMATS.blockNumber('18000000')).toBe(18000000);
    expect(ETHEREUM_EVENT_COLUMN_FORMATS.transactionIndex('42')).toBe(42);
    expect(ETHEREUM_EVENT_COLUMN_FORMATS.logIndex('7')).toBe(7);
  });

  it('should format topics correctly', () => {
    const topics = ['0xabc...', '0xdef...'];
    expect(ETHEREUM_EVENT_COLUMN_FORMATS.topics(topics)).toEqual(topics);
    expect(ETHEREUM_EVENT_COLUMN_FORMATS.topics('not-array')).toEqual([]);
  });
});

describe('Ethereum Trace Column Formats', () => {
  it('should format trace fields correctly', () => {
    expect(ETHEREUM_TRACE_COLUMN_FORMATS.blockNumber('18000000')).toBe(18000000);
    expect(ETHEREUM_TRACE_COLUMN_FORMATS.subtraces('2')).toBe(2);
  });

  it('should format trace address correctly', () => {
    const traceAddress = ['0', '1', '2'];
    expect(ETHEREUM_TRACE_COLUMN_FORMATS.traceAddress(traceAddress)).toEqual([0, 1, 2]);
    expect(ETHEREUM_TRACE_COLUMN_FORMATS.traceAddress('not-array')).toEqual([]);
  });

  it('should handle optional trace fields', () => {
    expect(ETHEREUM_TRACE_COLUMN_FORMATS.value('1000000000000000000')).toBe(BigInt('1000000000000000000'));
    expect(ETHEREUM_TRACE_COLUMN_FORMATS.value(null)).toBeUndefined();
    expect(ETHEREUM_TRACE_COLUMN_FORMATS.gas('21000')).toBe(BigInt('21000'));
    expect(ETHEREUM_TRACE_COLUMN_FORMATS.gas('')).toBeUndefined();
    expect(ETHEREUM_TRACE_COLUMN_FORMATS.gasUsed('21000')).toBe(BigInt('21000'));
    expect(ETHEREUM_TRACE_COLUMN_FORMATS.gasUsed(undefined)).toBeUndefined();
  });
});
