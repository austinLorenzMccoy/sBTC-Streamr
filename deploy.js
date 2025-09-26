import transactionsPkg from '@stacks/transactions';
import networkPkg from '@stacks/network';
import walletPkg from '@stacks/wallet-sdk';

const { makeContractDeploy, makeUnsignedContractDeploy, broadcastTransaction, getAddressFromPrivateKey, signTransaction } = transactionsPkg;
const { STACKS_TESTNET } = networkPkg;
const { generateWallet } = walletPkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Testnet configuration
const network = STACKS_TESTNET;
const networkUrl = 'https://api.testnet.hiro.so';

// Your mnemonic (for demo purposes - in production, use environment variables)
const mnemonic = "ready giraffe river census point resource reduce caught burst possible round soft unique system output mother life shaft claw physical blast stumble toy hurt";

async function deployContract() {
  // Derive private key from mnemonic
  const wallet = await generateWallet({ secretKey: mnemonic });
  const privateKey = wallet.accounts[0].stxPrivateKey;

  console.log('Wallet generated successfully');
  console.log('Private key type:', typeof privateKey);
  console.log('Private key length:', privateKey?.length);

  // Get the address
  const address = getAddressFromPrivateKey(privateKey, 'testnet');
  console.log('Deploying from address:', address);

  // Read the contract file
  const contractPath = path.join(__dirname, 'contracts', 'sBTC-Streamr.clar');
  const contractCode = fs.readFileSync(contractPath, 'utf8');
  try {
    console.log('Creating deployment transaction...');
    
    // Create unsigned transaction first
    const unsignedTx = await makeUnsignedContractDeploy({
      contractName: 'sBTC-Streamr',
      codeBody: contractCode,
      network: network,
      fee: 10000, // 0.01 STX fee
      nonce: 0, // You might need to get the current nonce
    });

    console.log('Unsigned transaction created:', unsignedTx);

    // Sign the transaction
    const deployTx = await signTransaction(unsignedTx, privateKey);
    console.log('Transaction signed:', deployTx);

    console.log('Broadcasting transaction...');
    console.log('Transaction type:', typeof deployTx);
    console.log('Transaction methods:', Object.getOwnPropertyNames(deployTx));
    
    // Try to broadcast the transaction directly
    const result = await broadcastTransaction(deployTx, network);
    
    if (result.ok) {
      console.log('✅ Contract deployed successfully!');
      console.log('Transaction ID:', result.txid);
      console.log('Contract address:', `${address}.sBTC-Streamr`);
    } else {
      console.error('❌ Deployment failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error during deployment:', error.message);
  }
}

deployContract();
