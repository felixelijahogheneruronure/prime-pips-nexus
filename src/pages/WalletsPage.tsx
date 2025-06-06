
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";

const WalletsPage = () => {
  const { user } = useAuth();

  if (!user) return null;

  const wallets = [
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: user.wallets.USDC,
      usdValue: user.wallets.USDC,
      change: 0,
      icon: '💵'
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: user.wallets.BTC,
      usdValue: user.wallets.BTC * 65000,
      change: 2.5,
      icon: '₿'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: user.wallets.ETH,
      usdValue: user.wallets.ETH * 3200,
      change: 1.8,
      icon: 'Ξ'
    }
  ];

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.usdValue, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Wallets</h1>
          <p className="text-muted-foreground">Manage your cryptocurrency and fiat balances</p>
        </div>

        {/* Total Balance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="w-5 h-5" />
              <span>Total Portfolio Value</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-success">+2.1% from last 24h</p>
          </CardContent>
        </Card>

        {/* Wallets Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wallets.map((wallet) => (
            <Card key={wallet.symbol}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {wallet.name} ({wallet.symbol})
                </CardTitle>
                <span className="text-2xl">{wallet.icon}</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {wallet.balance.toLocaleString(undefined, { 
                    minimumFractionDigits: wallet.symbol === 'USDC' ? 2 : 6 
                  })} {wallet.symbol}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-muted-foreground">
                    ${wallet.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  {wallet.change !== 0 && (
                    <div className={`flex items-center text-xs ${
                      wallet.change > 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {wallet.change > 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(wallet.change)}%
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WalletsPage;
