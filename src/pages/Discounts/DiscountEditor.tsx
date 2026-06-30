import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Percent, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDiscountStore } from '@/store/useDiscountStore';
import type { OfferType, OfferStatus, OfferApplicableTo } from '@/store/useDiscountStore';

export function DiscountEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { offers, addOffer, updateOffer } = useDiscountStore();
  
  const isEditing = id && id !== 'new';
  const existingOffer = isEditing ? offers.find(o => o.id === id) : null;

  // Form State
  const [name, setName] = useState(existingOffer?.name || '');
  const [description, setDescription] = useState(existingOffer?.description || '');
  const [type, setType] = useState<OfferType>(existingOffer?.type || 'percentage');
  const [status, setStatus] = useState<OfferStatus>(existingOffer?.status || 'draft');
  const [discountValue, setDiscountValue] = useState<number>(existingOffer?.discount_value || 0);
  
  const [maxDiscountLimit, setMaxDiscountLimit] = useState<number | ''>(existingOffer?.max_discount_limit || '');
  const [minPurchaseAmount, setMinPurchaseAmount] = useState<number | ''>(existingOffer?.min_purchase_amount || '');
  
  const [applicableTo, setApplicableTo] = useState<OfferApplicableTo>(existingOffer?.applicable_to || 'all');
  
  const [hasCoupon, setHasCoupon] = useState<boolean>(existingOffer?.has_coupon || false);
  const [couponCode, setCouponCode] = useState<string>(existingOffer?.coupon_code || '');
  
  const [startDate, setStartDate] = useState<string>(existingOffer?.start_date?.split('T')[0] || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(existingOffer?.end_date?.split('T')[0] || '');
  
  const [maxUses, setMaxUses] = useState<number | ''>(existingOffer?.max_uses || '');
  const [usesPerCustomer, setUsesPerCustomer] = useState<number | ''>(existingOffer?.uses_per_customer || '');
  
  const [showBadge, setShowBadge] = useState<boolean>(existingOffer?.display_show_badge ?? true);
  const [showTimer, setShowTimer] = useState<boolean>(existingOffer?.display_show_timer ?? false);
  const [highlightPercentage, setHighlightPercentage] = useState<boolean>(existingOffer?.display_highlight_percentage ?? true);

  const generateCoupon = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'SALE';
    for(let i=0; i<6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCouponCode(code);
  };

  const handleSave = () => {
    if (!name) return;

    const offerData = {
      name,
      description,
      type,
      status,
      discount_value: discountValue,
      max_discount_limit: maxDiscountLimit === '' ? null : Number(maxDiscountLimit),
      min_purchase_amount: minPurchaseAmount === '' ? null : Number(minPurchaseAmount),
      max_uses: maxUses === '' ? null : Number(maxUses),
      uses_per_customer: usesPerCustomer === '' ? null : Number(usesPerCustomer),
      applicable_to: applicableTo,
      applicable_ids: [],
      has_coupon: hasCoupon,
      coupon_code: hasCoupon ? couponCode : null,
      start_date: startDate ? new Date(startDate).toISOString() : null,
      end_date: endDate ? new Date(endDate).toISOString() : null,
      display_show_badge: showBadge,
      display_show_timer: showTimer,
      display_highlight_percentage: highlightPercentage,
    };

    if (isEditing && id) {
      updateOffer(id, offerData);
    } else {
      addOffer(offerData);
    }
    
    navigate('/discounts');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/discounts')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {isEditing ? 'Edit Offer' : 'Create Offer'}
            </h2>
            <p className="text-muted-foreground">Configure your discount or promotional campaign.</p>
          </div>
        </div>
        <Button onClick={handleSave} className="gap-2" disabled={!name}>
          <Save className="h-4 w-4" /> Save Offer
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Offer Name <span className="text-destructive">*</span></label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Summer Sale 2026" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Internal description or terms and conditions..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Discount Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Offer Type</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                    value={type}
                    onChange={e => setType(e.target.value as OfferType)}
                  >
                    <option value="percentage">Percentage Discount</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="bogo">Buy One Get One (BOGO)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>
                {type !== 'free_shipping' && type !== 'bogo' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Discount Value</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        {type === 'percentage' ? <Percent className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                      </div>
                      <Input 
                        type="number" 
                        min="0"
                        className="pl-9" 
                        value={discountValue} 
                        onChange={e => setDiscountValue(Number(e.target.value))} 
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Minimum Purchase Amount (Optional)</label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 100" 
                    value={minPurchaseAmount} 
                    onChange={e => setMinPurchaseAmount(e.target.value ? Number(e.target.value) : '')} 
                  />
                </div>
                {type === 'percentage' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Maximum Discount Limit (Optional)</label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 50" 
                      value={maxDiscountLimit} 
                      onChange={e => setMaxDiscountLimit(e.target.value ? Number(e.target.value) : '')} 
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applicability & Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Applies To</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                  value={applicableTo}
                  onChange={e => setApplicableTo(e.target.value as OfferApplicableTo)}
                >
                  <option value="all">All Products</option>
                  <option value="categories">Specific Categories</option>
                  <option value="products">Specific Products</option>
                  <option value="brands">Specific Brands</option>
                </select>
                {applicableTo !== 'all' && (
                  <p className="text-xs text-amber-600 mt-2">Selection UI for {applicableTo} will be rendered here.</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Maximum Total Uses</label>
                  <Input 
                    type="number" 
                    placeholder="Unlimited" 
                    value={maxUses} 
                    onChange={e => setMaxUses(e.target.value ? Number(e.target.value) : '')} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Uses Per Customer</label>
                  <Input 
                    type="number" 
                    placeholder="Unlimited" 
                    value={usesPerCustomer} 
                    onChange={e => setUsesPerCustomer(e.target.value ? Number(e.target.value) : '')} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                value={status}
                onChange={e => setStatus(e.target.value as OfferStatus)}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coupon Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="hasCoupon" 
                  checked={hasCoupon} 
                  onChange={e => setHasCoupon(e.target.checked)} 
                  className="rounded border-input text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <label htmlFor="hasCoupon" className="text-sm font-medium cursor-pointer">Require Coupon Code</label>
              </div>
              
              {hasCoupon && (
                <div className="space-y-2 mt-4 animate-in fade-in">
                  <div className="flex gap-2">
                    <Input 
                      value={couponCode} 
                      onChange={e => setCouponCode(e.target.value.toUpperCase())} 
                      placeholder="e.g. SUMMER20" 
                      className="uppercase font-mono tracking-wider"
                    />
                    <Button variant="outline" onClick={generateCoupon}>Generate</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Customers must enter this code at checkout.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input 
                  type="date" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date (Optional)</label>
                <Input 
                  type="date" 
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Display Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { key: 'showBadge', label: 'Show "Sale" Badge on Products', state: showBadge, set: setShowBadge },
                { key: 'highlightPercentage', label: 'Highlight Discount %', state: highlightPercentage, set: setHighlightPercentage },
                { key: 'showTimer', label: 'Show Countdown Timer', state: showTimer, set: setShowTimer },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <label className="text-sm cursor-pointer flex-1" htmlFor={item.key}>{item.label}</label>
                  <input 
                    type="checkbox" 
                    id={item.key} 
                    checked={item.state} 
                    onChange={e => item.set(e.target.checked)}
                    className="w-4 h-4 rounded text-primary cursor-pointer"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
