import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import App from './App.jsx'
import DataFetch from './components/dataFetch.jsx'
import Reserved from './components/reserved.jsx'
import './index.css'


const router = createBrowserRouter([
  {
    path: '/',
    element: <DataFetch />
    
  },
  {
    path: '/reserved',
    element: <Reserved />
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <RouterProvider router={router} />
  </React.StrictMode>,
)
