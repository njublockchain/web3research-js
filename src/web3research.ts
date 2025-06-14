import { EthereumProvider } from './eth/provider.js';
import { BitcoinProvider } from './btc/provider.js';
import { TronProvider } from './tron/provider.js';
import { ClickHouseConfig } from './db/provider.js';

export interface Web3ResearchConfig {
  apiToken: string;
  backend?: string;
  settings?: Record<string, any>;
  genericArgs?: Record<string, any>;
}

/**
 * Web3Research is the main entry point for the Web3Research TypeScript SDK.
 * This is a frontend-only implementation that connects directly to ClickHouse
 * via the @clickhouse/client-web library.
 */
export class Web3Research {
  private config: Web3ResearchConfig;

  constructor(config: Web3ResearchConfig) {
    if (!config.apiToken) {
      throw new Error('API token is required');
    }
    this.config = config;
  }

  /**
   * Create an EthereumProvider instance for accessing Ethereum blockchain data.
   * 
   * @param options - Configuration options for the Ethereum provider
   * @returns EthereumProvider instance
   */
  eth(options: {
    backend?: string;
    database?: string;
    settings?: Record<string, any>;
    genericArgs?: Record<string, any>;
  } = {}): EthereumProvider {
    const config: ClickHouseConfig = {
      apiToken: this.config.apiToken,
      backend: options.backend || this.config.backend,
      database: options.database || 'ethereum',
      settings: { ...this.config.settings, ...options.settings },
      genericArgs: { ...this.config.genericArgs, ...options.genericArgs },
    };

    return new EthereumProvider(config);
  }

  /**
   * Create an EthereumProvider instance. Same as eth().
   * 
   * @param options - Configuration options for the Ethereum provider
   * @returns EthereumProvider instance
   */
  ethereum(options: {
    backend?: string;
    database?: string;
    settings?: Record<string, any>;
    genericArgs?: Record<string, any>;
  } = {}): EthereumProvider {
    return this.eth(options);
  }

  /**
   * Create a BitcoinProvider instance for accessing Bitcoin blockchain data.
   * 
   * @param options - Configuration options for the Bitcoin provider
   * @returns BitcoinProvider instance
   */
  btc(options: {
    backend?: string;
    database?: string;
    settings?: Record<string, any>;
    genericArgs?: Record<string, any>;
  } = {}): BitcoinProvider {
    const config: ClickHouseConfig = {
      apiToken: this.config.apiToken,
      backend: options.backend || this.config.backend,
      database: options.database || 'bitcoin',
      settings: { ...this.config.settings, ...options.settings },
      genericArgs: { ...this.config.genericArgs, ...options.genericArgs },
    };

    return new BitcoinProvider(config);
  }

  /**
   * Create a BitcoinProvider instance. Same as btc().
   * 
   * @param options - Configuration options for the Bitcoin provider
   * @returns BitcoinProvider instance
   */
  bitcoin(options: {
    backend?: string;
    database?: string;
    settings?: Record<string, any>;
    genericArgs?: Record<string, any>;
  } = {}): BitcoinProvider {
    return this.btc(options);
  }

  /**
   * Create a TronProvider instance for accessing Tron blockchain data.
   * 
   * @param options - Configuration options for the Tron provider
   * @returns TronProvider instance
   */
  tron(options: {
    backend?: string;
    database?: string;
    settings?: Record<string, any>;
    genericArgs?: Record<string, any>;
  } = {}): TronProvider {
    const config: ClickHouseConfig = {
      apiToken: this.config.apiToken,
      backend: options.backend || this.config.backend,
      database: options.database || 'tron',
      settings: { ...this.config.settings, ...options.settings },
      genericArgs: { ...this.config.genericArgs, ...options.genericArgs },
    };

    return new TronProvider(config);
  }
}
