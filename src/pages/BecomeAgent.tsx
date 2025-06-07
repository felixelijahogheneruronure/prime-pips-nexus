
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Clock, MapPin } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAgentApplications, updateAgentApplications } from "@/utils/jsonbin-api";
import { useToast } from "@/hooks/use-toast";

const BecomeAgent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

        <Card>
          <CardHeader>
            <CardTitle>Agent Application Form</CardTitle>
            <p className="text-muted-foreground">Please fill out all fields to apply as an agent</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Your country"
                    required
                  />
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
      </div>
    </DashboardLayout>
  );
};

export default BecomeAgent;
