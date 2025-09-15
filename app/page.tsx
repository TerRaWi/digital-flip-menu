'use client'

import { db } from '../lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useState } from 'react'
import { createSampleData } from '../lib/database-schema'
import { getMenusWithCategories } from '../lib/api'

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [testResult, setTestResult] = useState('')
  const [sampleResult, setSampleResult] = useState('')
  const [apiResult, setApiResult] = useState('')
  const [restaurantId, setRestaurantId] = useState('')

  const testFirebaseConnection = async () => {
    try {
      const testDoc = await addDoc(collection(db, 'test'), {
        message: 'Hello Firebase!',
        timestamp: new Date()
      })
      
      setTestResult(`✅ Success! Document ID: ${testDoc.id}`)
      setIsConnected(true)
    } catch (error: any) {
      setTestResult(`❌ Error: ${error.message}`)
      setIsConnected(false)
    }
  }

  const testSampleData = async () => {
    try {
      const result = await createSampleData()
      if (result.success) {
        setSampleResult('✅ Sample data created!')
        setRestaurantId(result.restaurantId || '')
      } else {
        setSampleResult(`❌ ${result.error}`)
      }
    } catch (error: any) {
      setSampleResult(`❌ ${error.message}`)
    }
  }

  const testAPI = async () => {
    if (!restaurantId) {
      setApiResult('❌ Create sample data first to get restaurant ID')
      return
    }

    try {
      const result = await getMenusWithCategories(restaurantId)
      if (result.success) {
        const menuCount = result.data.reduce((total: number, category: any) => total + category.menus.length, 0)
        setApiResult(`✅ API works! Found ${result.data.length} categories with ${menuCount} menus`)
      } else {
        setApiResult(`❌ ${result.error}`)
      }
    } catch (error: any) {
      setApiResult(`❌ ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          🔥 Firebase Connection Test
        </h1>
        
        {/* Step 1: Test Firebase Connection */}
        <button 
          onClick={testFirebaseConnection}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors mb-4"
        >
          1. Test Firebase Connection
        </button>

        {testResult && (
          <div className={`p-4 rounded-lg mb-4 ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {testResult}
          </div>
        )}

        {/* Step 2: Create Sample Data */}
        <button 
          onClick={testSampleData}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors mb-4"
          disabled={!isConnected}
        >
          2. Create Sample Data
        </button>

        {sampleResult && (
          <div className="p-4 rounded-lg bg-blue-100 text-blue-800 mb-4">
            {sampleResult}
            {restaurantId && (
              <div className="text-xs mt-2 text-blue-600">
                Restaurant ID: {restaurantId}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Test API Functions */}
        <button 
          onClick={testAPI}
          className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors mb-4"
          disabled={!restaurantId}
        >
          3. Test API Functions
        </button>

        {apiResult && (
          <div className="p-4 rounded-lg bg-yellow-100 text-yellow-800 mb-4">
            {apiResult}
          </div>
        )}

        {/* Navigation Links */}
        {apiResult.includes('✅') && (
          <div className="mt-4 space-y-2">
            <a 
              href="/admin" 
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-lg transition-colors block text-center"
            >
              🛠️ Go to Admin Panel
            </a>
          </div>
        )}

        {/* Project Info */}
        <div className="mt-6 text-sm text-gray-600 border-t pt-4">
          <p>📍 Project: digital-flip-menu</p>
          <p>🗄️ Database: Firestore</p>
          <p>🔐 Auth: Email/Password</p>
          <p>📦 Storage: Enabled</p>
          {restaurantId && (
            <p className="text-xs mt-2 break-all">
              🏪 Restaurant ID: {restaurantId}
            </p>
          )}
        </div>

        {/* Next Steps */}
        {apiResult.includes('✅') && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-bold text-green-800 mb-2">🎉 Ready for next phase!</h3>
            <p className="text-sm text-green-700">
              Database schema and API functions are working. 
              Ready to build Admin Panel.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}