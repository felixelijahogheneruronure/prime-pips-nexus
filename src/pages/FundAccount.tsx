
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Wallet, DollarSign, Copy, CheckCircle, Clock, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { fetchAccountDetails } from "@/utils/jsonbin-api";
import { useToast } from "@/hooks/use-toast";

const FundAccount = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [approvedAgents, setApprovedAgents] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    loadApprovedAgents();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const loadApprovedAgents = async () => {
    try {
      const accountDetails = await fetchAccountDetails();
      const approved = accountDetails.filter(acc => acc.status === 'approved');
      setApprovedAgents(approved);
    } catch (error) {
      console.error('Error loading approved agents:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
      description: "Information copied to clipboard",
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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="card">Credit/Debit</TabsTrigger>
                  <TabsTrigger value="crypto">Crypto</TabsTrigger>
                  <TabsTrigger value="agent">Agent Transfer</TabsTrigger>
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

                <TabsContent value="agent" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-lg font-medium">Available Agent Accounts</Label>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Time remaining: {formatTime(timeLeft)}</span>
                      </div>
                    </div>
                    
                    {approvedAgents.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No approved agent accounts available at the moment.</p>
                        <p className="text-sm mt-2">Please try other payment methods or check back later.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {approvedAgents.map((agent) => (
                          <Card key={agent.id} className="border-2 border-primary/20">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{agent.bankName}</h4>
                                    <p className="text-sm text-muted-foreground">{agent.bankUserName}</p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(agent.accountNumber)}
                                  >
                                    <Copy className="w-3 h-3 mr-1" />
                                    Copy
                                  </Button>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Account:</span>
                                    <p className="font-mono font-medium">{agent.accountNumber}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Name:</span>
                                    <p className="font-medium">{agent.bankUserName}</p>
                                  </div>
                                </div>
                                
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium">Send Transfer Receipt</span>
                                  </div>
                                  <p className="text-xs text-blue-800 dark:text-blue-200">
                                    After making the transfer, please send a screenshot of your transfer receipt to: 
                                    <span className="font-mono font-medium"> primepipsexchange@gmail.com</span>
                                  </p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-2"
                                    onClick={() => copyToClipboard('primepipsexchange@gmail.com')}
                                  >
                                    <Copy className="w-3 h-3 mr-1" />
                                    Copy Email
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Important Instructions:</strong>
                          </p>
                          <ul className="text-xs text-yellow-800 dark:text-yellow-200 mt-2 space-y-1">
                            <li>• Transfer the exact amount you want to deposit</li>
                            <li>• Include your account email in the transfer description</li>
                            <li>• Send the transfer receipt to primepipsexchange@gmail.com</li>
                            <li>• Funds will be credited within 24 hours after verification</li>
                          </ul>
                        </div>
                      </div>
                    )}
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
