
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, TrendingUp, DollarSign, Activity, Crown, Target, Gift } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { fetchTrialLimits, getUserMonthlyDeposits } from "@/utils/jsonbin-api";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trialLimits, setTrialLimits] = useState<any>({});
  const [monthlyDeposits, setMonthlyDeposits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [limits, deposits] = await Promise.all([
        fetchTrialLimits(),
        getUserMonthlyDeposits(user?.id || '')
      ]);
      
      setTrialLimits(limits);
      setMonthlyDeposits(deposits);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  // Expanded wallet with all supported cryptocurrencies
  const expandedWallets = {
    USD: user.wallets.USDC || 100, // Default welcome bonus
    BTC: user.wallets.BTC || 0,
    ETH: user.wallets.ETH || 0,
    BCH: user.wallets.BCH || 0,
    BNB: user.wallets.BNB || 0,
    USDC: user.wallets.USDC_TOKEN || 0
  };

  // Current trial limits
  const currentTrialKey = `trial${user.tier || 1}`;
  const currentLimits = trialLimits[currentTrialKey] || { monthlyMin: 100, monthlyMax: 500 };
  
  // Calculate funding progress
  const fundingProgress = (monthlyDeposits / currentLimits.monthlyMax) * 100;
  const hasWelcomeBonus = expandedWallets.USD >= 100;

  const totalBalance = 
    expandedWallets.USD + 
    (expandedWallets.BTC * 65000) + 
    (expandedWallets.ETH * 3200) + 
    (expandedWallets.BCH * 400) + 
    (expandedWallets.BNB * 600) + 
    expandedWallets.USDC;

  const getTierBadge = (tier: number) => {
    const tierConfig = {
      1: { emoji: '🥉', color: 'bg-gray-500', label: 'Bronze' },
      2: { emoji: '🥈', color: 'bg-gray-400', label: 'Silver' },
      3: { emoji: '🥇', color: 'bg-yellow-500', label: 'Gold' },
      4: { emoji: '💎', color: 'bg-blue-500', label: 'Diamond' },
      5: { emoji: '🔥', color: 'bg-red-500', label: 'Fire' },
      6: { emoji: '⚡', color: 'bg-purple-500', label: 'Lightning' },
      7: { emoji: '🌟', color: 'bg-indigo-500', label: 'Star' },
      8: { emoji: '👑', color: 'bg-pink-500', label: 'Royal' },
      9: { emoji: '🚀', color: 'bg-emerald-500', label: 'Rocket' },
      10: { emoji: '🌌', color: 'bg-cyan-500', label: 'Galaxy' },
      11: { emoji: '🔱', color: 'bg-orange-500', label: 'Trident' },
      12: { emoji: '👑', color: 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500', label: 'Supreme' }
    };
    
    const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig[1];
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.emoji} Tier {tier} - {config.label}
      </Badge>
    );
  };

  const stats = [
    {
      title: "Total Portfolio",
      value: `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      change: "+2.5%",
      changeType: "positive" as const
    },
    {
      title: "USD Balance",
      value: `$${expandedWallets.USD.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: Wallet,
      change: hasWelcomeBonus ? "Welcome Bonus!" : "0%",
      changeType: hasWelcomeBonus ? "positive" : "neutral" as const
    },
    {
      title: "BTC Holdings",
      value: `${expandedWallets.BTC.toFixed(6)} BTC`,
      icon: TrendingUp,
      change: "+5.2%",
      changeType: "positive" as const
    },
    {
      title: "Monthly Deposits",
      value: `$${monthlyDeposits.toLocaleString()}`,
      icon: Activity,
      change: `of $${currentLimits.monthlyMax.toLocaleString()} limit`,
      changeType: "neutral" as const
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section with Tier Badge */}
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <h1 className="text-3xl font-bold">Welcome back, {user.firstName}!</h1>
            {getTierBadge(user.tier || 1)}
          </div>
          <p className="text-muted-foreground">Here's what's happening with your trading account today.</p>
        </div>

        {/* Welcome Bonus Alert */}
        {hasWelcomeBonus && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Gift className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">🎉 Welcome Bonus Active!</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">You have received a $100 welcome bonus in your USD wallet!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Funding Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Monthly Funding Progress - Trial {user.tier || 1}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Deposited this month: ${monthlyDeposits.toLocaleString()}</span>
                <span>Limit: ${currentLimits.monthlyMax.toLocaleString()}</span>
              </div>
              <Progress value={Math.min(fundingProgress, 100)} className="h-3" />
              <div className="text-sm text-muted-foreground">
                You've funded {Math.min(fundingProgress, 100).toFixed(1)}% of your monthly trial limit
                {fundingProgress < 100 && (
                  <span className="text-primary font-medium"> • ${(currentLimits.monthlyMax - monthlyDeposits).toLocaleString()} remaining</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Trial {user.tier || 1} Range: ${currentLimits.monthlyMin.toLocaleString()} - ${currentLimits.monthlyMax.toLocaleString()} per month
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${
                  stat.changeType === 'positive' ? 'text-success' : 
                  stat.changeType === 'neutral' ? 'text-muted-foreground' : 
                  'text-destructive'
                }`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Expanded Wallets Overview */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Currency Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(expandedWallets).map(([currency, balance]) => (
                  <div key={currency} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {currency === 'USD' && '💵'}
                        {currency === 'BTC' && '₿'}
                        {currency === 'ETH' && 'Ξ'}
                        {currency === 'BCH' && '🪙'}
                        {currency === 'BNB' && '🟡'}
                        {currency === 'USDC' && '🔵'}
                      </span>
                      <span className="font-medium">{currency}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {currency === 'USD' || currency === 'USDC' 
                          ? `$${balance.toFixed(2)}`
                          : `${balance.toFixed(6)} ${currency}`
                        }
                      </p>
                      {currency !== 'USD' && currency !== 'USDC' && (
                        <p className="text-xs text-muted-foreground">
                          ≈ $
                          {currency === 'BTC' && (balance * 65000).toFixed(2)}
                          {currency === 'ETH' && (balance * 3200).toFixed(2)}
                          {currency === 'BCH' && (balance * 400).toFixed(2)}
                          {currency === 'BNB' && (balance * 600).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hasWelcomeBonus && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Welcome Bonus</p>
                      <p className="text-sm text-muted-foreground">Initial account credit</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-success">+$100.00</p>
                      <p className="text-sm text-muted-foreground">USD</p>
                    </div>
                  </div>
                )}
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No recent transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
