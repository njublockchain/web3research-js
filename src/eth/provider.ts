import { ClickHouseProvider, ClickHouseConfig } from '../db/provider.js';
import { QueryOptions, BlockData, TransactionData, EventData, TraceData } from '../common/types.js';
import { 
  ETHEREUM_BLOCK_COLUMN_FORMATS,
  ETHEREUM_TRANSACTION_COLUMN_FORMATS,
  ETHEREUM_EVENT_COLUMN_FORMATS,
  ETHEREUM_TRACE_COLUMN_FORMATS,
  applyColumnFormats
} from '../common/formats.js';

export class EthereumProvider extends ClickHouseProvider {
  constructor(config: ClickHouseConfig & { database?: string }) {
    super({
      ...config,
      database: config.database || 'ethereum'
    });
  }

  async blocks(options: QueryOptions = {}): Promise<BlockData[]> {
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

    const rawData = await this.query<BlockData>(query, { parameters });
    return applyColumnFormats(rawData, ETHEREUM_BLOCK_COLUMN_FORMATS);
  }

  async* blocksStream(options: QueryOptions = {}): AsyncGenerator<BlockData, void, unknown> {
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

    for await (const rawRow of this.queryStream<BlockData>(query, { parameters })) {
      const formattedRows = applyColumnFormats([rawRow], ETHEREUM_BLOCK_COLUMN_FORMATS);
      yield formattedRows[0];
    }
  }

  async transactions(options: QueryOptions = {}): Promise<TransactionData[]> {
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

    const rawData = await this.query<TransactionData>(query, { parameters });
    return applyColumnFormats(rawData, ETHEREUM_TRANSACTION_COLUMN_FORMATS);
  }

  async* transactionsStream(options: QueryOptions = {}): AsyncGenerator<TransactionData, void, unknown> {
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

    for await (const rawRow of this.queryStream<TransactionData>(query, { parameters })) {
      const formattedRows = applyColumnFormats([rawRow], ETHEREUM_TRANSACTION_COLUMN_FORMATS);
      yield formattedRows[0];
    }
  }

  async events(options: QueryOptions = {}): Promise<EventData[]> {
    const { where, orderBy = { blockNumber: true }, limit = 100, offset = 0, parameters } = options;
    
    const wherePhrase = where ? `WHERE ${where}` : '';
    const orderByPhrase = orderBy 
      ? `ORDER BY ${Object.entries(orderBy).map(([k, v]) => `${k} ${v ? 'ASC' : 'DESC'}`).join(', ')}`
      : '';
    const limitPhrase = limit ? `LIMIT ${limit}` : '';
    const offsetPhrase = offset ? `OFFSET ${offset}` : '';

    const query = `
      SELECT * 
      FROM ${this.database}.events 
      ${wherePhrase} 
      ${orderByPhrase} 
      ${limitPhrase}
      ${offsetPhrase}
    `;

    const rawData = await this.query<EventData>(query, { parameters });
    return applyColumnFormats(rawData, ETHEREUM_EVENT_COLUMN_FORMATS);
  }

  async* eventsStream(options: QueryOptions = {}): AsyncGenerator<EventData, void, unknown> {
    const { where, orderBy = { blockNumber: true }, limit = 100, offset = 0, parameters } = options;
    
    const wherePhrase = where ? `WHERE ${where}` : '';
    const orderByPhrase = orderBy 
      ? `ORDER BY ${Object.entries(orderBy).map(([k, v]) => `${k} ${v ? 'ASC' : 'DESC'}`).join(', ')}`
      : '';
    const limitPhrase = limit ? `LIMIT ${limit}` : '';
    const offsetPhrase = offset ? `OFFSET ${offset}` : '';

    const query = `
      SELECT * 
      FROM ${this.database}.events 
      ${wherePhrase} 
      ${orderByPhrase} 
      ${limitPhrase}
      ${offsetPhrase}
    `;

    for await (const rawRow of this.queryStream<EventData>(query, { parameters })) {
      const formattedRows = applyColumnFormats([rawRow], ETHEREUM_EVENT_COLUMN_FORMATS);
      yield formattedRows[0];
    }
  }

  async traces(options: QueryOptions = {}): Promise<TraceData[]> {
    const { where, orderBy = { blockNumber: true }, limit = 100, offset = 0, parameters } = options;
    
    const wherePhrase = where ? `WHERE ${where}` : '';
    const orderByPhrase = orderBy 
      ? `ORDER BY ${Object.entries(orderBy).map(([k, v]) => `${k} ${v ? 'ASC' : 'DESC'}`).join(', ')}`
      : '';
    const limitPhrase = limit ? `LIMIT ${limit}` : '';
    const offsetPhrase = offset ? `OFFSET ${offset}` : '';

    const query = `
      SELECT * 
      FROM ${this.database}.traces 
      ${wherePhrase} 
      ${orderByPhrase} 
      ${limitPhrase}
      ${offsetPhrase}
    `;

    const rawData = await this.query<TraceData>(query, { parameters });
    return applyColumnFormats(rawData, ETHEREUM_TRACE_COLUMN_FORMATS);
  }

  async* tracesStream(options: QueryOptions = {}): AsyncGenerator<TraceData, void, unknown> {
    const { where, orderBy = { blockNumber: true }, limit = 100, offset = 0, parameters } = options;
    
    const wherePhrase = where ? `WHERE ${where}` : '';
    const orderByPhrase = orderBy 
      ? `ORDER BY ${Object.entries(orderBy).map(([k, v]) => `${k} ${v ? 'ASC' : 'DESC'}`).join(', ')}`
      : '';
    const limitPhrase = limit ? `LIMIT ${limit}` : '';
    const offsetPhrase = offset ? `OFFSET ${offset}` : '';

    const query = `
      SELECT * 
      FROM ${this.database}.traces 
      ${wherePhrase} 
      ${orderByPhrase} 
      ${limitPhrase}
      ${offsetPhrase}
    `;

    for await (const rawRow of this.queryStream<TraceData>(query, { parameters })) {
      const formattedRows = applyColumnFormats([rawRow], ETHEREUM_TRACE_COLUMN_FORMATS);
      yield formattedRows[0];
    }
  }
}
