import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Booking from './pages/Booking'
import OrderDetails from './pages/OrderDetails'
import RideTracker from './pages/RideTracker'
import Payment from './pages/Payment'
import Trips from './pages/Trips'
import Wallet from './pages/Wallet'
import Admin from './pages/Admin'
import Driver from './pages/Driver'
import Company from './pages/Company'
import { useAuth } from './hooks/useAuth'

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user, loading } = useAuth()
  if (loading) return <div />
  if (!user) return <Navigate to="/login" />
  if (role && user.role !== role) return <Navigate to="/home" />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking"
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/:mode"
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-details"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ride-tracker"
        element={
          <ProtectedRoute>
            <RideTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/:bookingId"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips"
        element={
          <ProtectedRoute>
            <Trips />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="ADMIN">
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/*"
        element={
          <ProtectedRoute role="DRIVER">
            <Driver />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/*"
        element={
          <ProtectedRoute role="COMPANY">
            <Company />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="*" element={<div className="p-4">404 - Not Found</div>} />
    </Routes>
  )
}
