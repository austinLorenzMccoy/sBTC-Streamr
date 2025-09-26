import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ArrowLeft, Info, Coins, Clock, User } from 'lucide-react'

type TokenType = 'STX' | 'sBTC' | 'CUSTOM'

interface StreamForm {
  recipient: string
  initialBalance: string
  paymentPerBlock: string
  startBlock: string
  stopBlock: string
  tokenType: TokenType
  customTokenContract: string
}

export default function CreateStream() {
  const navigate = useNavigate()
  const { address } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<StreamForm>({
    recipient: '',
    initialBalance: '',
    paymentPerBlock: '',
    startBlock: '',
    stopBlock: '',
    tokenType: 'STX',
    customTokenContract: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Navigate to dashboard
    navigate('/')
    setLoading(false)
  }

  const handleInputChange = (field: keyof StreamForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const tokenOptions = [
    { value: 'STX', label: 'STX (Stacks Token)', description: 'Native Stacks token' },
    { value: 'sBTC', label: 'sBTC (Synthetic Bitcoin)', description: 'Bitcoin-backed token' },
    { value: 'CUSTOM', label: 'Custom Token', description: 'Any SIP-010 token' }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Stream</h1>
        <p className="text-gray-600 mt-1">Set up a continuous payment stream</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Token Type Selection */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Coins className="w-5 h-5 mr-2" />
            Select Token Type
          </h3>
          <div className="space-y-3">
            {tokenOptions.map((option) => (
              <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="tokenType"
                  value={option.value}
                  checked={form.tokenType === option.value}
                  onChange={(e) => handleInputChange('tokenType', e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </label>
            ))}
          </div>

          {form.tokenType === 'CUSTOM' && (
            <div className="mt-4">
              <label className="label">Token Contract Address</label>
              <input
                type="text"
                value={form.customTokenContract}
                onChange={(e) => handleInputChange('customTokenContract', e.target.value)}
                placeholder="SP... or ST..."
                className="input"
                required
              />
            </div>
          )}
        </div>

        {/* Stream Details */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Stream Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Recipient Address</label>
              <input
                type="text"
                value={form.recipient}
                onChange={(e) => handleInputChange('recipient', e.target.value)}
                placeholder="SP... or ST..."
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Initial Balance</label>
              <input
                type="number"
                value={form.initialBalance}
                onChange={(e) => handleInputChange('initialBalance', e.target.value)}
                placeholder="1000"
                className="input"
                min="1"
                required
              />
            </div>

            <div>
              <label className="label">Payment Per Block</label>
              <input
                type="number"
                value={form.paymentPerBlock}
                onChange={(e) => handleInputChange('paymentPerBlock', e.target.value)}
                placeholder="10"
                className="input"
                min="1"
                required
              />
            </div>

            <div>
              <label className="label">Duration (blocks)</label>
              <input
                type="number"
                value={form.stopBlock}
                onChange={(e) => handleInputChange('stopBlock', e.target.value)}
                placeholder="100"
                className="input"
                min="1"
                required
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Timeline
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Start Block (optional)</label>
              <input
                type="number"
                value={form.startBlock}
                onChange={(e) => handleInputChange('startBlock', e.target.value)}
                placeholder="Current block"
                className="input"
                min="0"
              />
              <p className="text-sm text-gray-500 mt-1">Leave empty to start immediately</p>
            </div>

            <div>
              <label className="label">End Block</label>
              <input
                type="number"
                value={form.stopBlock}
                onChange={(e) => handleInputChange('stopBlock', e.target.value)}
                placeholder="1000"
                className="input"
                min="1"
                required
              />
            </div>
          </div>
        </div>

        {/* Stream Preview */}
        <div className="card bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Stream Preview
          </h3>
          
          {form.initialBalance && form.paymentPerBlock && form.stopBlock && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Duration:</span>
                <span className="font-medium">{form.stopBlock} blocks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Rate:</span>
                <span className="font-medium">{form.paymentPerBlock} {form.tokenType} per block</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Streamed:</span>
                <span className="font-medium">
                  {parseInt(form.paymentPerBlock) * parseInt(form.stopBlock)} {form.tokenType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Initial Balance:</span>
                <span className="font-medium">{form.initialBalance} {form.tokenType}</span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Stream...
              </>
            ) : (
              'Create Stream'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
