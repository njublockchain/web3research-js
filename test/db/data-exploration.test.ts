import { describe, it, beforeEach, afterEach } from 'vitest';
import { ClickHouseProvider } from '../../src/db/provider.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Skip tests if environment variables are not set
const apiKey = process.env.W3R_API_KEY;
const backend = process.env.W3R_BACKEND;

console.log('Using API key:', apiKey ? 'FOUND' : 'MISSING');
console.log('Using backend:', backend);

const shouldRunTests = apiKey && backend;

// These tests run against a real ClickHouse instance for data exploration
(shouldRunTests ? describe : describe.skip)('ClickHouse Data Exploration', () => {
  let provider: ClickHouseProvider;

  beforeEach(() => {
    // Create provider with real credentials
    provider = new ClickHouseProvider({
      apiToken: apiKey as string,
      backend: backend as string,
      database: 'default'
    });
  });

  afterEach(async () => {
    // Close connection if there's a close method
    if (provider && 'client' in provider && typeof (provider as any).client.close === 'function') {
      await (provider as any).client.close();
    }
  });

  it('should explore available databases', async () => {
    try {
      const databases = await provider.query('SHOW DATABASES');
      console.log('Available databases:', databases);
      
      // For each database, show available tables
      for (const db of databases) {
        const dbName = db.name || db.database;
        if (dbName) {
          console.log(`\nExploring database: ${dbName}`);
          
          try {
            const tables = await provider.query(`SHOW TABLES FROM ${dbName}`);
            console.log(`Tables in ${dbName}:`, tables.slice(0, 10));  // Only show first 10 tables
            
            // Sample a few tables
            for (const table of tables.slice(0, 3)) {  // Only check first 3 tables
              const tableName = table.name || table.table;
              if (tableName) {
                try {
                  console.log(`\nSampling data from ${dbName}.${tableName}:`);
                  const sample = await provider.query(`SELECT * FROM ${dbName}.${tableName} LIMIT 2`);
                  console.log(`Sample data:`, sample);
                  
                  // If we get data, try to describe the table structure
                  const structure = await provider.query(`DESCRIBE TABLE ${dbName}.${tableName}`);
                  console.log(`Table structure:`, structure);
                } catch (tableError) {
                  console.log(`Error sampling ${dbName}.${tableName}: ${tableError.message}`);
                }
              }
            }
          } catch (tablesError) {
            console.log(`Error listing tables for ${dbName}: ${tablesError.message}`);
          }
        }
      }
    } catch (error) {
      console.error('Error exploring databases:', error);
    }
  });
  
  it('should look specifically for blockchain-related tables', async () => {
    try {
      console.log('\nSearching for blockchain-related tables across all databases:');
      
      // Find all databases first
      const databases = await provider.query('SHOW DATABASES');
      
      // Check each database for blockchain-related tables
      for (const db of databases) {
        const dbName = db.name || db.database;
        if (dbName) {
          try {
            // Look for blockchain-related tables
            const blockchainTables = await provider.query(`
              SHOW TABLES FROM ${dbName} 
              WHERE name LIKE '%btc%' OR name LIKE '%eth%' OR name LIKE '%tron%' OR 
                    name LIKE '%block%' OR name LIKE '%transaction%' OR name LIKE '%chain%'
            `);
            
            if (blockchainTables.length > 0) {
              console.log(`\nFound ${blockchainTables.length} blockchain-related tables in ${dbName}:`);
              console.log(blockchainTables.map(t => t.name || t.table).join(', '));
              
              // Sample the first blockchain table if found
              if (blockchainTables.length > 0) {
                const tableName = blockchainTables[0].name || blockchainTables[0].table;
                try {
                  console.log(`\nSampling data from ${dbName}.${tableName}:`);
                  const sample = await provider.query(`SELECT * FROM ${dbName}.${tableName} LIMIT 3`);
                  console.log(`Sample data:`, sample);
                } catch (sampleError) {
                  console.log(`Error sampling ${dbName}.${tableName}: ${sampleError.message}`);
                }
              }
            }
          } catch (error) {
            console.log(`Error searching tables in ${dbName}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.error('Error searching for blockchain tables:', error);
    }
  });
});
