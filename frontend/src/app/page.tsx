'use client';

import { useState } from 'react';

// Contract configuration
const CONTRACT_ADDRESS = 'ST1PGECE9RYR303FHZ24BJVYY3MG63FC3NHBSR6X4';
const CONTRACT_NAME = 'stream';

interface Stream {
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

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(false);
  const [newStream, setNewStream] = useState({
    recipient: '',
    initialBalance: '',
    startBlock: '',
    stopBlock: '',
    paymentPerBlock: ''
  });

  // Mock wallet connection
  const connectWallet = () => {
    setIsConnected(true);
    setAddress('ST1PGECE9RYR303FHZ24BJVYY3MG63FC3NHBSR6X4');
  };

  // Create a new stream (mock implementation)
  const createStream = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      // Mock stream creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Stream created:', newStream);
      alert('Stream created successfully! (Mock implementation)');
      
      // Reset form
      setNewStream({
        recipient: '',
        initialBalance: '',
        startBlock: '',
        stopBlock: '',
        paymentPerBlock: ''
      });
    } catch (error) {
      console.error('Error creating stream:', error);
      alert('Error creating stream: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Withdraw from a stream (mock implementation)
  const withdrawFromStream = async (streamId: number) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      // Mock withdrawal
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Withdrawal successful for stream:', streamId);
      alert('Withdrawal successful! (Mock implementation)');
    } catch (error) {
      console.error('Error withdrawing:', error);
      alert('Error withdrawing: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            sBTC-Streamr
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Bitcoin-native token streaming protocol on Stacks
          </p>
          <div className="flex justify-center">
            {!isConnected ? (
              <button
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-md">
                Connected: {address}
              </div>
            )}
          </div>
        </header>

        {/* Contract Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Contract Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Contract Address</p>
              <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                {CONTRACT_ADDRESS}.{CONTRACT_NAME}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Network</p>
              <p className="text-sm text-gray-900 dark:text-white">Stacks Testnet</p>
            </div>
          </div>
          <div className="mt-4">
            <a 
              href={`https://explorer.stacks.co/address/${CONTRACT_ADDRESS}?chain=testnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View on Explorer →
            </a>
          </div>
        </div>

        {/* Create Stream Form */}
        {isConnected && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Create New Stream
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={newStream.recipient}
                  onChange={(e) => setNewStream({...newStream, recipient: e.target.value})}
                  placeholder="ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Initial Balance (STX)
                </label>
                <input
                  type="number"
                  value={newStream.initialBalance}
                  onChange={(e) => setNewStream({...newStream, initialBalance: e.target.value})}
                  placeholder="1.0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Block
                </label>
                <input
                  type="number"
                  value={newStream.startBlock}
                  onChange={(e) => setNewStream({...newStream, startBlock: e.target.value})}
                  placeholder="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stop Block
                </label>
                <input
                  type="number"
                  value={newStream.stopBlock}
                  onChange={(e) => setNewStream({...newStream, stopBlock: e.target.value})}
                  placeholder="200"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Per Block (STX)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newStream.paymentPerBlock}
                  onChange={(e) => setNewStream({...newStream, paymentPerBlock: e.target.value})}
                  placeholder="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={createStream}
              disabled={loading}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-md transition-colors"
            >
              {loading ? 'Creating Stream...' : 'Create Stream'}
            </button>
          </div>
        )}

        {/* Streams List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Active Streams
          </h2>
          {streams.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No streams found. Create your first stream above!
            </p>
          ) : (
            <div className="space-y-4">
              {streams.map((stream) => (
                <div key={stream.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Stream ID</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{stream.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Recipient</p>
                      <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                        {stream.recipient}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {(stream.balance / 1000000).toFixed(6)} STX
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => withdrawFromStream(stream.id)}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Development Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mt-8">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            🚧 Development Mode
          </h3>
          <p className="text-yellow-700 dark:text-yellow-300">
            This is a mock implementation for demonstration purposes. 
            Real wallet integration and contract calls will be implemented in the next phase.
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-600 dark:text-gray-400">
          <p>Built on Stacks • Powered by Bitcoin</p>
        </footer>
      </div>
    </div>
  );
}