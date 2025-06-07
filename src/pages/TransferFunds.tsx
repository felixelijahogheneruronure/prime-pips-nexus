
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft, Wallet, Users, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const TransferFunds = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USDC');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    const transferAmount = parseFloat(amount);
    
    if (!amount || transferAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (!recipient) {
      toast({
        title: "Error",
        description: "Please enter recipient email or user ID",
        variant: "destructive"
      });
      return;
    }

    const availableBalance = user?.wallets[currency as keyof typeof user.wallets] || 0;
    
    if (transferAmount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${currency} balance`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate transfer processing
    setTimeout(() => {
      toast({
        title: "Transfer Successful",
        description: `Successfully transferred ${transferAmount} ${currency} to ${recipient}`,
      });
      setAmount('');
      setRecipient('');
      setLoading(false);
    }, 2000);
  };

  if (!user) return null;

  const availableBalance = user.wallets[currency as keyof typeof user.wallets] || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Transfer Funds</h1>
          <p className="text-muted-foreground">Send funds to other Prime Pips users instantly</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Transfer Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowRightLeft className="w-5 h-5 mr-2" />
                Send Transfer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipient">Recipient</Label>
                  <Input
                    id="recipient"
                    placeholder="Enter email or user ID"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the recipient's email address or Prime Pips user ID
                  </p>
                </div>

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
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: {availableBalance.toFixed(currency === 'USDC' ? 2 : 6)} {currency}
                  </p>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount((availableBalance * 0.25).toFixed(currency === 'USDC' ? 2 : 6))}
                  >
                    25%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount((availableBalance * 0.5).toFixed(currency === 'USDC' ? 2 : 6))}
                  >
                    50%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount((availableBalance * 0.75).toFixed(currency === 'USDC' ? 2 : 6))}
                  >
                    75%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(availableBalance.toFixed(currency === 'USDC' ? 2 : 6))}
                  >
                    Max
                  </Button>
                </div>

                {/* Transfer Summary */}
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Transfer Amount:</span>
                    <span>{amount || '0'} {currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Transfer Fee:</span>
                    <span className="text-success">Free</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-medium">
                    <span>Recipient Receives:</span>
                    <span>{amount || '0'} {currency}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleTransfer} 
                  className="w-full"
                  disabled={loading || !amount || !recipient}
                >
                  {loading ? 'Processing...' : 'Send Transfer'}
                </Button>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-blue-800 dark:text-blue-200 font-medium">
                        Instant Transfer
                      </p>
                      <p className="text-blue-700 dark:text-blue-300">
                        Internal transfers between Prime Pips users are processed instantly with no fees.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Balance & Recent Transfers */}
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
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Quick Transfer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-3">Frequent Recipients</p>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setRecipient('demo@primepips.com')}
                    >
                      demo@primepips.com
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setRecipient('admin@primepips.com')}
                    >
                      admin@primepips.com
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transfer History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <ArrowRightLeft className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Sent $50 USDC</p>
                    <p className="text-sm text-muted-foreground">To: demo@primepips.com</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Received $25 USDC</p>
                    <p className="text-sm text-muted-foreground">From: admin@primepips.com</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransferFunds;
