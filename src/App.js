import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ApprovedUsers from './pages/ApprovedUsers';
import UnapprovedUsers from './pages/UnapprovedUsers';
import GameManagement from './pages/GameManagement';
import GameRate from './pages/GameRate';
import OnOffMarket from './pages/OnOffMarket';
import UsersBidHistory from './pages/UsersBidHistory';
import BidDateWise from './pages/BidDateWise';
import WinningHistory from './pages/WinningHistory';
import BetList from './pages/BetList';
import Singledigit from './pages/game_and_number/Singledigit';
import JodiDigit from './pages/game_and_number/JodiDigit';
import SinglePana from './pages/game_and_number/SinglePana';

const App = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={isAuthenticated ? <AdminPanel /> : <Navigate to="/" />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="user-management">
            <Route path="approved" element={<ApprovedUsers />} />
            <Route path="unapproved" element={<UnapprovedUsers />} />
          </Route>
          <Route path="game-management">
            <Route path="game-name" element={<GameManagement />} />
            <Route path="game-rates" element={<GameRate />} />
            <Route path="on-off-market" element={<OnOffMarket />} />
            <Route path="bit-history" element={<UsersBidHistory />} />
            <Route path="bid-date" element={<BidDateWise />} />
            <Route path="bet-list" element={<BetList />} />
            <Route path="winning-history" element={<WinningHistory />} />
            {/* <Route path="unapproved" element={<UnapprovedUsers />} /> */}
          </Route>s
          <Route path="game-number">
            <Route path="single-digit" element={<Singledigit />} />
            <Route path="jodi-digit" element={<JodiDigit />} />
            <Route path="single-pana" element={<SinglePana />} />
            <Route path="double-pana" element={<UsersBidHistory />} />
            <Route path="triple-pana" element={<BidDateWise />} />
            <Route path="half-sangam" element={<BetList />} />
            <Route path="full-sangam" element={<WinningHistory />} />
            {/* <Route path="unapproved" element={<UnapprovedUsers />} /> */}
          </Route>
          {/* <Route path="game-management" element={<GameManagement />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
