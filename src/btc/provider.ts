import { ClickHouseProvider, ClickHouseConfig } from '../db/provider.js';
import { QueryOptions } from '../common/types.js';

export interface BitcoinBlockData {
  height: number;
  hash: string;
  previousBlockHash: string;
  timestamp: Date;
  size: number;
  weight: number;
  version: number;
  merkleRoot: string;
  nonce: number;
  bits: string;
  difficulty: number;
  transactionCount: number;
  [key: string]: any;
}

export interface BitcoinTransactionData {
  hash: string;
  blockHeight: number;
  blockHash: string;
  version: number;
  size: number;
  weight: number;
  lockTime: number;
  inputCount: number;
  outputCount: number;
  fee: number;
  [key: string]: any;
}

export const BITCOIN_BLOCK_COLUMN_FORMATS = {
  height: (value: any) => parseInt(value),
  timestamp: (value: any) => new Date(value * 1000),
  size: (value: any) => parseInt(value),
  weight: (value: any) => parseInt(value),
  version: (value: any) => parseInt(value),
  nonce: (value: any) => parseInt(value),
  difficulty: (value: any) => parseFloat(value),
  transactionCount: (value: any) => parseInt(value),
};

export const BITCOIN_TRANSACTION_COLUMN_FORMATS = {
  blockHeight: (value: any) => parseInt(value),
  version: (value: any) => parseInt(value),
  size: (value: any) => parseInt(value),
  weight: (value: any) => parseInt(value),
  lockTime: (value: any) => parseInt(value),
  inputCount: (value: any) => parseInt(value),
  outputCount: (value: any) => parseInt(value),
  fee: (value: any) => parseInt(value),
};

export class BitcoinProvider extends ClickHouseProvider {
  constructor(config: ClickHouseConfig & { database?: string }) {
    super({
      ...config,
      database: config.database || 'bitcoin'
    });
  }

  async blocks(options: QueryOptions = {}): Promise<BitcoinBlockData[]> {
    const { where, orderBy = { height: true }, limit = 100, offset = 0, parameters } = options;
    
    const wherePhrase = where ? `WHERE ${where}` : '';
    const orderByPhrase = orderBy 
      ? `ORDER BY ${Object.entries(orderBy).map(([k, v]) => `${k} ${v ? 'ASC' : 'DESC'}`).join(', ')}`
      : '';
    const limitPhrase = limit ? `LIMIT ${limit}` : '';
    const offsetPhrase = offset ? `OFFSET ${offset}` : '';

    const query = `
      SELECT * 
      FROM ${this.database}.blocks 
      ${wherePhrase} 
      ${orderByPhrase} 
      ${limitPhrase}
      ${offsetPhrase}
    `;

    const rawData = await this.query<BitcoinBlockData>(query, { parameters });
    return this.applyFormats(rawData, BITCOIN_BLOCK_COLUMN_FORMATS);
  }

  async transactions(options: QueryOptions = {}): Promise<BitcoinTransactionData[]> {
    const { where, orderBy = { blockHeight: true }, limit = 100, offset = 0, parameters } = options;
    
    const wherePhrase = where ? `WHERE ${where}` : '';
    const orderByPhrase = orderBy 
      ? `ORDER BY ${Object.entries(orderBy).map(([k, v]) => `${k} ${v ? 'ASC' : 'DESC'}`).join(', ')}`
      : '';
    const limitPhrase = limit ? `LIMIT ${limit}` : '';
    const offsetPhrase = offset ? `OFFSET ${offset}` : '';

    const query = `
      SELECT * 
      FROM ${this.database}.transactions 
      ${wherePhrase} 
      ${orderByPhrase} 
      ${limitPhrase}
      ${offsetPhrase}
    `;

    const rawData = await this.query<BitcoinTransactionData>(query, { parameters });
    return this.applyFormats(rawData, BITCOIN_TRANSACTION_COLUMN_FORMATS);
  }

  private applyFormats<T>(data: T[], formats: Record<string, (value: any) => any>): T[] {
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
}
