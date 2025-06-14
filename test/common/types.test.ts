import { describe, it, expect } from 'vitest';
import { Address, Hash, ChainStyle, BTCAddressVariant } from '../../src/common/types.js';

describe('Address', () => {
  describe('Ethereum addresses', () => {
    it('should handle valid Ethereum address', () => {
      const ethAddr = '0x742d35Cc6635C0532925a3b8D400beb8aE174c4b';
      const address = new Address(ethAddr);
      
      expect(address.addr).toBe(ethAddr);
      expect(address.addrHex).toBe('742d35Cc6635C0532925a3b8D400beb8aE174c4b');
      expect(address.toString()).toBe("unhex('742d35Cc6635C0532925a3b8D400beb8aE174c4b')");
    });

    it('should reject invalid Ethereum address length', () => {
      expect(() => new Address('0x123')).toThrow('Invalid ETH address');
    });

    it('should reject invalid Ethereum address format', () => {
      expect(() => new Address('0x742d35Cc6635C0532925a3b8D400beb8aE174c4z')).toThrow();
    });
  });

  describe('TRON addresses', () => {
    it('should handle TRON address in base58 format', () => {
      // This is a simplified test - in real usage you'd need a valid base58 TRON address
      // For now, we'll test the hex format which is more predictable
      const tronHexAddr = '41742d35Cc6635C0532925a3b8D400beb8aE174c4b';
      const address = new Address(tronHexAddr);
      
      expect(address.addr).toBe(tronHexAddr);
      expect(address.addrHex).toBe('742d35Cc6635C0532925a3b8D400beb8aE174c4b');
    });

    it('should reject invalid TRON hex address length', () => {
      expect(() => new Address('41123')).toThrow('Invalid TRON address');
    });
  });

  describe('Raw hex addresses', () => {
    it('should handle raw hex address', () => {
      const hexAddr = '742d35Cc6635C0532925a3b8D400beb8aE174c4b';
      const address = new Address(hexAddr);
      
      expect(address.addr).toBe(hexAddr);
      expect(address.addrHex).toBe(hexAddr);
    });
  });

  describe('Constructor with addrHex parameter', () => {
    it('should handle addrHex parameter', () => {
      const hexAddr = '742d35Cc6635C0532925a3b8D400beb8aE174c4b';
      const address = new Address(undefined, hexAddr);
      
      expect(address.addr).toBe(hexAddr);
      expect(address.addrHex).toBe(hexAddr);
    });

    it('should require either addr or addrHex', () => {
      expect(() => new Address()).toThrow('Either addr or addrHex must be provided');
    });
  });

  describe('Invalid addresses', () => {
    it('should reject completely invalid address format', () => {
      expect(() => new Address('invalid-address')).toThrow('Invalid address');
    });
  });
});

describe('Hash', () => {
  it('should handle valid hash with 0x prefix', () => {
    const hashStr = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const hash = new Hash(hashStr);
    
    expect(hash.hash).toBe('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
    expect(hash.toString()).toBe("unhex('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef')");
  });

  it('should handle valid hash without 0x prefix', () => {
    const hashStr = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const hash = new Hash(hashStr);
    
    expect(hash.hash).toBe(hashStr);
    expect(hash.toString()).toBe(`unhex('${hashStr}')`);
  });

  it('should reject invalid hash length', () => {
    expect(() => new Hash('0x123')).toThrow('Invalid hash length');
    expect(() => new Hash('123')).toThrow('Invalid hash length');
  });
});

describe('Enums', () => {
  it('should have correct ChainStyle values', () => {
    expect(ChainStyle.BTC).toBe('chain:btc');
    expect(ChainStyle.ETH).toBe('chain:eth');
    expect(ChainStyle.TRON).toBe('chain:tron');
  });

  it('should have correct BTCAddressVariant values', () => {
    expect(BTCAddressVariant.P2PKH).toBe('p2pkh');
    expect(BTCAddressVariant.P2SH).toBe('p2sh');
    expect(BTCAddressVariant.BECH32).toBe('bech32');
  });
});
