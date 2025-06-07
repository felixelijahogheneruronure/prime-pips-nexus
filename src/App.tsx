
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import WalletsPage from "./pages/WalletsPage";
import TradingRoom from "./pages/TradingRoom";
import FundAccount from "./pages/FundAccount";
import WithdrawFunds from "./pages/WithdrawFunds";
import TransferFunds from "./pages/TransferFunds";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import BecomeAgent from "./pages/BecomeAgent";
import OurAgents from "./pages/OurAgents";
import AccountDetails from "./pages/AccountDetails";
import NotificationsPage from "./pages/NotificationsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/wallets" element={<WalletsPage />} />
            <Route path="/trading" element={<TradingRoom />} />
            <Route path="/fund" element={<FundAccount />} />
            <Route path="/withdraw" element={<WithdrawFunds />} />
            <Route path="/transfer" element={<TransferFunds />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/become-agent" element={<BecomeAgent />} />
            <Route path="/our-agents" element={<OurAgents />} />
            <Route path="/account-details" element={<AccountDetails />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
