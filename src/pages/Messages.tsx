
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, User, Clock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";

const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Support Team',
      subject: 'Welcome to Prime Pips Exchange!',
      content: 'Welcome to Prime Pips Exchange! We\'re excited to have you on board. Your account has been successfully created with a $100 USDC welcome bonus. If you have any questions, feel free to reach out to our support team.',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: false,
      type: 'system'
    },
    {
      id: 2,
      sender: 'Security Team',
      subject: 'Account Security Notice',
      content: 'For your security, we recommend enabling two-factor authentication (2FA) on your account. This adds an extra layer of protection to keep your funds safe.',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      read: true,
      type: 'security'
    },
    {
      id: 3,
      sender: 'Trading Team',
      subject: 'New Trading Pairs Available',
      content: 'We\'ve added new trading pairs to our platform! You can now trade SOL/USDT, ADA/USDT, and many more. Check out the trading room to explore these new opportunities.',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      read: true,
      type: 'announcement'
    }
  ]);
  
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Mark first message as read when component mounts
    if (messages.length > 0 && !messages[0].read) {
      setSelectedMessage(messages[0]);
      markAsRead(messages[0].id);
    }
  }, []);

  const markAsRead = (messageId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const handleSelectMessage = (message: any) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: `${user?.firstName} ${user?.lastName}`,
      subject: 'Support Request',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
      type: 'user'
    };

    setMessages(prev => [message, ...prev]);
    setSelectedMessage(message);
    setNewMessage('');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'system': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'security': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'announcement': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'user': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!user) return null;

  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-muted-foreground">
              Communicate with our support team and receive important updates
            </p>
          </div>
          <Badge variant="secondary">
            {unreadCount} unread
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Message List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Inbox
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 cursor-pointer transition-colors border-b ${
                      selectedMessage?.id === message.id 
                        ? 'bg-primary/10' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => handleSelectMessage(message)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${!message.read ? 'text-primary' : ''}`}>
                            {message.sender}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {message.subject}
                          </p>
                        </div>
                      </div>
                      {!message.read && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={`text-xs ${getMessageTypeColor(message.type)}`}>
                        {message.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Message Content */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {selectedMessage ? selectedMessage.subject : 'Select a message'}
                {selectedMessage && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTimestamp(selectedMessage.timestamp)}
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMessage ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedMessage.sender}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedMessage.type === 'user' ? 'You' : 'Prime Pips Team'}
                        </p>
                      </div>
                    </div>
                    <Badge className={getMessageTypeColor(selectedMessage.type)}>
                      {selectedMessage.type}
                    </Badge>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>

                  {selectedMessage.type !== 'user' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                        <div className="text-sm">
                          <p className="text-blue-800 dark:text-blue-200 font-medium">
                            Need help?
                          </p>
                          <p className="text-blue-700 dark:text-blue-300">
                            You can also use the live chat widget in the bottom right corner for instant support.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-medium">No message selected</p>
                  <p>Choose a message from the inbox to read its content</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Send Message */}
        <Card>
          <CardHeader>
            <CardTitle>Send Message to Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message to support team..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              For urgent matters, please use the live chat widget in the bottom right corner.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
