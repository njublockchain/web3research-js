import { ClickHouseProvider, ClickHouseConfig } from '../db/provider.js';
import { QueryOptions } from '../common/types.js';

export interface TronBlockData {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: Date;
  witnessAddress: string;
  version: number;
  size: number;
  transactionCount: number;
  [key: string]: any;
}

export interface TronTransactionData {
  hash: string;
  blockNumber: number;
  blockHash: string;
  type: string;
  ownerAddress: string;
  toAddress?: string;
  amount?: bigint;
  energy?: bigint;
  energyUsage?: bigint;
  bandwidth?: bigint;
  bandwidthUsage?: bigint;
  fee?: bigint;
  result: string;
  [key: string]: any;
}

export const TRON_BLOCK_COLUMN_FORMATS = {
  number: (value: any) => parseInt(value),
  timestamp: (value: any) => new Date(value),
  version: (value: any) => parseInt(value),
  size: (value: any) => parseInt(value),
  transactionCount: (value: any) => parseInt(value),
};

export const TRON_TRANSACTION_COLUMN_FORMATS = {
  blockNumber: (value: any) => parseInt(value),
  amount: (value: any) => value ? BigInt(value) : undefined,
  energy: (value: any) => value ? BigInt(value) : undefined,
  energyUsage: (value: any) => value ? BigInt(value) : undefined,
  bandwidth: (value: any) => value ? BigInt(value) : undefined,
  bandwidthUsage: (value: any) => value ? BigInt(value) : undefined,
  fee: (value: any) => value ? BigInt(value) : undefined,
};

export class TronProvider extends ClickHouseProvider {
  constructor(config: ClickHouseConfig & { database?: string }) {
    super({
      ...config,
      database: config.database || 'tron'
    });
  }

  async blocks(options: QueryOptions = {}): Promise<TronBlockData[]> {
    const { where, orderBy = { number: true }, limit = 100, offset = 0, parameters } = options;
    
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

    const rawData = await this.query<TronBlockData>(query, { parameters });
    return this.applyFormats(rawData, TRON_BLOCK_COLUMN_FORMATS);
  }

  async transactions(options: QueryOptions = {}): Promise<TronTransactionData[]> {
    const { where, orderBy = { blockNumber: true }, limit = 100, offset = 0, parameters } = options;
    
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

    const rawData = await this.query<TronTransactionData>(query, { parameters });
    return this.applyFormats(rawData, TRON_TRANSACTION_COLUMN_FORMATS);
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
