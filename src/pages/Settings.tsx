import React, { useState } from 'react';
import { Save, Building, CreditCard, Users, Bell, Key, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/utils';

const settingsTabs = [
  { id: 'store', label: 'Store Settings', icon: Building },
  { id: 'currency', label: 'Currency & Tax', icon: CreditCard },
  { id: 'shipping', label: 'Shipping', icon: Package },
  { id: 'roles', label: 'Roles & Permissions', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'api', label: 'API Keys', icon: Key },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState('store');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your store preferences and integrations.</p>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0">
          <Card>
            <CardContent className="p-2">
              <nav className="flex flex-col space-y-1">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors text-left",
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          {activeTab === 'store' && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>Update your store's public information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Store Name</label>
                  <Input defaultValue="Premium Tech Store" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Email</label>
                  <Input type="email" defaultValue="support@premiumtech.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Support Phone</label>
                  <Input type="tel" defaultValue="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Store Address</label>
                  <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" defaultValue="123 Tech Avenue\nSuite 400\nSan Francisco, CA 94105" />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'api' && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle>API Keys & AI Integrations</CardTitle>
                <CardDescription>Configure external services and AI models.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">OpenAI API Key (for AI Content Generation)</label>
                  <Input type="password" defaultValue="sk-................................" />
                  <p className="text-xs text-muted-foreground">Used for generating product descriptions and SEO metadata.</p>
                </div>
                <Button variant="outline" className="mt-4">Test Connection</Button>
              </CardContent>
            </Card>
          )}

          {activeTab !== 'store' && activeTab !== 'api' && (
             <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle className="capitalize">{activeTab} Settings</CardTitle>
                <CardDescription>Configure {activeTab} preferences for your store.</CardDescription>
              </CardHeader>
              <CardContent className="py-12 text-center text-muted-foreground">
                Settings form for {activeTab} will appear here.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
