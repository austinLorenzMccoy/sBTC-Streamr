import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Plus, TrendingUp, Clock, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface Stream {
  id: number
  sender: string
  recipient: string
  balance: number
  withdrawnBalance: number
  paymentPerBlock: number
  timeframe: {
    startBlock: number
    stopBlock: number
  }
  tokenContract?: string
  isActive: boolean
  progress: number
}

export default function Dashboard() {
  const { address } = useAuth()
  const [streams, setStreams] = useState<Stream[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    const mockStreams: Stream[] = [
      {
        id: 1,
        sender: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
        recipient: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
        balance: 1000,
        withdrawnBalance: 300,
        paymentPerBlock: 10,
        timeframe: { startBlock: 100, stopBlock: 200 },
        isActive: true,
        progress: 45
      },
      {
        id: 2,
        sender: address || '',
        recipient: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
        balance: 500,
        withdrawnBalance: 0,
        paymentPerBlock: 5,
        timeframe: { startBlock: 150, stopBlock: 250 },
        tokenContract: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // sBTC
        isActive: true,
        progress: 20
      }
    ]
    
    setTimeout(() => {
      setStreams(mockStreams)
      setLoading(false)
    }, 1000)
  }, [address])

  const activeStreams = streams.filter(s => s.isActive)
  const totalStreamed = streams.reduce((sum, s) => sum + s.withdrawnBalance, 0)
  const totalBalance = streams.reduce((sum, s) => sum + s.balance, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your token streams</p>
        </div>
        <Link to="/create" className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Stream
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Streams</p>
              <p className="text-2xl font-bold text-gray-900">{activeStreams.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Streamed</p>
              <p className="text-2xl font-bold text-gray-900">{totalStreamed.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">{totalBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Duration</p>
              <p className="text-2xl font-bold text-gray-900">45 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Streams List */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Streams</h2>
          <Link to="/analytics" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View Analytics →
          </Link>
        </div>

        {streams.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No streams yet</h3>
            <p className="text-gray-600 mb-6">Create your first token stream to get started</p>
            <Link to="/create" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Stream
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {streams.map((stream) => (
              <div key={stream.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-medium text-gray-900">Stream #{stream.id}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        stream.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {stream.isActive ? 'Active' : 'Completed'}
                      </span>
                      {stream.tokenContract && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Token Stream
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Recipient</p>
                        <p className="font-medium">{stream.recipient.slice(0, 8)}...{stream.recipient.slice(-6)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Balance</p>
                        <p className="font-medium">{stream.balance.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Rate</p>
                        <p className="font-medium">{stream.paymentPerBlock}/block</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Progress</p>
                        <p className="font-medium">{stream.progress}%</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stream.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Link 
                      to={`/stream/${stream.id}`}
                      className="btn-secondary text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
