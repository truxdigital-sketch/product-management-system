import { useState } from 'react';
import { Save, Building, CreditCard, Users, Bell, Key, Package, Plus, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/utils';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { Role } from '@/store/useSettingsStore';

const settingsTabs = [
  { id: 'store', label: 'Store Settings', icon: Building },
  { id: 'currency', label: 'Currency & Tax', icon: CreditCard },
  { id: 'shipping', label: 'Shipping', icon: Package },
  { id: 'roles', label: 'Roles & Permissions', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'api', label: 'API Keys', icon: Key },
];

const availablePermissions = [
  'dashboard', 'products', 'categories', 'brands', 'inventory', 'reviews', 'orders', 'customers', 'analytics', 'settings'
];

export function Settings() {
  const [activeTab, setActiveTab] = useState('store');
  
  const { 
    store, currency, tax, shipping, roles, notifications,
    updateStore, updateCurrency, updateTax, updateShipping,
    addRole, updateRole, deleteRole, updateNotifications
  } = useSettingsStore();

  // Local state for forms to handle "Save" behavior
  const [storeData, setStoreData] = useState(store);
  const [currencyData, setCurrencyData] = useState(currency);
  const [taxData, setTaxData] = useState(tax);
  const [shippingData, setShippingData] = useState(shipping);
  const [notificationsData, setNotificationsData] = useState(notifications);

  // Role Management State
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleSaveStore = () => updateStore(storeData);
  const handleSaveCurrencyTax = () => { updateCurrency(currencyData); updateTax(taxData); };
  const handleSaveShipping = () => updateShipping(shippingData);
  const handleSaveNotifications = () => updateNotifications(notificationsData);

  const handleSaveRole = () => {
    if (editingRole) {
      if (roles.find(r => r.id === editingRole.id)) {
        updateRole(editingRole.id, editingRole);
      } else {
        addRole(editingRole);
      }
      setEditingRole(null);
    }
  };

  const togglePermission = (perm: string) => {
    if (!editingRole) return;
    const hasPerm = editingRole.permissions.includes(perm);
    const newPerms = hasPerm 
      ? editingRole.permissions.filter(p => p !== perm)
      : [...editingRole.permissions, perm];
    setEditingRole({ ...editingRole, permissions: newPerms });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your store preferences and integrations.</p>
        </div>
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
                  <Input value={storeData.name} onChange={e => setStoreData({...storeData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Email</label>
                  <Input type="email" value={storeData.email} onChange={e => setStoreData({...storeData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Support Phone</label>
                  <Input type="tel" value={storeData.phone} onChange={e => setStoreData({...storeData, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Store Address</label>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                    value={storeData.address}
                    onChange={e => setStoreData({...storeData, address: e.target.value})}
                  />
                </div>
                <Button className="mt-4 gap-2" onClick={handleSaveStore}><Save className="w-4 h-4" /> Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'currency' && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle>Currency & Tax</CardTitle>
                <CardDescription>Configure pricing displays and taxation rules.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 border-b pb-6">
                  <h3 className="font-semibold text-sm">Currency Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Default Currency</label>
                      <Input value={currencyData.currency} onChange={e => setCurrencyData({...currencyData, currency: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Currency Symbol</label>
                      <Input value={currencyData.symbol} onChange={e => setCurrencyData({...currencyData, symbol: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Symbol Position</label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                        value={currencyData.position}
                        onChange={e => setCurrencyData({...currencyData, position: e.target.value as 'left' | 'right'})}
                      >
                        <option value="left">Left ($100)</option>
                        <option value="right">Right (100$)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Decimal Places</label>
                      <Input type="number" value={currencyData.decimalPlaces} onChange={e => setCurrencyData({...currencyData, decimalPlaces: Number(e.target.value)})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Tax Settings</h3>
                  <div className="flex items-center justify-between border rounded-md p-3">
                    <label className="text-sm font-medium cursor-pointer" htmlFor="enableTax">Enable Taxes</label>
                    <input type="checkbox" id="enableTax" className="w-4 h-4 rounded text-primary" checked={taxData.enabled} onChange={e => setTaxData({...taxData, enabled: e.target.checked})} />
                  </div>
                  {taxData.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tax Percentage (%)</label>
                        <Input type="number" value={taxData.percentage} onChange={e => setTaxData({...taxData, percentage: Number(e.target.value)})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Prices Include Tax?</label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                          value={taxData.inclusive ? 'yes' : 'no'}
                          onChange={e => setTaxData({...taxData, inclusive: e.target.value === 'yes'})}
                        >
                          <option value="yes">Yes (Inclusive)</option>
                          <option value="no">No (Exclusive)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                <Button className="mt-4 gap-2" onClick={handleSaveCurrencyTax}><Save className="w-4 h-4" /> Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'shipping' && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle>Shipping Configuration</CardTitle>
                <CardDescription>Manage shipping methods, zones, and rates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shipping Zones</label>
                  <Input 
                    value={shippingData.zones.join(', ')} 
                    onChange={e => setShippingData({...shippingData, zones: e.target.value.split(',').map(z => z.trim())})} 
                    placeholder="e.g. Domestic, International, Europe" 
                  />
                  <p className="text-xs text-muted-foreground">Comma separated list of operational zones.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Shipping Methods</h3>
                  </div>
                  <div className="border rounded-md divide-y">
                    {shippingData.methods.map((method, idx) => (
                      <div key={method.id} className="p-4 grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4">
                          <Input value={method.name} onChange={e => {
                            const newMethods = [...shippingData.methods];
                            newMethods[idx].name = e.target.value;
                            setShippingData({...shippingData, methods: newMethods});
                          }} placeholder="Method Name" />
                        </div>
                        <div className="col-span-3">
                          <Input type="number" value={method.cost} onChange={e => {
                            const newMethods = [...shippingData.methods];
                            newMethods[idx].cost = Number(e.target.value);
                            setShippingData({...shippingData, methods: newMethods});
                          }} placeholder="Cost" />
                        </div>
                        <div className="col-span-4">
                          <Input value={method.deliveryTime} onChange={e => {
                            const newMethods = [...shippingData.methods];
                            newMethods[idx].deliveryTime = e.target.value;
                            setShippingData({...shippingData, methods: newMethods});
                          }} placeholder="e.g. 3-5 days" />
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Button variant="ghost" size="icon" onClick={() => {
                            setShippingData({...shippingData, methods: shippingData.methods.filter(m => m.id !== method.id)});
                          }}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="p-4 bg-muted/20">
                      <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => {
                        setShippingData({...shippingData, methods: [...shippingData.methods, { id: crypto.randomUUID(), name: 'New Method', cost: 0, deliveryTime: '' }]});
                      }}>
                        <Plus className="w-4 h-4" /> Add Shipping Method
                      </Button>
                    </div>
                  </div>
                </div>
                <Button className="mt-4 gap-2" onClick={handleSaveShipping}><Save className="w-4 h-4" /> Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'roles' && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Roles & Permissions</CardTitle>
                  <CardDescription>Control who has access to which modules.</CardDescription>
                </div>
                {!editingRole && (
                  <Button size="sm" className="gap-2" onClick={() => setEditingRole({ id: 'new', name: 'New Role', permissions: [] })}>
                    <Plus className="w-4 h-4" /> Add Role
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {editingRole ? (
                  <div className="space-y-6 border rounded-md p-4 bg-muted/10">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Role Name</label>
                      <Input value={editingRole.name} onChange={e => setEditingRole({...editingRole, name: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Permissions</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {availablePermissions.map(perm => (
                          <div key={perm} className="flex items-center gap-2 border p-2 rounded-md bg-background">
                            <input 
                              type="checkbox" 
                              id={`perm-${perm}`} 
                              checked={editingRole.permissions.includes(perm)} 
                              onChange={() => togglePermission(perm)}
                              className="rounded border-input text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                            />
                            <label htmlFor={`perm-${perm}`} className="text-sm font-medium capitalize cursor-pointer flex-1">
                              {perm}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-4 border-t">
                      <Button variant="outline" onClick={() => setEditingRole(null)}>Cancel</Button>
                      <Button onClick={handleSaveRole}>Save Role</Button>
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-md divide-y">
                    {roles.map(role => (
                      <div key={role.id} className="p-4 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{role.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {role.permissions.length === availablePermissions.length 
                              ? 'Full Access' 
                              : `${role.permissions.length} permissions granted`}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setEditingRole(role)}><Edit className="w-4 h-4 text-muted-foreground" /></Button>
                          {role.id !== 'admin' && (
                            <Button variant="ghost" size="icon" onClick={() => deleteRole(role.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure how and when you receive alerts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 border-b pb-6">
                  <h3 className="font-semibold text-sm">Email Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'emailNewProduct', label: 'New Product Creations' },
                      { key: 'emailLowStock', label: 'Low Stock Alerts' },
                      { key: 'emailOutStock', label: 'Out of Stock Alerts' },
                      { key: 'emailOrders', label: 'New Orders' },
                      { key: 'emailRegistration', label: 'New User Registrations' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between border rounded-md p-3 hover:bg-muted/50 transition-colors">
                        <label className="text-sm font-medium cursor-pointer flex-1" htmlFor={item.key}>{item.label}</label>
                        <input 
                          type="checkbox" 
                          id={item.key} 
                          checked={notificationsData[item.key as keyof typeof notificationsData] as boolean} 
                          onChange={e => setNotificationsData({...notificationsData, [item.key]: e.target.checked})}
                          className="w-4 h-4 rounded text-primary cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">System Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'systemBrowser', label: 'Browser Push Notifications' },
                      { key: 'systemAlerts', label: 'Dashboard Toast Alerts' },
                      { key: 'systemFeed', label: 'Activity Feed Logging' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between border rounded-md p-3 hover:bg-muted/50 transition-colors">
                        <label className="text-sm font-medium cursor-pointer flex-1" htmlFor={item.key}>{item.label}</label>
                        <input 
                          type="checkbox" 
                          id={item.key} 
                          checked={notificationsData[item.key as keyof typeof notificationsData] as boolean} 
                          onChange={e => setNotificationsData({...notificationsData, [item.key]: e.target.checked})}
                          className="w-4 h-4 rounded text-primary cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="mt-4 gap-2" onClick={handleSaveNotifications}><Save className="w-4 h-4" /> Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'api' && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle>API Keys & Integrations</CardTitle>
                <CardDescription>Configure external services.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">OpenAI API Key</label>
                  <Input type="password" placeholder="sk-..." />
                  <p className="text-xs text-muted-foreground">Used for AI features. (Simulated in this demo)</p>
                </div>
                <Button variant="outline" className="mt-4">Test Connection</Button>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
