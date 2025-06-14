import bs58 from 'bs58';

export enum ChainStyle {
  BTC = 'chain:btc',
  ETH = 'chain:eth',
  TRON = 'chain:tron',
}

export enum BTCAddressVariant {
  P2PKH = 'p2pkh',
  P2SH = 'p2sh',
  BECH32 = 'bech32',
}

export class Address {
  public readonly addr: string;
  public readonly addrHex: string;

  constructor(addr?: string, addrHex?: string) {
    if (addr) {
      this.addr = addr;
      if (addr.startsWith('0x') && addr.length === 42) {
        // Ethereum address
        this.addrHex = addr.slice(2);
        if (this.addrHex.length !== 40) {
          throw new Error('Invalid ETH address');
        }
      } else if (addr.startsWith('T') && addr.length === 34) {
        // TRON address (base58)
        try {
          const decoded = bs58.decode(addr);
          // Remove version byte and checksum
          this.addrHex = Buffer.from(decoded.slice(1, -4)).toString('hex');
          if (this.addrHex.length !== 40) {
            throw new Error('Invalid TRON address');
          }
        } catch {
          throw new Error('Invalid TRON address');
        }
      } else if (addr.startsWith('41') && addr.length === 42) {
        // TRON address (hex format)
        this.addrHex = addr.slice(2);
        if (this.addrHex.length !== 40) {
          throw new Error('Invalid TRON address');
        }
      } else if (addr.length === 40) {
        // Raw hex address
        this.addrHex = addr;
      } else {
        throw new Error('Invalid address');
      }
    } else {
      if (!addrHex) {
        throw new Error('Either addr or addrHex must be provided');
      }
      this.addr = addrHex;
      this.addrHex = addrHex;
    }
  }

  toString(): string {
    return `unhex('${this.addrHex}')`;
  }
}

export class Hash {
  public readonly hash: string;

  constructor(hash: string) {
    if (hash.startsWith('0x')) {
      this.hash = hash.slice(2);
    } else {
      this.hash = hash;
    }
    
    if (this.hash.length !== 64) {
      throw new Error('Invalid hash length');
    }
  }

  toString(): string {
    return `unhex('${this.hash}')`;
  }
}

export interface QueryOptions {
  where?: string;
  orderBy?: Record<string, boolean>;
  limit?: number;
  offset?: number;
  parameters?: Record<string, any>;
}

export interface BlockData {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: Date;
  gasLimit: bigint;
  gasUsed: bigint;
  baseFeePerGas?: bigint;
  miner: string;
  difficulty: bigint;
  totalDifficulty: bigint;
  size: number;
  transactionCount: number;
  [key: string]: any;
}

export interface TransactionData {
  hash: string;
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;
  from: string;
  to?: string;
  value: bigint;
  gas: bigint;
  gasPrice: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  nonce: number;
  input: string;
  type: number;
  status: number;
  gasUsed: bigint;
  [key: string]: any;
}

export interface EventData {
  address: string;
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  transactionIndex: number;
  logIndex: number;
  topics: string[];
  data: string;
  [key: string]: any;
}

export interface TraceData {
  blockNumber: number;
  transactionHash: string;
  traceAddress: number[];
  subtraces: number;
  type: string;
  from?: string;
  to?: string;
  value?: bigint;
  gas?: bigint;
  gasUsed?: bigint;
  input?: string;
  output?: string;
  error?: string;
  [key: string]: any;
}
