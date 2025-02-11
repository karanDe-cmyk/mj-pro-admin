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
import DoublePana from './pages/game_and_number/DoublePana';
import TriplePana from './pages/game_and_number/TriplePana';
import HalfSangam from './pages/game_and_number/HalfSangam';
import FullSangam from './pages/game_and_number/FullSangam';
import AllFundRequest from './pages/wallet_management/AllFundRequest';
import FundRequest from './pages/wallet_management/FundRequest';
import OfflinePaymentRecords from './pages/wallet_management/OfflinePaymentRecords';
import WithDrawRequest from './pages/wallet_management/WithDrawRequest';
import AddFund from './pages/wallet_management/AddFund';
import RemoveMoney from './pages/wallet_management/RemoveMoney';
import DeclareResult from './pages/DeclareResult';
import GameName from './pages/starline management/GameName';
import AllBidHistory from './pages/AllBidHistory';
import BidHistory from './pages/starline management/BidHistory';

import GameRates from './pages/starline management/GameRates';
import WinningPrediction from './pages/WinningPrediction';
import DeclareResultStarline from './pages/starline management/DeclareResultStarline';
import AutoDepositHistory from './pages/AutoDepositHistory';
import NoticeManagement from './pages/NoticeManagement';
import ProtectedRoute from './utils/ProtectedRoute';
import MarketDeclareResult from './pages/MarketDeclareResult';
import MainSetting from './pages/setting/MainSetting';
import BankDetails from './pages/setting/BankDetails';
import AppLinks from './pages/setting/AppLinks';
import UPISettings from "./pages/setting/UPISettings"; // Import the component
import HomeTitleSettings from "./pages/setting/HomeTitleSettings"; // Import the component
import OtherSettings from "./pages/setting/OtherSettings"; // Import the component
import HowToPlay from "./pages/setting/HowToPlay"; // Import the component
import ReferEarn from "./pages/setting/ReferEarn"; // Import the component
import WelcomeSettings from "./pages/setting/WelcomeSettings"; // Import the component
import UserDetails from './pages/UserDetails';
import QrCode from './pages/setting/QrCode';



const App = () => {
  // console.log("isAuthenticated:", localStorage.getItem('isAuthenticated'));
  // console.log("accessToken:", localStorage.getItem('accessToken'));

  return (
    <Router>
      <Routes>
        {/* Public Route - Login */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes - Only accessible if logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminPanel />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="user-management">
              <Route path="approved" element={<ApprovedUsers />} />
              <Route path="unapproved" element={<UnapprovedUsers />} />
            </Route>
            <Route path="game-management">
              <Route path="game-name" element={<GameManagement />} />
              <Route path="game-rates" element={<GameRate />} />
              <Route path="declare-market-result" element={<MarketDeclareResult />} />
              <Route path="on-off-market" element={<OnOffMarket />} />
              <Route path="bit-history" element={<UsersBidHistory />} />
              <Route path="bid-date" element={<BidDateWise />} />
              <Route path="bet-list" element={<BetList />} />
              <Route path="winning-history" element={<WinningHistory />} />
            </Route>
            <Route path="game-number">
              <Route path="single-digit" element={<Singledigit />} />
              <Route path="jodi-digit" element={<JodiDigit />} />
              <Route path="single-pana" element={<SinglePana />} />
              <Route path="double-pana" element={<DoublePana />} />
              <Route path="triple-pana" element={<TriplePana />} />
              <Route path="half-sangam" element={<HalfSangam />} />
              <Route path="full-sangam" element={<FullSangam />} />
            </Route>
            <Route path="wallet-management">
              <Route path="all-fund-request" element={<AllFundRequest />} />
              <Route path="fund-request" element={<FundRequest />} />
              <Route path="offline-payment-records" element={<OfflinePaymentRecords />} />
              <Route path="withdraw-request" element={<WithDrawRequest />} />
              <Route path="add-fund" element={<AddFund />} />
              <Route path="remove-money" element={<RemoveMoney />} />
            </Route>
            <Route path="starline-management">
              <Route path="game-name" element={<GameName />} />
              
              <Route path="bid-history" element={<BidHistory />} />
              <Route path="declare-result-starline" element={<DeclareResultStarline />} />
              <Route path="game-rates" element={<GameRates />} />
            </Route>
            <Route path="declare-result" element={<DeclareResult />} />
            <Route path="winning-prediction" element={<WinningPrediction />} />
            <Route path="auto-deposit-history" element={<AutoDepositHistory />} />
            <Route path="notice-management" element={<NoticeManagement />} />

            {/* Settings Section */}
            <Route path="settings">
              <Route path="main" element={<MainSetting />} />   {/* General Settings */}
              <Route path="bank-details" element={<BankDetails />} />   {/* Bank Details */}
              <Route path="app-links" element={<AppLinks />} />   {/* App Links Management */}
              <Route path="upi-payment" element={<UPISettings />} />
              <Route path="home-title" element={<HomeTitleSettings />} />
              <Route path="other-settings" element={<OtherSettings />} />
              <Route path="how-to-play" element={<HowToPlay />} />
              <Route path="refer-earn" element={<ReferEarn />} />
              <Route path="welcome-settings" element={<WelcomeSettings />} />
              <Route path="qr-code" element={<QrCode />} />
            </Route>
            <Route path="all-bid-history" element={<AllBidHistory />} />
          </Route>

          <Route path="/user-details/:userId" element={<UserDetails />} />
        </Route>

        {/* Catch-All Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;