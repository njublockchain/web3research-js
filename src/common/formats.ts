export interface ColumnFormat {
  [columnName: string]: (value: any) => any;
}

export const ETHEREUM_BLOCK_COLUMN_FORMATS: ColumnFormat = {
  number: (value: any) => parseInt(value),
  timestamp: (value: any) => new Date(value * 1000),
  gasLimit: (value: any) => BigInt(value),
  gasUsed: (value: any) => BigInt(value),
  baseFeePerGas: (value: any) => value ? BigInt(value) : undefined,
  difficulty: (value: any) => BigInt(value),
  totalDifficulty: (value: any) => BigInt(value),
  size: (value: any) => parseInt(value),
  transactionCount: (value: any) => parseInt(value),
};

export const ETHEREUM_TRANSACTION_COLUMN_FORMATS: ColumnFormat = {
  blockNumber: (value: any) => parseInt(value),
  transactionIndex: (value: any) => parseInt(value),
  value: (value: any) => BigInt(value),
  gas: (value: any) => BigInt(value),
  gasPrice: (value: any) => BigInt(value),
  maxFeePerGas: (value: any) => value ? BigInt(value) : undefined,
  maxPriorityFeePerGas: (value: any) => value ? BigInt(value) : undefined,
  nonce: (value: any) => parseInt(value),
  type: (value: any) => parseInt(value),
  status: (value: any) => parseInt(value),
  gasUsed: (value: any) => BigInt(value),
};

export const ETHEREUM_EVENT_COLUMN_FORMATS: ColumnFormat = {
  blockNumber: (value: any) => parseInt(value),
  transactionIndex: (value: any) => parseInt(value),
  logIndex: (value: any) => parseInt(value),
  topics: (value: any) => Array.isArray(value) ? value : [],
};

export const ETHEREUM_TRACE_COLUMN_FORMATS: ColumnFormat = {
  blockNumber: (value: any) => parseInt(value),
  traceAddress: (value: any) => Array.isArray(value) ? value.map((v: any) => parseInt(v)) : [],
  subtraces: (value: any) => parseInt(value),
  value: (value: any) => value ? BigInt(value) : undefined,
  gas: (value: any) => value ? BigInt(value) : undefined,
  gasUsed: (value: any) => value ? BigInt(value) : undefined,
};

export const QUERY_FORMATS = {
  // Add any query-level formatting if needed
};

export function applyColumnFormats<T>(data: T[], formats: ColumnFormat): T[] {
  return data.map(row => {
    const formattedRow = { ...row } as any;
    
    for (const [columnName, formatter] of Object.entries(formats)) {
      if (columnName in formattedRow) {
        try {
          formattedRow[columnName] = formatter(formattedRow[columnName]);
        } catch (error) {
          console.warn(`Failed to format column ${columnName}:`, error);
        }
      }
    }
    
    return formattedRow;
  });
}

export function groupEventTopics(topics: string[]): { topic0?: string; topic1?: string; topic2?: string; topic3?: string } {
  return {
    topic0: topics[0],
    topic1: topics[1],
    topic2: topics[2], 
    topic3: topics[3],
  };
}
