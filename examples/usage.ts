import { Web3Research, Address, SingleEventDecoder } from '../src/index.js';

// Example usage of the Web3Research TypeScript SDK

async function main() {
  // Initialize the Web3Research client
  const w3r = new Web3Research({
    apiToken: 'YOUR_API_TOKEN_HERE' // Replace with your actual API token
  });

  try {
    // Example 1: Get latest Ethereum blocks
    console.log('🔍 Fetching latest Ethereum blocks...');
    const ethProvider = w3r.eth();
    const blocks = await ethProvider.blocks({
      orderBy: { number: false }, // Descending order
      limit: 5
    });
    console.log(`📦 Found ${blocks.length} blocks:`);
    blocks.forEach(block => {
      console.log(`  Block ${block.number}: ${block.transactionCount} transactions`);
    });

    // Example 2: Get USDT transfer events
    console.log('\n💰 Fetching USDT transfer events...');
    const usdtAddress = new Address('0xdac17f958d2ee523a2206206994597c13d831ec7');
    const events = await ethProvider.events({
      where: `address = ${usdtAddress}`,
      orderBy: { blockNumber: false },
      limit: 3
    });
    console.log(`🔄 Found ${events.length} USDT events:`);
    events.forEach(event => {
      console.log(`  Event in block ${event.blockNumber}, tx ${event.transactionHash}`);
    });

    // Example 3: Decode a USDT Transfer event
    if (events.length > 0) {
      console.log('\n🔍 Decoding USDT Transfer event...');
      const transferEventABI = {
        type: 'event' as const,
        name: 'Transfer',
        inputs: [
          { indexed: true, name: 'from', type: 'address' },
          { indexed: true, name: 'to', type: 'address' },
          { indexed: false, name: 'value', type: 'uint256' }
        ]
      };

      const decoder = new SingleEventDecoder(transferEventABI);
      try {
        const decoded = decoder.decode(events[0]);
        console.log('✅ Decoded transfer:', decoded);
      } catch (error) {
        console.log('❌ Failed to decode event:', error.message);
      }
    }

    // Example 4: Get Bitcoin blocks
    console.log('\n₿ Fetching latest Bitcoin blocks...');
    const btcProvider = w3r.btc();
    const btcBlocks = await btcProvider.blocks({
      orderBy: { height: false },
      limit: 3
    });
    console.log(`⛏️ Found ${btcBlocks.length} Bitcoin blocks:`);
    btcBlocks.forEach(block => {
      console.log(`  Block ${block.height}: ${block.transactionCount} transactions`);
    });

    // Example 5: Stream Ethereum transactions
    console.log('\n🌊 Streaming recent Ethereum transactions (first 3)...');
    let count = 0;
    for await (const tx of ethProvider.transactionsStream({
      where: 'blockNumber > 18000000',
      orderBy: { blockNumber: false },
      limit: 3
    })) {
      console.log(`  Transaction ${tx.hash} in block ${tx.blockNumber}`);
      count++;
      if (count >= 3) break;
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the example
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main };
