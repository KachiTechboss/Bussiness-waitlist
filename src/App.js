import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CustomerView from './pages/CustomerView';
import NotFound from './pages/NotFound';

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRole="business">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/customer"
              element={
                <ProtectedRoute allowedRole="customer">
                  <CustomerView waitlistId={null} />
                </ProtectedRoute>
              }
            />
            
            <Route path="/queue/:waitlistId" element={<CustomerView />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
