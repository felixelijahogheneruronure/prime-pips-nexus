
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const TradingRoom = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [orderType, setOrderType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  // Mock market data
  const [marketData, setMarketData] = useState({
    'BTC/USDT': { price: 65000, change: 2.5, volume: '1.2B' },
    'ETH/USDT': { price: 3200, change: 1.8, volume: '800M' },
    'ADA/USDT': { price: 0.45, change: -0.8, volume: '150M' },
    'SOL/USDT': { price: 98.50, change: 4.2, volume: '200M' }
  });

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setMarketData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(pair => {
          const change = (Math.random() - 0.5) * 0.02; // +/- 1% max change
          updated[pair].price *= (1 + change);
          updated[pair].change = ((Math.random() - 0.5) * 10); // Random change %
        });
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleTrade = () => {
    if (!amount || !price) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const totalValue = parseFloat(amount) * parseFloat(price);
    
    toast({
      title: "Trade Executed",
      description: `${orderType.toUpperCase()} order for ${amount} ${selectedPair.split('/')[0]} at $${price} (Total: $${totalValue.toFixed(2)})`,
    });

    // Reset form
    setAmount('');
    setPrice('');
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Trading Room</h1>
          <p className="text-muted-foreground">Trade cryptocurrencies with real-time charts and data</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Market Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(marketData).map(([pair, data]) => (
                  <div 
                    key={pair}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedPair === pair ? 'bg-primary/10' : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedPair(pair)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{pair}</p>
                        <p className="text-sm text-muted-foreground">Vol: {data.volume}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${data.price.toFixed(2)}</p>
                        <p className={`text-sm ${data.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{selectedPair} Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">TradingView Chart</p>
                    <p className="text-sm text-muted-foreground">
                      Real-time {selectedPair} price chart would be displayed here
                    </p>
                    <div className="mt-4 p-4 bg-background rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Current Price:</span>
                        <span className="font-bold text-lg">
                          ${marketData[selectedPair as keyof typeof marketData]?.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">24h Change:</span>
                        <span className={`font-medium ${
                          marketData[selectedPair as keyof typeof marketData]?.change >= 0 
                            ? 'text-success' : 'text-destructive'
                        }`}>
                          {marketData[selectedPair as keyof typeof marketData]?.change >= 0 ? '+' : ''}
                          {marketData[selectedPair as keyof typeof marketData]?.change.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Place Order</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={orderType} onValueChange={setOrderType}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buy" className="text-success">Buy</TabsTrigger>
                    <TabsTrigger value="sell" className="text-destructive">Sell</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="buy" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="buy-amount">Amount ({selectedPair.split('/')[0]})</Label>
                      <Input
                        id="buy-amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="buy-price">Price (USDT)</Label>
                      <Input
                        id="buy-price"
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Total: {amount && price ? `$${(parseFloat(amount) * parseFloat(price)).toFixed(2)}` : '$0.00'}
                    </div>
                    
                    <Button onClick={handleTrade} className="w-full bg-success hover:bg-success/90">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Buy {selectedPair.split('/')[0]}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="sell" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="sell-amount">Amount ({selectedPair.split('/')[0]})</Label>
                      <Input
                        id="sell-amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="sell-price">Price (USDT)</Label>
                      <Input
                        id="sell-price"
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Total: {amount && price ? `$${(parseFloat(amount) * parseFloat(price)).toFixed(2)}` : '$0.00'}
                    </div>
                    
                    <Button onClick={handleTrade} variant="destructive" className="w-full">
                      <TrendingDown className="w-4 h-4 mr-2" />
                      Sell {selectedPair.split('/')[0]}
                    </Button>
                  </TabsContent>
                </Tabs>

                {/* Wallet Balance */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Available Balance</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>USDC:</span>
                      <span>${user.wallets.USDC.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>BTC:</span>
                      <span>{user.wallets.BTC.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ETH:</span>
                      <span>{user.wallets.ETH.toFixed(6)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Trades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="w-16 h-16 mx-auto mb-4" />
              <p>No recent trades. Start trading to see your history here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TradingRoom;
