
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, DollarSign, Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const totalBalance = user.wallets.USDC + (user.wallets.BTC * 65000) + (user.wallets.ETH * 3200);

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
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.firstName}!</h1>
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
