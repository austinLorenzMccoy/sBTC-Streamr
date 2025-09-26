import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Upload, Settings, TrendingUp, Clock, User, Coins } from 'lucide-react'

interface StreamData {
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
  currentBlock: number
}

export default function StreamDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [stream, setStream] = useState<StreamData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    // Mock data for demonstration
    const mockStream: StreamData = {
      id: parseInt(id || '1'),
      sender: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
      recipient: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
      balance: 1000,
      withdrawnBalance: 300,
      paymentPerBlock: 10,
      timeframe: { startBlock: 100, stopBlock: 200 },
      tokenContract: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      isActive: true,
      progress: 45,
      currentBlock: 145
    }
    
    setTimeout(() => {
      setStream(mockStream)
      setLoading(false)
    }, 1000)
  }, [id])

  const handleAction = async (action: string) => {
    setActionLoading(action)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setActionLoading(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!stream) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Stream not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    )
  }

  const availableToWithdraw = Math.min(
    (stream.currentBlock - stream.timeframe.startBlock) * stream.paymentPerBlock - stream.withdrawnBalance,
    stream.balance - stream.withdrawnBalance
  )

  const remainingBlocks = stream.timeframe.stopBlock - stream.currentBlock
  const estimatedCompletion = remainingBlocks > 0 ? `${remainingBlocks} blocks` : 'Completed'

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stream #{stream.id}</h1>
            <p className="text-gray-600 mt-1">
              {stream.tokenContract ? 'Token Stream' : 'STX Stream'} • {stream.isActive ? 'Active' : 'Completed'}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleAction('withdraw')}
              disabled={actionLoading === 'withdraw' || availableToWithdraw <= 0}
              className="btn-primary"
            >
              {actionLoading === 'withdraw' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Withdraw
            </button>
            <button
              onClick={() => handleAction('refuel')}
              disabled={actionLoading === 'refuel'}
              className="btn-secondary"
            >
              {actionLoading === 'refuel' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Refuel
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stream Overview */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Stream Overview</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">{stream.balance.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Withdrawn</p>
                <p className="text-2xl font-bold text-green-600">{stream.withdrawnBalance.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-blue-600">{availableToWithdraw.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stream.paymentPerBlock}/block</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{stream.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${stream.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Stream Details */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Stream Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Sender</span>
                </div>
                <span className="font-medium">{stream.sender.slice(0, 8)}...{stream.sender.slice(-6)}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Recipient</span>
                </div>
                <span className="font-medium">{stream.recipient.slice(0, 8)}...{stream.recipient.slice(-6)}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="flex items-center">
                  <Coins className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Token Type</span>
                </div>
                <span className="font-medium">{stream.tokenContract ? 'Custom Token' : 'STX'}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Start Block</span>
                </div>
                <span className="font-medium">{stream.timeframe.startBlock.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">End Block</span>
                </div>
                <span className="font-medium">{stream.timeframe.stopBlock.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Current Block</span>
                </div>
                <span className="font-medium">{stream.currentBlock.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleAction('withdraw')}
                disabled={actionLoading === 'withdraw' || availableToWithdraw <= 0}
                className="w-full btn-primary"
              >
                {actionLoading === 'withdraw' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Withdraw Available
              </button>
              
              <button
                onClick={() => handleAction('refuel')}
                disabled={actionLoading === 'refuel'}
                className="w-full btn-secondary"
              >
                {actionLoading === 'refuel' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Add Funds
              </button>
              
              <button
                onClick={() => handleAction('settings')}
                disabled={actionLoading === 'settings'}
                className="w-full btn-secondary"
              >
                {actionLoading === 'settings' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                ) : (
                  <Settings className="w-4 h-4 mr-2" />
                )}
                Update Settings
              </button>
            </div>
          </div>

          {/* Stream Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stream Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`font-medium ${stream.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                  {stream.isActive ? 'Active' : 'Completed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completion</span>
                <span className="font-medium">{estimatedCompletion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Blocks Remaining</span>
                <span className="font-medium">{Math.max(0, remainingBlocks)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Duration</span>
                <span className="font-medium">
                  {stream.timeframe.stopBlock - stream.timeframe.startBlock} blocks
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
