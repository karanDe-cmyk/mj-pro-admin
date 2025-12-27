import React, { useEffect } from 'react';
import { getToken } from "firebase/messaging";
import { messaging } from './firebase';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Note from "./pages/Note"
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
import FundRequest from './pages/wallet_management/FundRequest';
import OfflinePaymentRecords from './pages/wallet_management/OfflinePaymentRecords';
import WithDrawRequest from './pages/wallet_management/WithDrawRequest';
import AddFund from './pages/wallet_management/AddFund';
import RemoveMoney from './pages/wallet_management/RemoveMoney';
import DeclareResult from './pages/DeclareResult';
import GameName from './pages/starline management/GameName';
import AllBidHistory from './pages/AllBidHistory';
import BidHistory from './pages/starline management/BidHistory';
import ChangePassword from './pages/setting/ChangePassword ';
import GameRates from './pages/starline management/GameRates';
import WinningPrediction from './pages/WinningPrediction';
import DeclareResultStarline from './pages/starline management/DeclareResultStarline';
import AutoDepositHistory from './pages/AutoDepositHistory';
import NoticeManagement from './pages/NoticeManagement';
import ProtectedRoute from './utils/ProtectedRoute';
import MarketDeclareResult from './pages/MarketDeclareResult';
import MainSetting from './pages/setting/MainSetting';
import UserDetails from './pages/UserDetails';
import SliderManagement from './pages/setting/SliderManagement';
import WalletAllDepositeHistory from './pages/wallet_management/AllDepositHistory';
import GalidisawerGameName from './pages/GalidisawerGames/GameName';
import GalidisawerBidHistory from './pages/GalidisawerGames/GalidisawerBidHistory';
import GalidisawerGameRates from './pages/GalidisawerGames/GalidisawerGameRates'
import GalidisawerDeclareResults from "./pages/GalidisawerGames/GalidisawerDeclareResults";
import JackpotGameName from './pages/Jackpot/JackpotGameName';
import JackpotBid from './pages/Jackpot/JackpotBid';
import JackpotGamerates from './pages/Jackpot/JackpotGamerates';
import JackpotDeclareResults from './pages/Jackpot/JackpotDeclareResults';
import Bidrevert from './pages/BidRevert'
import JackpotBidRevert from './pages/Jackpot/Jackpotbidrevert';
import GaliDisawarBidRevert from './pages/GalidisawerGames/Galidisawarbidrevert';
import StarlineRevert from './pages/starline management/Starlinebidrevert';
import FCM from './pages/setting/FCM';
import AutoWithdrawalHistory from './pages/AutoWithdrawalHistory'
import axiosInstance from './utils/axiosInstance'
import NotificationSender from './pages/Custom-Notification'
import ManualDepositsHistory from "./pages/ManualDepositsHistory";
import FundRequestsHistory from "./pages/FundRequestsHistory";
import WithdrawalsHistory from "./pages/WithdrawalsHistory";
import AllDepositebyAdmin from './pages/wallet_management/DepositeByAdmin';
import TotalBidsList from "./pages/TotalBidsList";
import TotalWinsList from "./pages/TotalWinsList";
import GatewayPayment from './pages/XtreemPyament';
import TodayRegister from './pages/TodayRegister';
import TodayRegisterPlayer from './pages/TodayRegisteredPlayed';
import TotalBidPlayers from './pages/TotalBidPlayers';
import TodayBidPlayersPage from './pages/TodayBidPlayersPage';
import TotalNotBidPlayer from './pages/NonBidUsersTillDate'

const App = () => {
  // console.log("isAuthenticated:", localStorage.getItem('isAuthenticated'));
  // console.log("accessToken:", localStorage.getItem('accessToken'));

  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "BBd9yaeCTQ4XIvUmnPmyUZmFZu9k0lcSwf43ZPRa3Ok8RMnNhbNq4Ugbmq1rQaeXLJUfJbR7paZMc8dQF8Tp9OM"
        });
        
        localStorage.setItem('fcmToken', token)

        if (token) {
          await axiosInstance.post("/api/notification/save-fcm-token", {
            token
          });
        }
      }
    };

    requestPermission();
  }, []);


  return (
    <Router>
      <ToastContainer />
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
              <Route path="user-details/:userId" element={<UserDetails />} />
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
              <Route path="all-deposit-history" element={<WalletAllDepositeHistory />} />
              <Route path="fund-request" element={<FundRequest />} />
              <Route path="offline-payment-records" element={<OfflinePaymentRecords />} />
              <Route path="withdraw-request" element={<WithDrawRequest />} />
              <Route path="add-fund" element={<AddFund />} />
              <Route path="remove-money" element={<RemoveMoney />} />
              <Route path="all-deposit-by-admin" element={<AllDepositebyAdmin />} />
            </Route>
            <Route path="starline-management">
              <Route path="game-name" element={<GameName />} />
              <Route path="bid-history" element={<BidHistory />} />
              <Route path="declare-result-starline" element={<DeclareResultStarline />} />
              <Route path="game-rates" element={<GameRates />} />
              <Route path="starline-bid-revert" element={<StarlineRevert />} />

            </Route>
            <Route path="declare-result" element={<DeclareResult />} />
            <Route path="winning-prediction" element={<WinningPrediction />} />
            <Route path="auto-deposit-history" element={<AutoDepositHistory />} />
            <Route path="notice-management" element={<NoticeManagement />} />
            <Route path="notes" element={<Note />} />
            {/* Settings Section */}
            <Route path="settings">
              <Route path="main" element={<MainSetting />} />
              <Route path="ChangePassword" element={<ChangePassword />} />
              <Route path="slider-management" element={<SliderManagement />} />
              <Route path="fcm" element={<FCM />} />
            </Route>
            <Route path="galidisawer-games">
              <Route path="game-list" element={<GalidisawerGameName />} />
              <Route path="bid-history" element={<GalidisawerBidHistory />} />
              <Route path="game-rates" element={<GalidisawerGameRates />} />
              <Route path="declare-result" element={<GalidisawerDeclareResults />} />
              <Route path="galidisawar-bid-revert" element={<GaliDisawarBidRevert />} />

            </Route>
            <Route path="jackpot-games">
              <Route path="jackpot-game-list" element={<JackpotGameName />} />
              <Route path="jackpot-bid-history" element={<JackpotBid />} />
              <Route path="jackpot-game-rates" element={< JackpotGamerates />} />
              <Route path="jackpot-declare-result" element={< JackpotDeclareResults />} />
              <Route path="jackpot-bid-revert" element={<JackpotBidRevert />} />

            </Route>

            <Route path="all-bid-history" element={<AllBidHistory />} />
            <Route path="today-bid-player" element={<TodayBidPlayersPage />} />
            <Route path="total-notbid-player" element={<TotalNotBidPlayer />} />
            <Route path="today-register" element={<TodayRegister />} />
            <Route path="today-register-player" element={<TodayRegisterPlayer />} />
            <Route path="total-bet-player" element={<TotalBidPlayers />} />
            <Route path="auto-withdrawal-history" element={<AutoWithdrawalHistory />} />
            <Route path="manual-deposits-history" element={<ManualDepositsHistory />} />
            <Route path="fund-requests-history" element={<FundRequestsHistory />} />
            <Route path="withdrawals-history" element={<WithdrawalsHistory />} />
            <Route path="custom-notification" element={<NotificationSender />} />
            <Route path="bidrevert" element={<Bidrevert />} />
            <Route path="bids-list" element={<TotalBidsList />} />
            <Route path="wins-list" element={<TotalWinsList />} />

            <Route path="gateway-payment" element={<GatewayPayment />} />
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