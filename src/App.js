import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import PoiList from "./pages/Pois/PoiList";
import PoiCreate from "./pages/Pois/PoiCreate";
import PoiEdit from "./pages/Pois/PoiEdit";
import PoiDetails from "./pages/Pois/PoiDetails";

import MyBookings from "./pages/Bookings/MyBookings";

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  function handleLogout(){
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = '/';
  }

  return (
    <BrowserRouter>
      <Navbar token={token} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Navigate to="/pois" replace />} />
        <Route path="/login" element={<Login onAuth={(t)=>setToken(t)} />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={
          <ProtectedRoute token={token}><Dashboard /></ProtectedRoute>
        } />

        <Route path="/pois" element={<PoiList />} />
        <Route path="/pois/create" element={
          <ProtectedRoute token={token}><PoiCreate /></ProtectedRoute>
        } />
        <Route path="/pois/:id" element={<PoiDetails />} />
        <Route path="/pois/:id/edit" element={
          <ProtectedRoute token={token}><PoiEdit /></ProtectedRoute>
        } />

        <Route path="/bookings" element={
          <ProtectedRoute token={token}><MyBookings /></ProtectedRoute>
        } />

        {/* fallback */}
        <Route path="*" element={<div className="container mt-5">Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}
