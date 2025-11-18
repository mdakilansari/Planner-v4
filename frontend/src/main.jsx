import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWrapper from './App.jsx'
import './index.css'

// The AppWrapper contains the QueryClientProvider and ToastProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper /> 
  </React.StrictMode>,
)
