import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ApprovedUsers from './pages/ApprovedUsers';
import UnapprovedUsers from './pages/UnapprovedUsers';

const App = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={isAuthenticated ? <AdminPanel /> : <Navigate to="/" />}
        >
        
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="user-management">
            <Route path="approved" element={<ApprovedUsers />} />
            <Route path="unapproved" element={<UnapprovedUsers />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
