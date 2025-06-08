import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Users, DollarSign, TrendingUp, AlertTriangle, Plus, Edit, Trash2, Ban, UserCheck, Crown, Settings, Bell, Coins } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { fetchUsers, updateUsers, fetchAccountDetails, updateAccountDetails, fetchNotifications, updateNotifications } from "@/utils/jsonbin-api";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAgentEditDialogOpen, setIsAgentEditDialogOpen] = useState(false);
  const [isCryptoDialogOpen, setIsCryptoDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  
  // Crypto addresses state
  const [cryptoAddresses, setCryptoAddresses] = useState({
    'USDT (ERC-20/BNB)': "0x03a5bcd790171c6241b5ef8334d1a1b957fea3ce",
    'USDC': "0x03a5bcd790171c6241b5ef8334d1a1b957fea3ce",
    'BTC': "bc1qrlleet4v67nmsznd076mnu5839qxp6zq5zt294",
    'ETH': "0x03a5bcd790171c6241b5ef8334d1a1b957fea3ce",
    'BCH': "0x03a5bcd790171c6241b5ef8334d1a1b957fea3ce",
    'BNB': "0x03a5bcd790171c6241b5ef8334d1a1b957fea3ce"
  });
  
  // Notification state
  const [notificationForm, setNotificationForm] = useState({
    message: '',
    target: 'all', // 'all' or specific user email
    targetUser: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, agentsData] = await Promise.all([
        fetchUsers(),
        fetchAccountDetails()
      ]);
      setUsers(usersData);
      setAgents(agentsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: any) => {
    try {
      const newUser = {
        id: `user-${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        tier: parseInt(userData.tier),
        status: 'active',
        wallets: { USDC: parseFloat(userData.usdcBalance) || 100, BTC: 0, ETH: 0 },
        createdAt: new Date().toISOString(),
        passwordHash: 'demo-hash'
      };

      const updatedUsers = [...users, newUser];
      await updateUsers(updatedUsers);
      setUsers(updatedUsers);
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Success",
        description: "User created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive"
      });
    }
  };

  const handleUpdateUser = async (userData: any) => {
    try {
      const updatedUsers = users.map(u => 
        u.id === selectedUser.id ? { 
          ...u, 
          ...userData, 
          tier: parseInt(userData.tier),
          wallets: {
            ...u.wallets,
            USDC: parseFloat(userData.usdcBalance)
          }
        } : u
      );
      await updateUsers(updatedUsers);
      setUsers(updatedUsers);
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      
      toast({
        title: "Success",
        description: "User updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const updatedUsers = users.filter(u => u.id !== userId);
      await updateUsers(updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  const handleToggleUserStatus = async (userId: string, newStatus: string) => {
    try {
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      );
      await updateUsers(updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "Success",
        description: `User ${newStatus} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const handleAgentStatusUpdate = async (agentId: string, newStatus: string) => {
    try {
      const updatedAgents = agents.map(agent => 
        agent.id === agentId ? { ...agent, status: newStatus, reviewedAt: new Date().toISOString() } : agent
      );
      await updateAccountDetails(updatedAgents);
      setAgents(updatedAgents);
      
      toast({
        title: "Success",
        description: `Agent ${newStatus} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update agent status",
        variant: "destructive"
      });
    }
  };

  const handleAgentEdit = async (agentData: any) => {
    try {
      const updatedAgents = agents.map(agent => 
        agent.id === selectedAgent.id ? { ...agent, ...agentData } : agent
      );
      await updateAccountDetails(updatedAgents);
      setAgents(updatedAgents);
      setIsAgentEditDialogOpen(false);
      setSelectedAgent(null);
      
      toast({
        title: "Success",
        description: "Agent details updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update agent details",
        variant: "destructive"
      });
    }
  };

  const handleCryptoAddressUpdate = async () => {
    try {
      // Store crypto addresses in localStorage for this demo
      localStorage.setItem('cryptoAddresses', JSON.stringify(cryptoAddresses));
      setIsCryptoDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Crypto addresses updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update crypto addresses",
        variant: "destructive"
      });
    }
  };

  const handleSendNotification = async () => {
    try {
      const notifications = await fetchNotifications();
      
      const newNotification = {
        id: `notif-${Date.now()}`,
        message: notificationForm.message,
        target: notificationForm.target === 'all' ? 'all' : notificationForm.targetUser,
        sentBy: user?.email,
        sentAt: new Date().toISOString(),
        read: false
      };

      const updatedNotifications = [...notifications, newNotification];
      await updateNotifications(updatedNotifications);
      
      setIsNotificationDialogOpen(false);
      setNotificationForm({ message: '', target: 'all', targetUser: '' });
      
      toast({
        title: "Success",
        description: "Notification sent successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive"
      });
    }
  };

  const getTierBadge = (tier: number) => {
    const tierColors = {
      1: 'bg-gray-500',
      2: 'bg-green-500',
      3: 'bg-blue-500',
      4: 'bg-purple-500',
      5: 'bg-pink-500',
      6: 'bg-indigo-500',
      7: 'bg-yellow-500',
      8: 'bg-orange-500',
      9: 'bg-red-500',
      10: 'bg-emerald-500',
      11: 'bg-cyan-500',
      12: 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500'
    };
    
    return (
      <Badge className={`${tierColors[tier as keyof typeof tierColors] || 'bg-gray-500'} text-white`}>
        <Crown className="w-3 h-3 mr-1" />
        Tier {tier}
      </Badge>
    );
  };

  if (user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      change: "+12%"
    },
    {
      title: "Active Users",
      value: users.filter(u => u.status === 'active').length,
      icon: UserCheck,
      change: "+8%"
    },
    {
      title: "Approved Agents",
      value: agents.filter(a => a.status === 'approved').length,
      icon: Crown,
      change: "+5%"
    },
    {
      title: "Total Volume",
      value: "$2.4M",
      icon: DollarSign,
      change: "+23%"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage users, agents, payments, and platform settings</p>
          </div>
          
          <div className="flex space-x-2">
            <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Bell className="w-4 h-4 mr-2" />
                  Send Notification
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Notification</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Target</Label>
                    <Select 
                      value={notificationForm.target} 
                      onValueChange={(value) => setNotificationForm({...notificationForm, target: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="specific">Specific User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {notificationForm.target === 'specific' && (
                    <div>
                      <Label>User Email</Label>
                      <Input
                        value={notificationForm.targetUser}
                        onChange={(e) => setNotificationForm({...notificationForm, targetUser: e.target.value})}
                        placeholder="Enter user email"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label>Message</Label>
                    <Textarea
                      value={notificationForm.message}
                      onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                      placeholder="Enter notification message"
                      rows={3}
                    />
                  </div>
                  
                  <Button onClick={handleSendNotification} className="w-full">
                    Send Notification
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isCryptoDialogOpen} onOpenChange={setIsCryptoDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Coins className="w-4 h-4 mr-2" />
                  Manage Crypto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Manage Cryptocurrency Addresses</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {Object.entries(cryptoAddresses).map(([currency, address]) => (
                    <div key={currency} className="space-y-2">
                      <Label>{currency}</Label>
                      <Input
                        value={address}
                        onChange={(e) => setCryptoAddresses({...cryptoAddresses, [currency]: e.target.value})}
                        placeholder={`Enter ${currency} address`}
                      />
                    </div>
                  ))}
                  <Button onClick={handleCryptoAddressUpdate} className="w-full">
                    Update Addresses
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
                <p className="text-xs text-success">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="agents">Agent Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                    </DialogHeader>
                    <UserForm onSubmit={handleCreateUser} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>USDC Balance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.firstName} {user.lastName}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{getTierBadge(user.tier || 1)}</TableCell>
                          <TableCell>
                            <Badge variant={
                              user.status === 'active' ? 'default' : 
                              user.status === 'suspended' ? 'destructive' : 'secondary'
                            }>
                              {user.status || 'active'}
                            </Badge>
                          </TableCell>
                          <TableCell>${user.wallets?.USDC || 0}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              {user.status !== 'suspended' ? (
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleToggleUserStatus(user.id, 'suspended')}
                                >
                                  <Ban className="w-3 h-3" />
                                </Button>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  onClick={() => handleToggleUserStatus(user.id, 'active')}
                                >
                                  <UserCheck className="w-3 h-3" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <CardTitle>Agent Management</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading agents...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Bank Accounts</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agents.map((agent) => (
                        <TableRow key={agent.id}>
                          <TableCell>{agent.userName}</TableCell>
                          <TableCell>{agent.userEmail}</TableCell>
                          <TableCell>
                            {agent.bankAccounts ? agent.bankAccounts.length : 1} account(s)
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              agent.status === 'approved' ? 'default' : 
                              agent.status === 'pending' ? 'secondary' : 'destructive'
                            }>
                              {agent.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(agent.submittedAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedAgent(agent);
                                  setIsAgentEditDialogOpen(true);
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              {agent.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleAgentStatusUpdate(agent.id, 'approved')}
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => handleAgentStatusUpdate(agent.id, 'rejected')}
                                  >
                                    Reject
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
          </TabsContent>
        </Tabs>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <UserForm 
                initialData={selectedUser} 
                onSubmit={handleUpdateUser} 
                isEdit={true}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Agent Dialog */}
        <Dialog open={isAgentEditDialogOpen} onOpenChange={setIsAgentEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Agent Details</DialogTitle>
            </DialogHeader>
            {selectedAgent && (
              <AgentEditForm 
                initialData={selectedAgent} 
                onSubmit={handleAgentEdit}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

const UserForm = ({ initialData, onSubmit, isEdit = false }: any) => {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    role: initialData?.role || 'user',
    tier: initialData?.tier || 1,
    status: initialData?.status || 'active',
    usdcBalance: initialData?.wallets?.USDC || 100
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="tier">Tier Level</Label>
          <Select value={formData.tier.toString()} onValueChange={(value) => setFormData({...formData, tier: parseInt(value)})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({length: 12}, (_, i) => i + 1).map(tier => (
                <SelectItem key={tier} value={tier.toString()}>
                  Tier {tier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isEdit && (
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="usdcBalance">USDC Balance</Label>
        <Input
          id="usdcBalance"
          type="number"
          value={formData.usdcBalance}
          onChange={(e) => setFormData({...formData, usdcBalance: parseFloat(e.target.value) || 0})}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        {isEdit ? 'Update User' : 'Create User'}
      </Button>
    </form>
  );
};

const AgentEditForm = ({ initialData, onSubmit }: any) => {
  const [bankAccounts, setBankAccounts] = useState(
    initialData.bankAccounts || [initialData]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ bankAccounts });
  };

  const updateBankAccount = (index: number, field: string, value: string) => {
    const updated = [...bankAccounts];
    updated[index] = { ...updated[index], [field]: value };
    setBankAccounts(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {bankAccounts.map((account: any, index: number) => (
          <Card key={index} className="p-4">
            <h4 className="font-medium mb-3">Bank Account #{index + 1}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Account Number</Label>
                <Input
                  value={account.accountNumber || ''}
                  onChange={(e) => updateBankAccount(index, 'accountNumber', e.target.value)}
                />
              </div>
              <div>
                <Label>Bank User Name</Label>
                <Input
                  value={account.bankUserName || ''}
                  onChange={(e) => updateBankAccount(index, 'bankUserName', e.target.value)}
                />
              </div>
              <div>
                <Label>Bank Name</Label>
                <Input
                  value={account.bankName || ''}
                  onChange={(e) => updateBankAccount(index, 'bankName', e.target.value)}
                />
              </div>
              <div>
                <Label>Country</Label>
                <Input
                  value={account.country || ''}
                  onChange={(e) => updateBankAccount(index, 'country', e.target.value)}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button type="submit" className="w-full">
        Update Agent Details
      </Button>
    </form>
  );
};

export default Admin;
