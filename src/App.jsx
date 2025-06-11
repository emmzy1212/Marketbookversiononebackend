import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLogin from './pages/AdminLogin'
import AdminRegister from './pages/AdminRegister'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import useAuth from './hooks/useAuth.jsx'

function App() {
  const { user } = useAuth()

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin/login" 
          element={!user ? <AdminLogin /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin/register" 
          element={!user ? <AdminRegister /> : <Navigate to="/" />} 
        />
        <Route 
          path="/profile" 
          element={user ? <Profile /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/dashboard" 
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
        />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  )
}

export default App