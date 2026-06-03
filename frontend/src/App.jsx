import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Referral from "./pages/Referral";
import Plans from "./pages/Plans";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Converter from "./pages/Converter";
import Transactions from "./pages/Transactions";
import Support from "./pages/Support";
import Tasks from "./pages/Tasks";
import ProductDetails from "./pages/ProductDetails";
import ActiveInvestments from "./pages/Active";
import UnitDetails from "./pages/UnitDetails";
import DepositProof from "./pages/DepositProof";

// ✅ ADMIN PAGES
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import AdminModels from "./pages/AdminModels";
import AdminCampaigns from "./pages/AdminCampaigns";
import AdminSettings from "./pages/AdminSettings";
import AdminRegister from "./pages/AdminRegister";
import AdminLogin from "./pages/AdminLogin";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute
from "./components/AdminProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= USER SIDE ================= */}
        <Route element={<Layout />}>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
          <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
          <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/converter" element={<ProtectedRoute><Converter /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          <Route path="/active" element={<ProtectedRoute><ActiveInvestments /></ProtectedRoute>} />
          <Route path="/unit/:id" element={<ProtectedRoute><UnitDetails /></ProtectedRoute>} />
          <Route path="/deposit-proof" element={<ProtectedRoute><DepositProof /></ProtectedRoute>} />
        </Route>

        {/* ================= ADMIN SIDE ================= */}

      <Route path="/admin-login" element={<AdminLogin />} />

      <Route path="/admin-register" element={<AdminRegister />} />

      <Route element={<AdminLayout />}>

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <Admin />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin-users"
          element={
            <AdminProtectedRoute>
              <AdminUsers />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin-models"
          element={
            <AdminProtectedRoute>
              <AdminModels />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin-campaigns"
          element={
            <AdminProtectedRoute>
              <AdminCampaigns />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin-settings"
          element={
            <AdminProtectedRoute>
              <AdminSettings />
            </AdminProtectedRoute>
          }
        />

      </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;