// app/(dashboard)/settings/page.tsx - FIXED VERSION
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Download, 
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Palette,
  Moon,
  Sun,
  Laptop
} from 'lucide-react';
import { useState } from 'react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    monthlyReports: true,
    lowBalance: true
  });
  const [privacy, setPrivacy] = useState({
    showAmounts: true,
    privateMode: false,
    dataSharing: false
  });
  const [theme, setTheme] = useState('system');

  const handleExportData = () => {
    alert('Data export started...');
  };

  const handleImportData = () => {
    alert('Please select file to import...');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion process started...');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-6 -mt-8 rounded-t-sm">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-800">Settings</h1>
          </div>
          <p className="text-slate-600">Manage your account preferences and application settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <Card className="lg:col-span-1">
            <CardContent className="p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'notifications' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Bell className="h-4 w-4" />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'privacy' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  Privacy & Security
                </button>
                <button
                  onClick={() => setActiveTab('appearance')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'appearance' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Palette className="h-4 w-4" />
                  Appearance
                </button>
                <button
                  onClick={() => setActiveTab('data')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'data' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  Data Management
                </button>
              </nav>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your personal information and account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Full Name</Label>
                      <Input id="profile-name" placeholder="Enter your full name" defaultValue="Yadav Ji" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email">Email Address</Label>
                      <Input id="profile-email" type="email" placeholder="your@email.com" defaultValue="yadavji@example.com" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-currency">Default Currency</Label>
                      <Select defaultValue="inr">
                        <SelectTrigger id="profile-currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                          <SelectItem value="usd">US Dollar ($)</SelectItem>
                          <SelectItem value="eur">Euro (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger id="profile-language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about your financial activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-email">Email Notifications</Label>
                        <p className="text-sm text-slate-500">Receive updates via email</p>
                      </div>
                      <Switch
                        id="notify-email"
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-push">Push Notifications</Label>
                        <p className="text-sm text-slate-500">Get real-time alerts on your device</p>
                      </div>
                      <Switch
                        id="notify-push"
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-reports">Monthly Reports</Label>
                        <p className="text-sm text-slate-500">Receive monthly financial summaries</p>
                      </div>
                      <Switch
                        id="notify-reports"
                        checked={notifications.monthlyReports}
                        onCheckedChange={(checked) => setNotifications({...notifications, monthlyReports: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-balance">Low Balance Alerts</Label>
                        <p className="text-sm text-slate-500">Get notified when account balance is low</p>
                      </div>
                      <Switch
                        id="notify-balance"
                        checked={notifications.lowBalance}
                        onCheckedChange={(checked) => setNotifications({...notifications, lowBalance: checked})}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline">Reset</Button>
                    <Button>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy & Security */}
            {activeTab === 'privacy' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>
                    Control your privacy settings and secure your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="privacy-amounts" className="flex items-center gap-2">
                          Show Amounts
                          {privacy.showAmounts ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Label>
                        <p className="text-sm text-slate-500">Display transaction amounts in dashboard</p>
                      </div>
                      <Switch
                        id="privacy-amounts"
                        checked={privacy.showAmounts}
                        onCheckedChange={(checked) => setPrivacy({...privacy, showAmounts: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="privacy-mode">Private Mode</Label>
                        <p className="text-sm text-slate-500">Hide sensitive information in screenshots</p>
                      </div>
                      <Switch
                        id="privacy-mode"
                        checked={privacy.privateMode}
                        onCheckedChange={(checked) => setPrivacy({...privacy, privateMode: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="privacy-sharing">Data Sharing</Label>
                        <p className="text-sm text-slate-500">Share anonymous usage data to improve app</p>
                      </div>
                      <Switch
                        id="privacy-sharing"
                        checked={privacy.dataSharing}
                        onCheckedChange={(checked) => setPrivacy({...privacy, dataSharing: checked})}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-slate-800 mb-4">Security</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Two-Factor Authentication
                        <Badge variant="secondary" className="ml-2">Recommended</Badge>
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Login Activity
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Appearance */}
            {activeTab === 'appearance' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize how the application looks and feels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-3 block">Theme Preference</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          onClick={() => setTheme('light')}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            theme === 'light' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Sun className="h-6 w-6 mb-2" />
                          <div className="font-medium">Light</div>
                          <p className="text-sm text-slate-500">Clean and bright interface</p>
                        </button>
                        
                        <button
                          onClick={() => setTheme('dark')}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            theme === 'dark' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Moon className="h-6 w-6 mb-2" />
                          <div className="font-medium">Dark</div>
                          <p className="text-sm text-slate-500">Easy on the eyes</p>
                        </button>
                        
                        <button
                          onClick={() => setTheme('system')}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            theme === 'system' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Laptop className="h-6 w-6 mb-2" />
                          <div className="font-medium">System</div>
                          <p className="text-sm text-slate-500">Follows device theme</p>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="appearance-density">Interface Density</Label>
                        <Select defaultValue="comfortable">
                          <SelectTrigger id="appearance-density">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compact">Compact</SelectItem>
                            <SelectItem value="comfortable">Comfortable</SelectItem>
                            <SelectItem value="spacious">Spacious</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="appearance-font">Font Size</Label>
                        <Select defaultValue="medium">
                          <SelectTrigger id="appearance-font">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button>Apply Changes</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Data Management */}
            {activeTab === 'data' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Data Management
                  </CardTitle>
                  <CardDescription>
                    Manage your financial data and account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-slate-800 mb-2">Export Data</h4>
                      <p className="text-sm text-slate-600 mb-4">
                        Download all your financial data in CSV or JSON format for backup or analysis.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button onClick={handleExportData} className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Export as CSV
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Export as JSON
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-slate-800 mb-2">Import Data</h4>
                      <p className="text-sm text-slate-600 mb-4">
                        Import transactions from other financial applications or spreadsheet files.
                      </p>
                      <Button onClick={handleImportData} variant="outline" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Import Data
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 border-rose-200 bg-rose-50">
                      <h4 className="font-semibold text-rose-800 mb-2 flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        Danger Zone
                      </h4>
                      <p className="text-sm text-rose-700 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button 
                        onClick={handleDeleteAccount}
                        variant="destructive" 
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;