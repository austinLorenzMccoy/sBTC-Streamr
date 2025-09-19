#!/usr/bin/env node

/**
 * HTTP-based test script for deployed sBTC-Streamr contract on testnet
 * Contract: ST1PGECE9RYR303FHZ24BJVYY3MG63FC3NHBSR6X4.stream
 */

// Configuration
const CONTRACT_ADDRESS = 'ST1PGECE9RYR303FHZ24BJVYY3MG63FC3NHBSR6X4';
const CONTRACT_NAME = 'stream';
const API_BASE_URL = 'https://api.testnet.hiro.so';
const SENDER_ADDRESS = 'ST1PGECE9RYR303FHZ24BJVYY3MG63FC3NHBSR6X4';

async function testContractViaHTTP() {
  console.log('🧪 Testing Deployed sBTC-Streamr Contract (HTTP)');
  console.log('================================================');
  console.log(`Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
  console.log(`Network: Testnet`);
  console.log('');

  try {
    // Test 1: Get contract info
    console.log('📖 Test 1: Getting contract info...');
    const contractUrl = `${API_BASE_URL}/v2/contracts/${CONTRACT_ADDRESS}/${CONTRACT_NAME}`;
    console.log(`URL: ${contractUrl}`);
    
    const contractResponse = await fetch(contractUrl);
    if (contractResponse.ok) {
      const contractData = await contractResponse.json();
      console.log('✅ Contract found!');
      console.log(`Source: ${contractData.source_code.substring(0, 100)}...`);
    } else {
      console.log(`❌ Contract not found: ${contractResponse.status}`);
    }
    console.log('');

    // Test 2: Get contract data variables
    console.log('📖 Test 2: Getting contract data variables...');
    const dataUrl = `${API_BASE_URL}/v2/data_var/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/latest-stream-id`;
    console.log(`URL: ${dataUrl}`);
    
    const dataResponse = await fetch(dataUrl);
    if (dataResponse.ok) {
      const dataData = await dataResponse.json();
      console.log('✅ Latest stream ID:', dataData.value);
    } else {
      console.log(`❌ Data variable not found: ${dataResponse.status}`);
    }
    console.log('');

    // Test 3: Get contract map entries
    console.log('📖 Test 3: Getting contract map entries...');
    const mapUrl = `${API_BASE_URL}/v2/map_entry/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/streams/0`;
    console.log(`URL: ${mapUrl}`);
    
    const mapResponse = await fetch(mapUrl);
    if (mapResponse.ok) {
      const mapData = await mapResponse.json();
      console.log('✅ Stream 0 data:', mapData.value);
    } else {
      console.log(`❌ Map entry not found: ${mapResponse.status}`);
    }
    console.log('');

    // Test 4: Get account info
    console.log('📖 Test 4: Getting account info...');
    const accountUrl = `${API_BASE_URL}/v2/accounts/${SENDER_ADDRESS}`;
    console.log(`URL: ${accountUrl}`);
    
    const accountResponse = await fetch(accountUrl);
    if (accountResponse.ok) {
      const accountData = await accountResponse.json();
      console.log('✅ Account info:');
      console.log(`Balance: ${accountData.balance} uSTX`);
      console.log(`Nonce: ${accountData.nonce}`);
    } else {
      console.log(`❌ Account not found: ${accountResponse.status}`);
    }
    console.log('');

    console.log('✅ HTTP-based contract testing completed!');
    console.log('');
    console.log('🔗 View Contract on Explorer:');
    console.log(`https://explorer.stacks.co/address/${CONTRACT_ADDRESS}?chain=testnet`);

  } catch (error) {
    console.error('❌ Error testing contract:', error);
  }
}

// Run the test
testContractViaHTTP().catch(console.error);
