#!/usr/bin/env node

/**
 * Test script for deployed sBTC-Streamr contract on testnet
 * Contract: ST1PGECE9RYR303FHZ24BJVYY3MG63FC3NHBSR6X4.stream
 */

import { 
  makeContractCall, 
  broadcastTransaction, 
  callReadOnlyFunction,
  contractPrincipalCV,
  standardPrincipalCV,
  uintCV,
  tupleCV,
  cvToValue,
  StacksTestnet,
  StacksMainnet
} from '@stacks/transactions';
import { createStacksPrivateKey, getAddressFromPrivateKey } from '@stacks/transactions';

// Configuration
const CONTRACT_ADDRESS = 'ST1PGECE9RYR303FHZ24BJVYY3MG63FC3NHBSR6X4';
const CONTRACT_NAME = 'stream';
const NETWORK = new StacksTestnet();

// Test accounts (you'll need to replace with your actual testnet keys)
const SENDER_PRIVATE_KEY = '7287ba251d44a4d3fd9276c88ce34c5c52a038955511cccaf77e61068649c17801';
const RECIPIENT_ADDRESS = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';

async function testDeployedContract() {
  console.log('🧪 Testing Deployed sBTC-Streamr Contract');
  console.log('==========================================');
  console.log(`Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
  console.log(`Network: Testnet`);
  console.log('');

  try {
    // Get sender address
    const senderAddress = getAddressFromPrivateKey(SENDER_PRIVATE_KEY);
    console.log(`Sender Address: ${senderAddress}`);
    console.log(`Recipient Address: ${RECIPIENT_ADDRESS}`);
    console.log('');

    // Test 1: Read-only function - get latest stream ID
    console.log('📖 Test 1: Reading latest-stream-id...');
    const latestStreamId = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-latest-stream-id',
      functionArgs: [],
      network: NETWORK,
      senderAddress: senderAddress,
    });
    console.log(`Latest Stream ID: ${cvToValue(latestStreamId)}`);
    console.log('');

    // Test 2: Create a new stream
    console.log('🔄 Test 2: Creating a new stream...');
    const streamTx = await makeContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'stream-to',
      functionArgs: [
        standardPrincipalCV(RECIPIENT_ADDRESS), // recipient
        uintCV(1000000), // 1 STX in microSTX
        tupleCV({
          'start-block': uintCV(100),
          'stop-block': uintCV(200)
        }), // timeframe
        uintCV(10000) // 0.01 STX per block
      ],
      senderKey: SENDER_PRIVATE_KEY,
      network: NETWORK,
    });

    console.log('Stream creation transaction prepared:');
    console.log(`Tx ID: ${streamTx.txid()}`);
    console.log('Broadcasting transaction...');
    
    const streamResult = await broadcastTransaction(streamTx, NETWORK);
    console.log(`Broadcast result: ${streamResult}`);
    console.log('');

    // Test 3: Read stream details
    console.log('📖 Test 3: Reading stream details...');
    const streamDetails = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionArgs: [
        uintCV(0), // stream-id
        standardPrincipalCV(senderAddress) // who
      ],
      functionName: 'balance-of',
      network: NETWORK,
      senderAddress: senderAddress,
    });
    console.log(`Stream balance: ${cvToValue(streamDetails)}`);
    console.log('');

    console.log('✅ Contract testing completed successfully!');
    console.log('');
    console.log('🔗 View on Explorer:');
    console.log(`https://explorer.stacks.co/txid/${streamTx.txid()}?chain=testnet`);

  } catch (error) {
    console.error('❌ Error testing contract:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testDeployedContract().catch(console.error);
