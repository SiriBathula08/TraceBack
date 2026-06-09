import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Navbar  from './components/Navbar'
import Footer  from './components/Footer'
import Browse          from './pages/Browse'
import Login           from './pages/Login'
import Register        from './pages/Register'
import Dashboard       from './pages/Dashboard'
import ReportLostItem  from './pages/ReportLostItem'
import ReportFoundItem from './pages/ReportFoundItem'
import ItemDetails     from './pages/ItemDetails'
import ClaimItem       from './pages/ClaimItem'
import AdminDashboard  from './pages/AdminDashboard'
import NotFound        from './pages/NotFound'

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return children
}
function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return children
}
function GuestOnly({ children }) {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"         element={<Browse />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route path="/login"    element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
          <Route path="/dashboard"      element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/report-lost"    element={<RequireAuth><ReportLostItem /></RequireAuth>} />
          <Route path="/report-found"   element={<RequireAuth><ReportFoundItem /></RequireAuth>} />
          <Route path="/items/:id/claim" element={<RequireAuth><ClaimItem /></RequireAuth>} />
          <Route path="/admin"          element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
