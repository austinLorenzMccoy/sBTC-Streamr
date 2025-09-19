#!/usr/bin/env node

/**
 * Read-only test script for deployed sBTC-Streamr contract on testnet
 * Contract: ST1PGECE9RYR303FHZ24BJVYY3MG63FC3NHBSR6X4.stream
 */

import pkg from '@stacks/transactions';
const { 
  callReadOnlyFunction,
  standardPrincipalCV,
  uintCV,
  tupleCV,
  cvToValue
} = pkg;

// Configuration
const CONTRACT_ADDRESS = 'ST1PGECE9RYR303FHZ24BJVYY3MG63FC3NHBSR6X4';
const CONTRACT_NAME = 'stream';
const NETWORK = {
  coreApiUrl: 'https://api.testnet.hiro.so',
  networkId: 2147483648
};
const SENDER_ADDRESS = 'ST1PGECE9RYR303FHZ24BJVYY3MG63FC3NHBSR6X4';
const RECIPIENT_ADDRESS = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';

async function testReadOnlyFunctions() {
  console.log('🧪 Testing Deployed sBTC-Streamr Contract (Read-Only)');
  console.log('====================================================');
  console.log(`Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
  console.log(`Network: Testnet`);
  console.log('');

  try {
    // Test 1: Get latest stream ID
    console.log('📖 Test 1: Reading latest-stream-id...');
    try {
      const latestStreamId = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-latest-stream-id',
        functionArgs: [],
        network: NETWORK,
        senderAddress: SENDER_ADDRESS,
      });
      console.log(`✅ Latest Stream ID: ${cvToValue(latestStreamId)}`);
    } catch (error) {
      console.log(`❌ Error reading latest-stream-id: ${error.message}`);
    }
    console.log('');

    // Test 2: Calculate block delta
    console.log('📖 Test 2: Testing calculate-block-delta...');
    try {
      const blockDelta = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'calculate-block-delta',
        functionArgs: [
          tupleCV({
            'start-block': uintCV(100),
            'stop-block': uintCV(200)
          })
        ],
        network: NETWORK,
        senderAddress: SENDER_ADDRESS,
      });
      console.log(`✅ Block Delta: ${cvToValue(blockDelta)}`);
    } catch (error) {
      console.log(`❌ Error calculating block delta: ${error.message}`);
    }
    console.log('');

    // Test 3: Check balance of non-existent stream
    console.log('📖 Test 3: Testing balance-of for stream 0...');
    try {
      const balance = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'balance-of',
        functionArgs: [
          uintCV(0), // stream-id
          standardPrincipalCV(SENDER_ADDRESS) // who
        ],
        network: NETWORK,
        senderAddress: SENDER_ADDRESS,
      });
      console.log(`✅ Balance: ${cvToValue(balance)}`);
    } catch (error) {
      console.log(`❌ Error reading balance: ${error.message}`);
    }
    console.log('');

    // Test 4: Hash stream (should work even with non-existent stream)
    console.log('📖 Test 4: Testing hash-stream...');
    try {
      const hash = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'hash-stream',
        functionArgs: [
          uintCV(0), // stream-id
          uintCV(1000), // new-payment-per-block
          tupleCV({
            'start-block': uintCV(100),
            'stop-block': uintCV(200)
          }) // new-timeframe
        ],
        network: NETWORK,
        senderAddress: SENDER_ADDRESS,
      });
      console.log(`✅ Hash: ${cvToValue(hash)}`);
    } catch (error) {
      console.log(`❌ Error hashing stream: ${error.message}`);
    }
    console.log('');

    console.log('✅ Read-only contract testing completed!');
    console.log('');
    console.log('🔗 View Contract on Explorer:');
    console.log(`https://explorer.stacks.co/address/${CONTRACT_ADDRESS}?chain=testnet`);

  } catch (error) {
    console.error('❌ Error testing contract:', error);
  }
}

// Run the test
testReadOnlyFunctions().catch(console.error);
