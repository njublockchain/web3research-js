import { Interface } from 'ethers';
import { EventData } from '../common/types.js';

export interface EventABI {
  type: 'event';
  name: string;
  inputs: Array<{
    name: string;
    type: string;
    indexed?: boolean;
  }>;
  anonymous?: boolean;
}

export interface FunctionABI {
  type: 'function';
  name: string;
  inputs: Array<{
    name: string;
    type: string;
  }>;
  outputs?: Array<{
    name: string;
    type: string;
  }>;
  stateMutability?: 'pure' | 'view' | 'nonpayable' | 'payable';
}

export class SingleEventDecoder {
  private eventInterface: Interface;
  private eventName: string;

  constructor(eventAbi: EventABI, name?: string) {
    this.eventName = name || eventAbi.name;
    this.eventInterface = new Interface([eventAbi]);
  }

  decode(eventLog: EventData): Record<string, any> {
    try {
      const logData = {
        topics: eventLog.topics,
        data: eventLog.data,
        address: eventLog.address,
        blockNumber: eventLog.blockNumber,
        blockHash: eventLog.blockHash,
        transactionHash: eventLog.transactionHash,
        transactionIndex: eventLog.transactionIndex,
        index: eventLog.logIndex,
        removed: false,
      };

      const parsed = this.eventInterface.parseLog(logData);
      if (!parsed) {
        throw new Error('Failed to parse event log');
      }

      // Convert to plain object
      const result: Record<string, any> = {};
      for (let i = 0; i < parsed.args.length; i++) {
        const input = this.eventInterface.getEvent(this.eventName)?.inputs[i];
        if (input) {
          result[input.name] = parsed.args[i];
        }
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to decode event: ${error}`);
    }
  }
}

export class ContractDecoder {
  private contractInterface: Interface;

  constructor(contractAbi: Array<EventABI | FunctionABI>) {
    this.contractInterface = new Interface(contractAbi);
  }

  decodeEvent(eventLog: EventData): Record<string, any> | null {
    try {
      const logData = {
        topics: eventLog.topics,
        data: eventLog.data,
        address: eventLog.address,
        blockNumber: eventLog.blockNumber,
        blockHash: eventLog.blockHash,
        transactionHash: eventLog.transactionHash,
        transactionIndex: eventLog.transactionIndex,
        index: eventLog.logIndex,
        removed: false,
      };

      const parsed = this.contractInterface.parseLog(logData);
      if (!parsed) {
        return null;
      }

      // Convert to plain object
      const result: Record<string, any> = {
        eventName: parsed.name,
        eventSignature: parsed.signature,
      };

      for (let i = 0; i < parsed.args.length; i++) {
        const fragment = parsed.fragment;
        if (fragment && fragment.inputs[i]) {
          result[fragment.inputs[i].name] = parsed.args[i];
        }
      }

      return result;
    } catch (error) {
      console.warn('Failed to decode event:', error);
      return null;
    }
  }

  decodeFunction(input: string): Record<string, any> | null {
    try {
      const parsed = this.contractInterface.parseTransaction({ data: input });
      if (!parsed) {
        return null;
      }

      // Convert to plain object
      const result: Record<string, any> = {
        functionName: parsed.name,
        functionSignature: parsed.signature,
      };

      for (let i = 0; i < parsed.args.length; i++) {
        const fragment = parsed.fragment;
        if (fragment && fragment.inputs[i]) {
          result[fragment.inputs[i].name] = parsed.args[i];
        }
      }

      return result;
    } catch (error) {
      console.warn('Failed to decode function:', error);
      return null;
    }
  }

  getEventTopic(eventName: string): string | null {
    try {
      const eventFragment = this.contractInterface.getEvent(eventName);
      if (!eventFragment) {
        return null;
      }
      return eventFragment.topicHash;
    } catch {
      return null;
    }
  }

  getFunctionSelector(functionName: string): string | null {
    try {
      const functionFragment = this.contractInterface.getFunction(functionName);
      if (!functionFragment) {
        return null;
      }
      return functionFragment.selector;
    } catch {
      return null;
    }
  }
}
