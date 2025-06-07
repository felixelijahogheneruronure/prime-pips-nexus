
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Wallet, DollarSign, Copy, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const FundAccount = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Deposit Request Submitted",
        description: `Your deposit of $${amount} has been submitted for processing. Funds will be available within 24 hours.`,
      });
      setAmount('');
      setLoading(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  };

  if (!user) return null;

  const cryptoAddresses = {
    BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    ETH: "0x742d35Cc6B3C5f6B3E5c1B7b9e2A1d2F3E4F5a6B",
    USDC: "0x742d35Cc6B3C5f6B3E5c1B7b9e2A1d2F3E4F5a6B"
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Fund Account</h1>
          <p className="text-muted-foreground">Add funds to your trading account</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Deposit Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Deposit Funds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="card">Credit/Debit Card</TabsTrigger>
                  <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
                </TabsList>
                
                <TabsContent value="card" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="amount">Amount (USD)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="100.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="card">Payment Method</Label>
                    <Select defaultValue="visa">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visa">Visa **** 1234</SelectItem>
                        <SelectItem value="mastercard">Mastercard **** 5678</SelectItem>
                        <SelectItem value="new">Add New Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-4 h-4 text-success mr-2" />
                      <span className="text-sm font-medium">Instant Deposit</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Funds will be available immediately after payment confirmation
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleDeposit} 
                    className="w-full"
                    disabled={loading}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {loading ? 'Processing...' : `Deposit $${amount || '0'}`}
                  </Button>
                </TabsContent>
                
                <TabsContent value="crypto" className="space-y-4 mt-4">
                  <div>
                    <Label>Select Cryptocurrency</Label>
                    <Select defaultValue="USDC">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                        <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Deposit Addresses</Label>
                    {Object.entries(cryptoAddresses).map(([currency, address]) => (
                      <div key={currency} className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{currency}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(address)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground break-all">
                          {address}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Important:</strong> Only send the selected cryptocurrency to the corresponding address. 
                      Sending other cryptocurrencies may result in permanent loss.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Current Balance & Limits */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2" />
                  Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">USDC</span>
                    <span className="font-medium">${user.wallets.USDC.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">BTC</span>
                    <span className="font-medium">{user.wallets.BTC.toFixed(6)} BTC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ETH</span>
                    <span className="font-medium">{user.wallets.ETH.toFixed(6)} ETH</span>
                  </div>
                  <hr />
                  <div className="flex justify-between items-center font-medium">
                    <span>Total USD Value</span>
                    <span>${(user.wallets.USDC + (user.wallets.BTC * 65000) + (user.wallets.ETH * 3200)).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deposit Limits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Daily Limit</span>
                    <span className="font-medium">$10,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly Limit</span>
                    <span className="font-medium">$100,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Used Today</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Deposits */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="w-16 h-16 mx-auto mb-4" />
              <p>No recent deposits. Your deposit history will appear here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FundAccount;
