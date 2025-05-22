import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NavigationProvider } from './context/NavigationContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import BidDetail from './pages/BidDetail';
import ListSimulator from './pages/ListSimulator';
import CompanySearch from './pages/CompanySearch';
import PriceSimulatorDetail from './pages/PriceSimulatorDetail';
import BidResultDetail from './pages/BidResultDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProjectsList from './pages/ProjectsList';
import BidsList from './pages/BidsList';
import BidResultsList from './pages/BidResultsList';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute from './components/PrivateRoute';
import AchievementDetail from './pages/AchievementDetail';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NavigationProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
              <Route path="/bid/:id" element={<PrivateRoute><BidDetail /></PrivateRoute>} />
              <Route path="/price-simulator" element={<PrivateRoute><PriceSimulatorDetail /></PrivateRoute>} />
              <Route path="/list-simulator" element={<PrivateRoute><ListSimulator /></PrivateRoute>} />
              <Route path="/company-search" element={<PrivateRoute><CompanySearch /></PrivateRoute>} />
              <Route path="/bid-result/:id" element={<PrivateRoute><BidResultDetail /></PrivateRoute>} />
              <Route path="/project/:project_id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/projects-list" element={<PrivateRoute><ProjectsList /></PrivateRoute>} />
              <Route path="/bids-list" element={<PrivateRoute><BidsList /></PrivateRoute>} />
              <Route path="/bid-results-list" element={<PrivateRoute><BidResultsList /></PrivateRoute>} />
              <Route path="/achievement/:id" element={<PrivateRoute><AchievementDetail /></PrivateRoute>} />
            </Routes>
          </Router>
        </NavigationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
