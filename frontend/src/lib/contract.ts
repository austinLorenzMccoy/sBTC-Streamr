// Contract configuration
export const CONTRACT_ADDRESS = 'ST1PGECE9RYR303FHZ24BJVYY3MG63FC3NHBSR6X4';
export const CONTRACT_NAME = 'stream';

export interface StreamParams {
  recipient: string;
  initialBalance: number; // in STX
  startBlock: number;
  stopBlock: number;
  paymentPerBlock: number; // in STX
}

export interface Stream {
  id: number;
  sender: string;
  recipient: string;
  balance: number;
  withdrawnBalance: number;
  paymentPerBlock: number;
  timeframe: {
    startBlock: number;
    stopBlock: number;
  };
}

// Convert STX to microSTX
export const stxToMicroStx = (stx: number): number => Math.floor(stx * 1000000);

// Convert microSTX to STX
export const microStxToStx = (microStx: number): number => microStx / 1000000;

// Get current block height (approximate)
export const getCurrentBlockHeight = async (): Promise<number> => {
  try {
    const response = await fetch('https://api.testnet.hiro.so/v2/info');
    const data = await response.json();
    return data.burn_block_height || 0;
  } catch (error) {
    console.error('Error fetching block height:', error);
    return 0;
  }
};

// Get account balance
export const getAccountBalance = async (address: string): Promise<number> => {
  try {
    const response = await fetch(`https://api.testnet.hiro.so/v2/accounts/${address}`);
    const data = await response.json();
    return parseInt(data.balance) || 0;
  } catch (error) {
    console.error('Error fetching account balance:', error);
    return 0;
  }
};

// Mock contract functions for development
export const createStream = async (params: StreamParams, senderKey: string) => {
  console.log('Creating stream with params:', params);
  // Mock implementation - will be replaced with real contract calls
  return { txid: 'mock-tx-id-' + Date.now() };
};

export const withdrawFromStream = async (streamId: number, senderKey: string) => {
  console.log('Withdrawing from stream:', streamId);
  // Mock implementation - will be replaced with real contract calls
  return { txid: 'mock-withdraw-tx-id-' + Date.now() };
};

export const refuelStream = async (streamId: number, amount: number, senderKey: string) => {
  console.log('Refueling stream:', streamId, 'with amount:', amount);
  // Mock implementation - will be replaced with real contract calls
  return { txid: 'mock-refuel-tx-id-' + Date.now() };
};

export const refundStream = async (streamId: number, senderKey: string) => {
  console.log('Refunding stream:', streamId);
  // Mock implementation - will be replaced with real contract calls
  return { txid: 'mock-refund-tx-id-' + Date.now() };
};