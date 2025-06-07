
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpCircle, Wallet, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const WithdrawFunds = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USDC');
  const [withdrawalMethod, setWithdrawalMethod] = useState('bank');
  const [loading, setLoading] = useState(false);

  const handleWithdrawal = async () => {
    const withdrawAmount = parseFloat(amount);
    
    if (!amount || withdrawAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    const availableBalance = user?.wallets[currency as keyof typeof user.wallets] || 0;
    
    if (withdrawAmount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${currency} balance`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate withdrawal processing
    setTimeout(() => {
      toast({
        title: "Withdrawal Request Submitted",
        description: `Your withdrawal of ${withdrawAmount} ${currency} has been submitted for review. Processing time: 1-3 business days.`,
      });
      setAmount('');
      setLoading(false);
    }, 2000);
  };

  if (!user) return null;

  const availableBalance = user.wallets[currency as keyof typeof user.wallets] || 0;
  const minWithdrawal = currency === 'USDC' ? 10 : currency === 'BTC' ? 0.001 : 0.01;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Withdraw Funds</h1>
          <p className="text-muted-foreground">Withdraw your funds to external accounts</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Withdrawal Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpCircle className="w-5 h-5 mr-2" />
                Request Withdrawal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder={`Min: ${minWithdrawal} ${currency}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: {availableBalance.toFixed(currency === 'USDC' ? 2 : 6)} {currency}
                  </p>
                </div>

                <Tabs value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
                    <TabsTrigger value="crypto">Crypto Address</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="bank" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="bank">Bank Account</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bank account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Primary Account - **** 1234</SelectItem>
                          <SelectItem value="savings">Savings Account - **** 5678</SelectItem>
                          <SelectItem value="new">Add New Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="crypto" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="address">Withdrawal Address</Label>
                      <Input
                        id="address"
                        placeholder={`Enter ${currency} address`}
                      />
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <div className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5" />
                        <div className="text-sm">
                          <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                            Double-check the address
                          </p>
                          <p className="text-yellow-700 dark:text-yellow-300">
                            Cryptocurrency transactions are irreversible. Ensure the address is correct.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Fees & Estimates */}
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Withdrawal Amount:</span>
                    <span>{amount || '0'} {currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Network Fee:</span>
                    <span>{currency === 'USDC' ? '0.50' : currency === 'BTC' ? '0.0005' : '0.002'} {currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee:</span>
                    <span>Free</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-medium">
                    <span>You'll Receive:</span>
                    <span>
                      {amount ? (parseFloat(amount) - (currency === 'USDC' ? 0.50 : currency === 'BTC' ? 0.0005 : 0.002)).toFixed(currency === 'USDC' ? 2 : 6) : '0'} {currency}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleWithdrawal} 
                  className="w-full"
                  disabled={loading || !amount || parseFloat(amount) < minWithdrawal}
                >
                  {loading ? 'Processing...' : 'Request Withdrawal'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Balance & Limits */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2" />
                  Available Balance
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Limits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Daily Limit</span>
                    <span className="font-medium">$5,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly Limit</span>
                    <span className="font-medium">$50,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Used Today</span>
                    <span className="font-medium">$0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bank Transfer</span>
                    <span className="font-medium">1-3 business days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cryptocurrency</span>
                    <span className="font-medium">30 minutes - 2 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Withdrawal History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">$500 USDC</p>
                    <p className="text-sm text-muted-foreground">Bank Transfer - Pending</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">2 hours ago</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">0.01 BTC</p>
                    <p className="text-sm text-muted-foreground">Crypto Address - Completed</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WithdrawFunds;
