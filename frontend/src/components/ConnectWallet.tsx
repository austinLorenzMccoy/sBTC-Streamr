import React from 'react'
import { useConnect } from '@stacks/connect-react'
import { Wallet, Shield, Zap, Globe } from 'lucide-react'

export default function ConnectWallet() {
  const { openAuth } = useConnect()

  const features = [
    {
      icon: Zap,
      title: 'Multi-Token Streaming',
      description: 'Stream STX, sBTC, and other SIP-010 tokens with ease'
    },
    {
      icon: Shield,
      title: 'Secure & Decentralized',
      description: 'Built on Stacks blockchain with Clarity smart contracts'
    },
    {
      icon: Globe,
      title: 'Cross-Chain Ready',
      description: 'Support for Bitcoin-backed tokens and more'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-gradient">sBTC-Streamr</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The first multi-token streaming protocol on Stacks. Stream payments continuously with STX, sBTC, and other SIP-010 tokens.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="card text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <button
            onClick={() => openAuth()}
            className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <Wallet className="w-5 h-5 mr-2" />
            Connect Your Wallet
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Connect with Leather, Xverse, or any Stacks-compatible wallet
          </p>
        </div>
      </div>
    </div>
  )
}
