
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  ArrowUpCircle, 
  ArrowRightLeft, 
  MessageCircle, 
  Settings, 
  LogOut,
  TrendingUp as Logo,
  Menu,
  X,
  UserPlus,
  Users,
  Shield
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const userNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Wallets', href: '/wallets', icon: Wallet },
  { name: 'Trading Room', href: '/trading', icon: TrendingUp },
  { name: 'Fund Account', href: '/fund', icon: CreditCard },
  { name: 'Withdraw Funds', href: '/withdraw', icon: ArrowUpCircle },
  { name: 'Transfer Funds', href: '/transfer', icon: ArrowRightLeft },
  { name: 'Become an Agent', href: '/become-agent', icon: UserPlus },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const adminNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'User Management', href: '/admin', icon: Shield },
  { name: 'Our Agents', href: '/our-agents', icon: Users },
  { name: 'Account Details', href: '/account-details', icon: CreditCard },
  { name: 'Notifications', href: '/notifications', icon: MessageCircle },
  { name: 'Wallets', href: '/wallets', icon: Wallet },
  { name: 'Trading Room', href: '/trading', icon: TrendingUp },
  { name: 'Fund Account', href: '/fund', icon: CreditCard },
  { name: 'Withdraw Funds', href: '/withdraw', icon: ArrowUpCircle },
  { name: 'Transfer Funds', href: '/transfer', icon: ArrowRightLeft },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  // Select navigation based on user role
  const navigation = user.role === 'admin' ? adminNavigation : userNavigation;

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Logo className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Prime Pips</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-muted-foreground capitalize flex items-center">
                  {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                  {user.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm
                    ${isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen w-full">
        {/* Mobile header */}
        <header className="lg:hidden bg-card border-b p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Logo className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold">Prime Pips</span>
            </Link>
            <div className="w-8" /> {/* Spacer */}
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 w-full">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
