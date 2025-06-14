import { createClient, ClickHouseClient, DataFormat } from '@clickhouse/client-web';

export interface ClickHouseConfig {
  apiToken: string;
  backend?: string;
  database: string;
  settings?: Record<string, any>;
  genericArgs?: Record<string, any>;
}

const DEFAULT_BACKEND_URIS = [
  'https://s1.web3resear.ch:443',
  'https://s2.web3resear.ch:443',
  'https://cn-s1.web3resear.ch:19443',
  'https://cn-s2.web3resear.ch:19443',
];

export class ClickHouseProvider {
  protected client!: ClickHouseClient;
  protected apiToken: string;
  protected database: string;

  constructor(config: ClickHouseConfig) {
    this.apiToken = config.apiToken;
    this.database = config.database;

    if (!config.apiToken) {
      throw new Error('api_token is required');
    }
    if (!config.database) {
      throw new Error('database is required');
    }

    if (config.backend) {
      // Use specified backend
      this.client = this.createClientForBackend(config.backend, config);
    } else {
      // Try default backends
      let connected = false;
      for (const backendUri of DEFAULT_BACKEND_URIS) {
        try {
          this.client = this.createClientForBackend(backendUri, config);
          connected = true;
          break;
        } catch (error) {
          console.debug(`Failed to connect to ${backendUri}:`, error);
        }
      }
      if (!connected) {
        throw new Error('Failed to connect to any backend');
      }
    }
  }

  private createClientForBackend(backendUri: string, config: ClickHouseConfig): ClickHouseClient {
    return createClient({
      url: backendUri,
      username: config.apiToken,
      password: '', // password is empty
      database: config.database,
      clickhouse_settings: config.settings,
      ...config.genericArgs,
    });
  }

  async query<T = any>(
    query: string,
    options?: {
      parameters?: Record<string, any>;
      format?: DataFormat;
    }
  ): Promise<T[]> {
    try {
      const result = await this.client.query({
        query,
        query_params: options?.parameters,
        format: options?.format || 'JSONEachRow',
      });

      const jsonResult = await result.json<T>();
      return Array.isArray(jsonResult) ? jsonResult : [jsonResult as T];
    } catch (error) {
      console.error('Query failed:', error);
      throw error;
    }
  }

  async* queryStream<T = any>(
    query: string,
    options?: {
      parameters?: Record<string, any>;
      format?: DataFormat;
    }
  ): AsyncGenerator<T, void, unknown> {
    try {
      const result = await this.client.query({
        query,
        query_params: options?.parameters,
        format: options?.format || 'JSONEachRow',
      });

      const jsonResult = await result.json<T>();
      const items = Array.isArray(jsonResult) ? jsonResult : [jsonResult as T];
      
      for (const item of items) {
        yield item;
      }
    } catch (error) {
      console.error('Query stream failed:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
