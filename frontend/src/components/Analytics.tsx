import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Clock, Users, Activity } from 'lucide-react'

interface AnalyticsData {
  totalStreams: number
  activeStreams: number
  totalVolume: number
  averageDuration: number
  topTokens: Array<{
    token: string
    volume: number
    streams: number
  }>
  monthlyData: Array<{
    month: string
    streams: number
    volume: number
  }>
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    // Mock analytics data
    const mockData: AnalyticsData = {
      totalStreams: 24,
      activeStreams: 8,
      totalVolume: 125000,
      averageDuration: 45,
      topTokens: [
        { token: 'STX', volume: 75000, streams: 15 },
        { token: 'sBTC', volume: 35000, streams: 6 },
        { token: 'Custom', volume: 15000, streams: 3 }
      ],
      monthlyData: [
        { month: 'Jan', streams: 3, volume: 15000 },
        { month: 'Feb', streams: 5, volume: 25000 },
        { month: 'Mar', streams: 7, volume: 35000 },
        { month: 'Apr', streams: 4, volume: 20000 },
        { month: 'May', streams: 6, volume: 30000 }
      ]
    }
    
    setTimeout(() => {
      setData(mockData)
      setLoading(false)
    }, 1000)
  }, [timeRange])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Stream performance and insights</p>
        </div>
        
        <div className="flex space-x-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Streams</p>
              <p className="text-2xl font-bold text-gray-900">{data.totalStreams}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Streams</p>
              <p className="text-2xl font-bold text-gray-900">{data.activeStreams}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">{data.totalVolume.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Duration</p>
              <p className="text-2xl font-bold text-gray-900">{data.averageDuration} days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Tokens */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Tokens by Volume</h2>
          <div className="space-y-4">
            {data.topTokens.map((token, index) => (
              <div key={token.token} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{token.token}</p>
                    <p className="text-sm text-gray-600">{token.streams} streams</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{token.volume.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">
                    {((token.volume / data.totalVolume) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Trends</h2>
          <div className="space-y-4">
            {data.monthlyData.map((month) => (
              <div key={month.month} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{month.month}</p>
                  <p className="text-sm text-gray-600">{month.streams} streams</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{month.volume.toLocaleString()}</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(month.volume / Math.max(...data.monthlyData.map(m => m.volume))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Growing Adoption</h3>
            <p className="text-gray-600">
              Stream volume increased by 25% this month compared to last month.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">User Engagement</h3>
            <p className="text-gray-600">
              Average stream duration is 45 days, showing strong user retention.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Token Diversity</h3>
            <p className="text-gray-600">
              Multi-token support is driving 40% of total streaming volume.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
