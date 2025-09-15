'use client'

import { db } from '../lib/firebase'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { useState, useEffect } from 'react'

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [testResult, setTestResult] = useState('')

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          🔥 Firebase Connection Test
        </h1>
        
        <button 
          onClick={testFirebaseConnection}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors mb-4"
        >
          Test Firebase Connection
        </button>
        
        {testResult && (
          <div className={`p-4 rounded-lg ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {testResult}
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-600">
          <p>📍 Project: digital-flip-menu</p>
          <p>🗄️ Database: Firestore</p>
          <p>🔐 Auth: Email/Password</p>
          <p>📦 Storage: Enabled</p>
        </div>
      </div>
    </div>
  )
}