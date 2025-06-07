
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bell, Plus, Trash2, Users, User } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { fetchNotifications, updateNotifications, fetchUsers } from "@/utils/jsonbin-api";
import { useToast } from "@/hooks/use-toast";

const NotificationsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [notificationsData, usersData] = await Promise.all([
        fetchNotifications(),
        fetchUsers()
      ]);
      setNotifications(notificationsData);
      setUsers(usersData);
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

  const handleCreateNotification = async (notificationData: any) => {
    try {
      const newNotification = {
        id: `notif-${Date.now()}`,
        ...notificationData,
        createdBy: user?.id,
        createdAt: new Date().toISOString(),
        isRead: false
      };

      const updatedNotifications = [...notifications, newNotification];
      await updateNotifications(updatedNotifications);
      setNotifications(updatedNotifications);
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Notification created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create notification",
        variant: "destructive"
      });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
      await updateNotifications(updatedNotifications);
      setNotifications(updatedNotifications);
      
      toast({
        title: "Success",
        description: "Notification deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive"
      });
    }
  };

  const getUserNotifications = () => {
    if (user?.role === 'admin') {
      return notifications;
    }
    
    return notifications.filter(notif => 
      notif.type === 'public' || 
      (notif.type === 'specific' && notif.targetUsers?.includes(user?.id))
    );
  };

  const userNotifications = getUserNotifications();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Bell className="w-8 h-8 mr-3" />
            Notifications
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'admin' ? 'Manage platform notifications' : 'View your notifications'}
          </p>
        </div>

        {/* Admin: Create Notification */}
        {user?.role === 'admin' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notification Management</CardTitle>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Notification
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Notification</DialogTitle>
                  </DialogHeader>
                  <NotificationForm users={users} onSubmit={handleCreateNotification} />
                </DialogContent>
              </Dialog>
            </CardHeader>
          </Card>
        )}

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {user?.role === 'admin' ? 'All Notifications' : 'Your Notifications'}
              <Badge variant="secondary" className="ml-2">
                {userNotifications.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading notifications...</div>
            ) : userNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No notifications found</div>
            ) : (
              <div className="space-y-4">
                {userNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-lg ${notification.isRead ? 'bg-muted/30' : 'bg-background border-primary/20'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{notification.title}</h4>
                          <Badge variant={notification.type === 'public' ? 'default' : 'secondary'}>
                            {notification.type === 'public' ? (
                              <>
                                <Users className="w-3 h-3 mr-1" />
                                Public
                              </>
                            ) : (
                              <>
                                <User className="w-3 h-3 mr-1" />
                                Specific
                              </>
                            )}
                          </Badge>
                          {notification.priority === 'high' && (
                            <Badge variant="destructive">High Priority</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {user?.role === 'admin' && (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin: Notification Statistics */}
        {user?.role === 'admin' && (
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notifications.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Public Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {notifications.filter(n => n.type === 'public').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Specific Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {notifications.filter(n => n.type === 'specific').length}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const NotificationForm = ({ users, onSubmit }: any) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'public',
    priority: 'normal',
    targetUsers: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleUserSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        targetUsers: [...formData.targetUsers, userId]
      });
    } else {
      setFormData({
        ...formData,
        targetUsers: formData.targetUsers.filter(id => id !== userId)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Notification Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Enter notification title"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          placeholder="Enter notification message"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Notification Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public Announcement</SelectItem>
              <SelectItem value="specific">Specific Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.type === 'specific' && (
        <div>
          <Label>Select Target Users</Label>
          <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
            {users.map((user: any) => (
              <div key={user.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={user.id}
                  checked={formData.targetUsers.includes(user.id)}
                  onChange={(e) => handleUserSelect(user.id, e.target.checked)}
                />
                <label htmlFor={user.id} className="text-sm">
                  {user.firstName} {user.lastName} ({user.email})
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" className="w-full">
        Create Notification
      </Button>
    </form>
  );
};

export default NotificationsPage;
