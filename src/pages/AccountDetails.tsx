
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, CreditCard, Building } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAccountDetails, updateAccountDetails } from "@/utils/jsonbin-api";
import { useToast } from "@/hooks/use-toast";

const AccountDetails = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [accountDetails, setAccountDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  useEffect(() => {
    loadAccountDetails();
  }, []);

  const loadAccountDetails = async () => {
    try {
      const details = await fetchAccountDetails();
      setAccountDetails(details);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load account details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (accountData: any) => {
    try {
      const newAccount = {
        id: `acc-${Date.now()}`,
        ...accountData,
        status: user?.role === 'admin' ? 'approved' : 'pending',
        createdBy: user?.id,
        createdAt: new Date().toISOString()
      };

      const updatedAccounts = [...accountDetails, newAccount];
      await updateAccountDetails(updatedAccounts);
      setAccountDetails(updatedAccounts);
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Success",
        description: user?.role === 'admin' ? "Account details created and approved" : "Account details submitted for approval"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account details",
        variant: "destructive"
      });
    }
  };

  const handleUpdateAccount = async (accountData: any) => {
    try {
      const updatedAccounts = accountDetails.map(acc => 
        acc.id === selectedAccount.id ? { ...acc, ...accountData, updatedAt: new Date().toISOString() } : acc
      );
      await updateAccountDetails(updatedAccounts);
      setAccountDetails(updatedAccounts);
      setIsEditDialogOpen(false);
      setSelectedAccount(null);
      
      toast({
        title: "Success",
        description: "Account details updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account details",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      const updatedAccounts = accountDetails.filter(acc => acc.id !== accountId);
      await updateAccountDetails(updatedAccounts);
      setAccountDetails(updatedAccounts);
      
      toast({
        title: "Success",
        description: "Account details deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account details",
        variant: "destructive"
      });
    }
  };

  const handleApproveAccount = async (accountId: string) => {
    try {
      const updatedAccounts = accountDetails.map(acc => 
        acc.id === accountId ? { ...acc, status: 'approved', approvedAt: new Date().toISOString() } : acc
      );
      await updateAccountDetails(updatedAccounts);
      setAccountDetails(updatedAccounts);
      
      toast({
        title: "Success",
        description: "Account details approved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve account details",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge variant="default">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const userAccounts = user?.role === 'admin' ? accountDetails : accountDetails.filter(acc => acc.createdBy === user?.id);
  const approvedAccounts = accountDetails.filter(acc => acc.status === 'approved');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <CreditCard className="w-8 h-8 mr-3" />
            Account Details Management
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'admin' ? 'Manage all account details' : 'Submit and manage your account details'}
          </p>
        </div>

        {/* Show approved accounts for funding to all users */}
        {user?.role !== 'admin' && approvedAccounts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                <Building className="w-5 h-5 inline mr-2" />
                Approved Funding Accounts
              </CardTitle>
              <p className="text-muted-foreground">Use these account details for funding your account</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {approvedAccounts.map((account) => (
                  <Card key={account.id} className="border-primary/20">
                    <CardContent className="p-4">
                      <h4 className="font-medium">{account.bankName}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{account.bankUserName}</p>
                      <div className="space-y-1 text-sm">
                        <p><strong>Account:</strong> {account.accountNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          Send receipt to: primepipsexchange@gmail.com
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {user?.role === 'admin' ? 'All Account Details' : 'Your Account Details'}
            </CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Account Details
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Account Details</DialogTitle>
                </DialogHeader>
                <AccountDetailsForm onSubmit={handleCreateAccount} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading account details...</div>
            ) : userAccounts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No account details found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bank Name</TableHead>
                    <TableHead>Account Holder</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.bankName}</TableCell>
                      <TableCell>{account.bankUserName}</TableCell>
                      <TableCell>{account.accountNumber}</TableCell>
                      <TableCell>{getStatusBadge(account.status)}</TableCell>
                      <TableCell>{new Date(account.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {user?.role === 'admin' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedAccount(account);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              {account.status === 'pending' && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleApproveAccount(account.id)}
                                >
                                  Approve
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteAccount(account.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Account Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Account Details</DialogTitle>
            </DialogHeader>
            {selectedAccount && (
              <AccountDetailsForm 
                initialData={selectedAccount} 
                onSubmit={handleUpdateAccount} 
                isEdit={true}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

const AccountDetailsForm = ({ initialData, onSubmit, isEdit = false }: any) => {
  const [formData, setFormData] = useState({
    accountNumber: initialData?.accountNumber || '',
    bankUserName: initialData?.bankUserName || '',
    bankName: initialData?.bankName || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="accountNumber">Account Number/Email/Phone *</Label>
        <Input
          id="accountNumber"
          value={formData.accountNumber}
          onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
          placeholder="Enter account number, email, or phone"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="bankUserName">Account Holder Name *</Label>
        <Input
          id="bankUserName"
          value={formData.bankUserName}
          onChange={(e) => setFormData({...formData, bankUserName: e.target.value})}
          placeholder="Full name of account holder"
          required
        />
      </div>

      <div>
        <Label htmlFor="bankName">Bank/Provider Name *</Label>
        <Input
          id="bankName"
          value={formData.bankName}
          onChange={(e) => setFormData({...formData, bankName: e.target.value})}
          placeholder="Name of bank or payment provider"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        {isEdit ? 'Update Account Details' : 'Submit Account Details'}
      </Button>
    </form>
  );
};

export default AccountDetails;
