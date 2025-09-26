import React from 'react'
import { Info } from 'lucide-react'

export default function WalletInfo() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Wallet Provider Notice</p>
          <p>
            If you see wallet provider errors in the console, this is normal when you have multiple 
            wallet extensions installed (Xverse, Hiro Wallet, etc.). These errors don't affect 
            functionality and have been suppressed for a cleaner experience.
          </p>
        </div>
      </div>
    </div>
  )
}
