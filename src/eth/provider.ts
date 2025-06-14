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
    const { where, orderBy, limit, offset, parameters } = options;
    
    let query = `SELECT * FROM ${this.database}.blocks`;
    
    if (where) {
      query += ` WHERE ${where}`;
    }
    
    if (orderBy) {
      const orderByClause = Object.entries(orderBy).map(([k, v]) => `${k} ${v ? 'ASC' : 'DESC'}`).join(', ');
      query += ` ORDER BY ${orderByClause}`;
    }
    
    if (limit !== undefined) {
      query += ` LIMIT ${limit}`;
    }
    
    if (offset !== undefined && offset > 0) {
      query += ` OFFSET ${offset}`;
    }

    const rawData = await this.query<BlockData>(query, { parameters });
    return applyColumnFormats(rawData, ETHEREUM_BLOCK_COLUMN_FORMATS);
  }

  async* blocksStream(options: QueryOptions = {}): AsyncGenerator<BlockData, void, unknown> {
    const { where, orderBy, limit, offset, parameters } = options;
    
    let query = `SELECT * FROM ${this.database}.blocks`;
    
    if (where) {
      query += ` WHERE ${where}`;
    }
    
    if (orderBy) {
      const orderByClause = Object.entries(orderBy).map(([k, v]) => `${k} ${v ? 'ASC' : 'DESC'}`).join(', ');
      query += ` ORDER BY ${orderByClause}`;
    }
    
    if (limit !== undefined) {
      query += ` LIMIT ${limit}`;
    }
    
    if (offset !== undefined && offset > 0) {
      query += ` OFFSET ${offset}`;
    }

    for await (const rawRow of this.queryStream<BlockData>(query, { parameters })) {
      const formattedRows = applyColumnFormats([rawRow], ETHEREUM_BLOCK_COLUMN_FORMATS);
      yield formattedRows[0];
    }
  }

  async transactions(options: QueryOptions = {}): Promise<TransactionData[]> {
    const { where, orderBy, limit, offset, parameters } = options;
    
    let query = `SELECT * FROM ${this.database}.transactions`;
    
    if (where) {
      query += ` WHERE ${where}`;
    }
    
    if (orderBy) {
      const orderByClause = Object.entries(orderBy).map(([k, v]) => `${k} ${v ? 'ASC' : 'DESC'}`).join(', ');
      query += ` ORDER BY ${orderByClause}`;
    }
    
    if (limit !== undefined) {
      query += ` LIMIT ${limit}`;
    }
    
    if (offset !== undefined && offset > 0) {
      query += ` OFFSET ${offset}`;
    }

    const rawData = await this.query<TransactionData>(query, { parameters });
    return applyColumnFormats(rawData, ETHEREUM_TRANSACTION_COLUMN_FORMATS);
  }

  async* transactionsStream(options: QueryOptions = {}): AsyncGenerator<TransactionData, void, unknown> {
    const { where, orderBy, limit, offset, parameters } = options;
    
    let query = `SELECT * FROM ${this.database}.transactions`;
    
    if (where) {
      query += ` WHERE ${where}`;
    }
    
    if (orderBy) {
      const orderByClause = Object.entries(orderBy).map(([k, v]) => `${k} ${v ? 'ASC' : 'DESC'}`).join(', ');
      query += ` ORDER BY ${orderByClause}`;
    }
    
    if (limit !== undefined) {
      query += ` LIMIT ${limit}`;
    }
    
    if (offset !== undefined && offset > 0) {
      query += ` OFFSET ${offset}`;
    }

    for await (const rawRow of this.queryStream<TransactionData>(query, { parameters })) {
      const formattedRows = applyColumnFormats([rawRow], ETHEREUM_TRANSACTION_COLUMN_FORMATS);
      yield formattedRows[0];
    }
  }

  async events(options: QueryOptions = {}): Promise<EventData[]> {
    const { where, orderBy, limit, offset, parameters } = options;
    
    let query = `SELECT * FROM ${this.database}.events`;
    
    if (where) {
      query += ` WHERE ${where}`;
    }
    
    if (orderBy) {
      const orderByClause = Object.entries(orderBy).map(([k, v]) => `${k} ${v ? 'ASC' : 'DESC'}`).join(', ');
      query += ` ORDER BY ${orderByClause}`;
    }
    
    if (limit !== undefined) {
      query += ` LIMIT ${limit}`;
    }
    
    if (offset !== undefined && offset > 0) {
      query += ` OFFSET ${offset}`;
    }

    const rawData = await this.query<EventData>(query, { parameters });
    return applyColumnFormats(rawData, ETHEREUM_EVENT_COLUMN_FORMATS);
  }

  async* eventsStream(options: QueryOptions = {}): AsyncGenerator<EventData, void, unknown> {
    const { where, orderBy, limit, offset, parameters } = options;
    
    let query = `SELECT * FROM ${this.database}.events`;
    
    if (where) {
      query += ` WHERE ${where}`;
    }
    
    if (orderBy) {
      const orderByClause = Object.entries(orderBy).map(([k, v]) => `${k} ${v ? 'ASC' : 'DESC'}`).join(', ');
      query += ` ORDER BY ${orderByClause}`;
    }
    
    if (limit !== undefined) {
      query += ` LIMIT ${limit}`;
    }
    
    if (offset !== undefined && offset > 0) {
      query += ` OFFSET ${offset}`;
    }

    for await (const rawRow of this.queryStream<EventData>(query, { parameters })) {
      const formattedRows = applyColumnFormats([rawRow], ETHEREUM_EVENT_COLUMN_FORMATS);
      yield formattedRows[0];
    }
  }

  async traces(options: QueryOptions = {}): Promise<TraceData[]> {
    const { where, orderBy, limit, offset, parameters } = options;
    
    let query = `SELECT * FROM ${this.database}.traces`;
    
    if (where) {
      query += ` WHERE ${where}`;
    }
    
    if (orderBy) {
      const orderByClause = Object.entries(orderBy).map(([k, v]) => `${k} ${v ? 'ASC' : 'DESC'}`).join(', ');
      query += ` ORDER BY ${orderByClause}`;
    }
    
    if (limit !== undefined) {
      query += ` LIMIT ${limit}`;
    }
    
    if (offset !== undefined && offset > 0) {
      query += ` OFFSET ${offset}`;
    }

    const rawData = await this.query<TraceData>(query, { parameters });
    return applyColumnFormats(rawData, ETHEREUM_TRACE_COLUMN_FORMATS);
  }

  async* tracesStream(options: QueryOptions = {}): AsyncGenerator<TraceData, void, unknown> {
    const { where, orderBy, limit, offset, parameters } = options;
    
    let query = `SELECT * FROM ${this.database}.traces`;
    
    if (where) {
      query += ` WHERE ${where}`;
    }
    
    if (orderBy) {
      const orderByClause = Object.entries(orderBy).map(([k, v]) => `${k} ${v ? 'ASC' : 'DESC'}`).join(', ');
      query += ` ORDER BY ${orderByClause}`;
    }
    
    if (limit !== undefined) {
      query += ` LIMIT ${limit}`;
    }
    
    if (offset !== undefined && offset > 0) {
      query += ` OFFSET ${offset}`;
    }

    for await (const rawRow of this.queryStream<TraceData>(query, { parameters })) {
      const formattedRows = applyColumnFormats([rawRow], ETHEREUM_TRACE_COLUMN_FORMATS);
      yield formattedRows[0];
    }
  }
}
