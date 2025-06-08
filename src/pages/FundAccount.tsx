
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Wallet, DollarSign, Copy, CheckCircle, Clock, Mail, QrCode, Search } from "lucide-react";
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
  const [timeLeft, setTimeLeft] = useState(300);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [countryFilter, setCountryFilter] = useState('');
  const [agentNameFilter, setAgentNameFilter] = useState('');

  useEffect(() => {
    loadApprovedAgents();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && selectedAgent) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, selectedAgent]);

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

  const handleCardPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate Stripe payment processing
    setTimeout(() => {
      toast({
        title: "Stripe Payment Processing",
        description: `Your card payment of $${amount} is being processed. You will be redirected to Stripe checkout.`,
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

  const startAgentTransfer = (agent: any) => {
    setSelectedAgent(agent);
    setTimeLeft(300); // Reset timer to 5 minutes
  };

  if (!user) return null;

  const cryptoAddresses = {
    'USDT (ERC-20/BNB)': "0x03a5bcd790171c6241b5ef8334d1a1b957fea3ce",
    'USDC': "0x03a5bcd790171c6241b5ef8334d1a1b957fea3ce",
    'BTC': "bc1qrlleet4v67nmsznd076mnu5839qxp6zq5zt294",
    'ETH': "0x03a5bcd790171c6241b5ef8334d1a1b957fea3ce",
    'BCH': "0x03a5bcd790171c6241b5ef8334d1a1b957fea3ce",
    'BNB': "0x03a5bcd790171c6241b5ef8334d1a1b957fea3ce"
  };

  const filteredAgents = approvedAgents.filter(agent => {
    const matchesCountry = !countryFilter || agent.country?.toLowerCase().includes(countryFilter.toLowerCase());
    const matchesName = !agentNameFilter || agent.bankUserName?.toLowerCase().includes(agentNameFilter.toLowerCase());
    return matchesCountry && matchesName;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Fund Account</h1>
          <p className="text-muted-foreground">Add funds to your trading account</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Funding Section */}
          <div className="lg:col-span-2">
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
                    <TabsTrigger value="card">💳 Card Payments</TabsTrigger>
                    <TabsTrigger value="crypto">🪙 Cryptocurrency</TabsTrigger>
                    <TabsTrigger value="agent">👤 Agent Transfer</TabsTrigger>
                  </TabsList>
                  
                  {/* Card Payment Tab */}
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
                        <span className="text-sm font-medium">Secure Stripe Processing</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Powered by Stripe. Funds available immediately after payment confirmation.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleCardPayment} 
                      className="w-full"
                      disabled={loading}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      {loading ? 'Processing...' : `Pay with Card $${amount || '0'}`}
                    </Button>
                  </TabsContent>
                  
                  {/* Cryptocurrency Tab */}
                  <TabsContent value="crypto" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <Label className="text-lg font-medium">Select Cryptocurrency</Label>
                      
                      {Object.entries(cryptoAddresses).map(([currency, address]) => (
                        <div key={currency} className="p-4 bg-muted rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-medium text-lg">{currency}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(address)}
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                          <div className="bg-background p-3 rounded border">
                            <p className="text-xs text-muted-foreground break-all font-mono">
                              {address}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {/* Binance Pay Section */}
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-2 border-yellow-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-lg">💰 Binance Pay</span>
                          <QrCode className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                          <div className="w-32 h-32 bg-white mx-auto mb-3 border rounded flex items-center justify-center">
                            <QrCode className="w-16 h-16 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium">Scan QR with Binance App to pay</p>
                          <p className="text-xs text-muted-foreground mt-1">Fast and secure payment via Binance</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Important:</strong> After sending payment, screenshot your transaction and email it to: 
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
                  </TabsContent>

                  {/* Agent Transfer Tab */}
                  <TabsContent value="agent" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      {/* Agent Search and Filter */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="countryFilter">Filter by Country</Label>
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="countryFilter"
                              placeholder="Enter country name..."
                              value={countryFilter}
                              onChange={(e) => setCountryFilter(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="agentNameFilter">Filter by Agent Name</Label>
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="agentNameFilter"
                              placeholder="Enter agent name..."
                              value={agentNameFilter}
                              onChange={(e) => setAgentNameFilter(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      {selectedAgent && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-2 border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-lg">Transfer in Progress</h4>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span className="font-mono text-lg font-bold text-red-600">
                                {formatTime(timeLeft)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Bank:</span>
                                <p className="font-medium">{selectedAgent.bankName}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Account:</span>
                                <p className="font-mono font-medium">{selectedAgent.accountNumber}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Name:</span>
                                <p className="font-medium">{selectedAgent.bankUserName}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Country:</span>
                                <p className="font-medium">{selectedAgent.country || 'N/A'}</p>
                              </div>
                            </div>
                            
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Mail className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">Send Transfer Receipt</span>
                              </div>
                              <p className="text-xs text-blue-800 dark:text-blue-200">
                                After transfer, send screenshot to: 
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
                        </div>
                      )}
                      
                      {!selectedAgent && (
                        <div className="space-y-4">
                          <Label className="text-lg font-medium">Available Agent Accounts</Label>
                          
                          {filteredAgents.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <p>No approved agent accounts available.</p>
                              <p className="text-sm mt-2">Try adjusting your filters or check back later.</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {filteredAgents.map((agent) => (
                                <Card key={agent.id} className="border-2 hover:border-primary/50 transition-colors">
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                      <div className="space-y-2">
                                        <h4 className="font-medium">{agent.bankName}</h4>
                                        <p className="text-sm text-muted-foreground">{agent.bankUserName}</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                          <span><strong>Account:</strong> {agent.accountNumber}</span>
                                          <span><strong>Country:</strong> {agent.country || 'N/A'}</span>
                                        </div>
                                      </div>
                                      <Button
                                        size="sm"
                                        onClick={() => startAgentTransfer(agent)}
                                      >
                                        Select Agent
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
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

            <Card>
              <CardHeader>
                <CardTitle>Payment Instructions</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p><strong>Important:</strong></p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Send payment receipt to: <span className="font-mono">primepipsexchange@gmail.com</span></li>
                  <li>• Include your account email in transfer description</li>
                  <li>• Funds credited within 24 hours after verification</li>
                  <li>• Agent transfers have a 5-minute confirmation window</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FundAccount;
