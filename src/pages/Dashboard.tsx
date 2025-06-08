
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, DollarSign, Activity, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const totalBalance = user.wallets.USDC + (user.wallets.BTC * 65000) + (user.wallets.ETH * 3200);

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
      title: "Total Balance",
      value: `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      change: "+2.5%",
      changeType: "positive" as const
    },
    {
      title: "USDC Balance",
      value: `$${user.wallets.USDC.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: Wallet,
      change: "0%",
      changeType: "neutral" as const
    },
    {
      title: "BTC Holdings",
      value: `${user.wallets.BTC} BTC`,
      icon: TrendingUp,
      change: "+5.2%",
      changeType: "positive" as const
    },
    {
      title: "ETH Holdings",
      value: `${user.wallets.ETH} ETH`,
      icon: Activity,
      change: "+1.8%",
      changeType: "positive" as const
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
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Welcome Bonus</p>
                    <p className="text-sm text-muted-foreground">Initial deposit</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-success">+$100.00</p>
                    <p className="text-sm text-muted-foreground">USDC</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">BTC/USD</p>
                    <p className="text-sm text-muted-foreground">Bitcoin</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$65,000</p>
                    <p className="text-sm text-success">+2.5%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">ETH/USD</p>
                    <p className="text-sm text-muted-foreground">Ethereum</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$3,200</p>
                    <p className="text-sm text-success">+1.8%</p>
                  </div>
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
