
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, X, Eye, Users } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { fetchAgentApplications, updateAgentApplications } from "@/utils/jsonbin-api";
import { useToast } from "@/hooks/use-toast";

const OurAgents = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const apps = await fetchAgentApplications();
      setApplications(apps);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (applicationId: string, action: 'approve' | 'reject') => {
    try {
      const updatedApplications = applications.map(app => 
        app.id === applicationId 
          ? { ...app, status: action === 'approve' ? 'approved' : 'rejected', reviewedAt: new Date().toISOString() }
          : app
      );
      
      await updateAgentApplications(updatedApplications);
      setApplications(updatedApplications);
      
      toast({
        title: "Success",
        description: `Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application",
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Users className="w-8 h-8 mr-3" />
            Our Agents
          </h1>
          <p className="text-muted-foreground">Manage agent applications and approvals</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agent Applications</CardTitle>
            <div className="flex space-x-4 text-sm">
              <span>Total: {applications.length}</span>
              <span>Pending: {applications.filter(app => app.status === 'pending').length}</span>
              <span>Approved: {applications.filter(app => app.status === 'approved').length}</span>
              <span>Rejected: {applications.filter(app => app.status === 'rejected').length}</span>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No applications found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>{application.fullName}</TableCell>
                      <TableCell>{application.email}</TableCell>
                      <TableCell>{application.location}, {application.country}</TableCell>
                      <TableCell>{application.occupation}</TableCell>
                      <TableCell>{getStatusBadge(application.status)}</TableCell>
                      <TableCell>{new Date(application.submittedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedApplication(application)}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Application Details</DialogTitle>
                              </DialogHeader>
                              {selectedApplication && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-medium">Personal Information</h4>
                                      <p><strong>Name:</strong> {selectedApplication.fullName}</p>
                                      <p><strong>Gender:</strong> {selectedApplication.gender}</p>
                                      <p><strong>Email:</strong> {selectedApplication.email}</p>
                                      <p><strong>Phone:</strong> {selectedApplication.phoneNumber}</p>
                                      <p><strong>WhatsApp:</strong> {selectedApplication.whatsappNumber}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium">Professional Information</h4>
                                      <p><strong>Occupation:</strong> {selectedApplication.occupation}</p>
                                      <p><strong>Location:</strong> {selectedApplication.location}, {selectedApplication.country}</p>
                                      <p><strong>Active Hours:</strong> {selectedApplication.activeHours}</p>
                                    </div>
                                  </div>
                                  {selectedApplication.experience && (
                                    <div>
                                      <h4 className="font-medium">Experience</h4>
                                      <p className="text-sm text-muted-foreground">{selectedApplication.experience}</p>
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-medium">Motivation</h4>
                                    <p className="text-sm text-muted-foreground">{selectedApplication.motivation}</p>
                                  </div>
                                  {selectedApplication.status === 'pending' && (
                                    <div className="flex space-x-2 pt-4">
                                      <Button 
                                        onClick={() => handleApplicationAction(selectedApplication.id, 'approve')}
                                        className="flex-1"
                                      >
                                        <Check className="w-4 h-4 mr-2" />
                                        Approve
                                      </Button>
                                      <Button 
                                        variant="destructive"
                                        onClick={() => handleApplicationAction(selectedApplication.id, 'reject')}
                                        className="flex-1"
                                      >
                                        <X className="w-4 h-4 mr-2" />
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          {application.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => handleApplicationAction(application.id, 'approve')}
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleApplicationAction(application.id, 'reject')}
                              >
                                <X className="w-3 h-3" />
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
      </div>
    </DashboardLayout>
  );
};

export default OurAgents;
