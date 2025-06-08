import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Clock, MapPin, CheckCircle, AlertCircle, Plus, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAgentApplications, updateAgentApplications, fetchAccountDetails, updateAccountDetails } from "@/utils/jsonbin-api";
import { useToast } from "@/hooks/use-toast";

interface BankAccount {
  id: string;
  accountNumber: string;
  bankUserName: string;
  bankName: string;
  country: string;
}

const BecomeAgent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string>('none');
  const [accountDetailsStatus, setAccountDetailsStatus] = useState<string>('none');
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    occupation: '',
    activeHours: '',
    location: '',
    country: '',
    phoneNumber: '',
    whatsappNumber: '',
    email: '',
    experience: '',
    motivation: ''
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      accountNumber: '',
      bankUserName: '',
      bankName: '',
      country: ''
    }
  ]);

  useEffect(() => {
    checkApplicationStatus();
  }, [user?.id]);

  const checkApplicationStatus = async () => {
    try {
      const applications = await fetchAgentApplications();
      const userApplication = applications.find(app => app.userId === user?.id);
      
      if (userApplication) {
        setApplicationStatus(userApplication.status);
        
        if (userApplication.status === 'approved') {
          const accountDetails = await fetchAccountDetails();
          const userAccountDetails = accountDetails.find(acc => acc.userId === user?.id);
          
          if (userAccountDetails) {
            setAccountDetailsStatus(userAccountDetails.status);
          }
        }
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const applications = await fetchAgentApplications();
      
      const newApplication = {
        id: `app-${Date.now()}`,
        userId: user?.id,
        userEmail: user?.email,
        ...formData,
        status: 'pending',
        submittedAt: new Date().toISOString()
      };

      const updatedApplications = [...applications, newApplication];
      await updateAgentApplications(updatedApplications);
      
      setApplicationStatus('pending');

      toast({
        title: "Application Submitted",
        description: "Your agent application has been submitted successfully. We'll review it and get back to you soon.",
      });

      // Reset form
      setFormData({
        fullName: '',
        gender: '',
        occupation: '',
        activeHours: '',
        location: '',
        country: '',
        phoneNumber: '',
        whatsappNumber: '',
        email: '',
        experience: '',
        motivation: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccountDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least one bank account is filled
    const validAccounts = bankAccounts.filter(acc => 
      acc.accountNumber && acc.bankUserName && acc.bankName && acc.country
    );
    
    if (validAccounts.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in at least one complete bank account.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const accountDetails = await fetchAccountDetails();
      
      const newAccountDetails = {
        id: `acc-${Date.now()}`,
        userId: user?.id,
        userEmail: user?.email,
        userName: `${user?.firstName} ${user?.lastName}`,
        bankAccounts: validAccounts,
        status: 'pending',
        submittedAt: new Date().toISOString()
      };

      const updatedAccountDetails = [...accountDetails, newAccountDetails];
      await updateAccountDetails(updatedAccountDetails);
      
      setAccountDetailsStatus('pending');

      toast({
        title: "Account Details Submitted",
        description: "Your bank account details have been submitted for approval.",
      });

      // Reset form
      setBankAccounts([{
        id: '1',
        accountNumber: '',
        bankUserName: '',
        bankName: '',
        country: ''
      }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit account details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addBankAccount = () => {
    const newId = (bankAccounts.length + 1).toString();
    setBankAccounts([...bankAccounts, {
      id: newId,
      accountNumber: '',
      bankUserName: '',
      bankName: '',
      country: ''
    }]);
  };

  const removeBankAccount = (id: string) => {
    if (bankAccounts.length > 1) {
      setBankAccounts(bankAccounts.filter(acc => acc.id !== id));
    }
  };

  const updateBankAccount = (id: string, field: keyof BankAccount, value: string) => {
    setBankAccounts(bankAccounts.map(acc => 
      acc.id === id ? { ...acc, [field]: value } : acc
    ));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy',
    'Nigeria', 'South Africa', 'Kenya', 'Ghana', 'Egypt', 'Morocco', 'Tanzania',
    'India', 'China', 'Japan', 'South Korea', 'Thailand', 'Vietnam', 'Singapore',
    'Australia', 'New Zealand', 'Brazil', 'Argentina', 'Mexico', 'Colombia', 'Chile'
  ];

  const renderApplicationForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Agent Application Form</CardTitle>
        <p className="text-muted-foreground">Please fill out all fields to apply as an agent</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleApplicationSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation *</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                placeholder="Your current occupation"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
              <Input
                id="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">
                <MapPin className="w-4 h-4 inline mr-1" />
                City/Location *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Your city or location"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <Label htmlFor="activeHours">
              <Clock className="w-4 h-4 inline mr-1" />
              Active Hours *
            </Label>
            <Select value={formData.activeHours} onValueChange={(value) => handleInputChange('activeHours', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your preferred working hours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9am-5pm">9:00 AM - 5:00 PM</SelectItem>
                <SelectItem value="1pm-9pm">1:00 PM - 9:00 PM</SelectItem>
                <SelectItem value="6pm-2am">6:00 PM - 2:00 AM</SelectItem>
                <SelectItem value="flexible">Flexible Hours</SelectItem>
                <SelectItem value="24/7">24/7 Available</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Experience & Motivation */}
          <div className="space-y-2">
            <Label htmlFor="experience">Trading/Customer Service Experience</Label>
            <Textarea
              id="experience"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              placeholder="Describe your relevant experience..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivation">Why do you want to become an agent? *</Label>
            <Textarea
              id="motivation"
              value={formData.motivation}
              onChange={(e) => handleInputChange('motivation', e.target.value)}
              placeholder="Tell us why you're interested in becoming an agent..."
              rows={3}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting Application..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderAccountDetailsForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-success" />
          Post Bank Account Details
        </CardTitle>
        <p className="text-muted-foreground">Your agent application has been approved! Please provide your bank account details.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAccountDetailsSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Bank Accounts</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBankAccount}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Bank Account
              </Button>
            </div>
            
            {bankAccounts.map((account, index) => (
              <Card key={account.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Bank Account #{index + 1}</h4>
                    {bankAccounts.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeBankAccount(account.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Account Number/Email *</Label>
                      <Input
                        value={account.accountNumber}
                        onChange={(e) => updateBankAccount(account.id, 'accountNumber', e.target.value)}
                        placeholder="Phone number or email address"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Bank User Name *</Label>
                      <Input
                        value={account.bankUserName}
                        onChange={(e) => updateBankAccount(account.id, 'bankUserName', e.target.value)}
                        placeholder="Your name as it appears on the account"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bank Name *</Label>
                      <Input
                        value={account.bankName}
                        onChange={(e) => updateBankAccount(account.id, 'bankName', e.target.value)}
                        placeholder="Name of your bank"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Country *</Label>
                      <Select 
                        value={account.country} 
                        onValueChange={(value) => updateBankAccount(account.id, 'country', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map(country => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Bank Account Details"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderStatusCard = (status: string, type: 'application' | 'account') => {
    const isApplication = type === 'application';
    const title = isApplication ? 'Agent Application Status' : 'Account Details Status';
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {status === 'approved' ? (
              <CheckCircle className="w-5 h-5 mr-2 text-success" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
            )}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-lg font-medium">
              Status: <span className={`capitalize ${
                status === 'approved' ? 'text-success' : 
                status === 'pending' ? 'text-yellow-600' : 'text-destructive'
              }`}>
                {status}
              </span>
            </p>
            <p className="text-muted-foreground mt-2">
              {status === 'pending' ? 
                `Your ${isApplication ? 'application' : 'account details'} is under review. We'll notify you once it's processed.` :
                status === 'approved' ?
                  `Your ${isApplication ? 'application' : 'account details'} has been approved!` :
                  `Your ${isApplication ? 'application' : 'account details'} was rejected. Please contact support.`
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <UserPlus className="w-8 h-8 mr-3" />
            Become an Agent
          </h1>
          <p className="text-muted-foreground">Join our team and help users with their trading journey</p>
        </div>

        {/* Show different content based on application status */}
        {applicationStatus === 'none' && renderApplicationForm()}
        
        {applicationStatus === 'pending' && renderStatusCard('pending', 'application')}
        
        {applicationStatus === 'approved' && accountDetailsStatus === 'none' && renderAccountDetailsForm()}
        
        {applicationStatus === 'approved' && accountDetailsStatus === 'pending' && renderStatusCard('pending', 'account')}
        
        {applicationStatus === 'approved' && accountDetailsStatus === 'approved' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-success" />
                Congratulations!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-lg font-medium text-success">You are now an approved agent!</p>
                <p className="text-muted-foreground mt-2">
                  Your bank account details have been approved and are now available for users to fund their accounts.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {applicationStatus === 'rejected' && renderStatusCard('rejected', 'application')}
      </div>
    </DashboardLayout>
  );
};

export default BecomeAgent;
