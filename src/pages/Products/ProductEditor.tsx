import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Save, Image as ImageIcon, Sparkles, Settings as SettingsIcon, Package, Tags, Globe, Truck, Loader2, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/utils/utils';
import { aiService } from '@/services/ai';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useDiscountStore } from '@/store/useDiscountStore';
import type { ProductStatus } from '@/types';

const tabs = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'images', label: 'Images', icon: ImageIcon },
  { id: 'pricing', label: 'Pricing', icon: Globe },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'categories', label: 'Categories & Brand', icon: Tags },
  { id: 'shipping', label: 'Shipping', icon: Truck },
];

export function ProductEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, addProduct, updateProduct } = useProductStore();
  const { categories } = useCategoryStore();
  const { offers } = useDiscountStore();
  
  const [activeTab, setActiveTab] = useState('general');

  // Form States
  const [productName, setProductName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [activeOfferId, setActiveOfferId] = useState<string>('');
  const [comparePrice, setComparePrice] = useState<number | null>(null);
  const [costPrice, setCostPrice] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);

  // AI Loading States
  const [isGeneratingShort, setIsGeneratingShort] = useState(false);
  const [isGeneratingFull, setIsGeneratingFull] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      const existing = products.find(p => p.id === id);
      if (existing) {
        setProductName(existing.name);
        setSlug(existing.slug);
        setShortDesc(existing.short_description);
        setFullDesc(existing.description);
        setSku(existing.sku);
        setBarcode(existing.barcode);
        setPrice(existing.price);
        setSalePrice(existing.sale_price || '');
        setActiveOfferId(existing.active_offer_id || '');
        setComparePrice(existing.compare_at_price);
        setCostPrice(existing.cost_price);
        setCategoryId(existing.category_id || '');
        setImages(existing.images || []);
      }
    }
  }, [id, products]);

  const handleSave = (status: ProductStatus) => {
    const payload = {
      name: productName,
      slug,
      short_description: shortDesc,
      description: fullDesc,
      sku,
      barcode,
      price: Number(price),
      sale_price: salePrice === '' ? null : Number(salePrice),
      active_offer_id: activeOfferId || null,
      compare_at_price: comparePrice ? Number(comparePrice) : null,
      cost_price: costPrice ? Number(costPrice) : null,
      category_id: categoryId || null,
      brand_id: null,
      status,
      images
    };

    if (id) {
      updateProduct(id, payload);
    } else {
      addProduct(payload);
    }
    navigate('/products');
  };

  const handleGenerateShortDesc = async () => {
    setIsGeneratingShort(true);
    try {
      const result = await aiService.generateShortDescription({ productName });
      setShortDesc(result);
    } catch (error) {
      console.error("Failed to generate", error);
    } finally {
      setIsGeneratingShort(false);
    }
  };

  const handleGenerateFullDesc = async () => {
    setIsGeneratingFull(true);
    try {
      const result = await aiService.generateFullDescription({ productName });
      setFullDesc(result);
    } catch (error) {
      console.error("Failed to generate", error);
    } finally {
      setIsGeneratingFull(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/products')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{id ? 'Edit Product' : 'Add Product'}</h2>
            <p className="text-muted-foreground">{id ? 'Update product details.' : 'Create a new product for your store.'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave('draft')}>Save as Draft</Button>
          <Button className="gap-2" onClick={() => handleSave('published')}>
            <Save className="h-4 w-4" />
            {id ? 'Update & Publish' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0">
          <Card>
            <CardContent className="p-2">
              <nav className="flex flex-col space-y-1">
                {tabs.map((tab) => (
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
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the primary details for this product.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product Name</label>
                    <Input 
                      placeholder="e.g. Premium Wireless Headphones" 
                      value={productName}
                      onChange={(e) => {
                        setProductName(e.target.value);
                        if (!id && !slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL Slug</label>
                    <Input 
                      placeholder="premium-wireless-headphones" 
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">SKU</label>
                      <Input placeholder="e.g. WH-1000XM5" value={sku} onChange={e => setSku(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Barcode (UPC/EAN)</label>
                      <Input placeholder="e.g. 1234567890123" value={barcode} onChange={e => setBarcode(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center justify-between">
                      Short Description
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs text-primary gap-1 px-2"
                        onClick={handleGenerateShortDesc}
                        disabled={isGeneratingShort || !productName}
                      >
                        {isGeneratingShort ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                        {isGeneratingShort ? "Generating..." : "AI Generate"}
                      </Button>
                    </label>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                      placeholder="Brief overview of the product..."
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center justify-between">
                      Full Description
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs text-primary gap-1 px-2"
                        onClick={handleGenerateFullDesc}
                        disabled={isGeneratingFull || !productName}
                      >
                        {isGeneratingFull ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                        {isGeneratingFull ? "Generating..." : "AI Generate"}
                      </Button>
                    </label>
                    <textarea 
                      className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                      placeholder="Comprehensive product details..."
                      value={fullDesc}
                      onChange={(e) => setFullDesc(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>Upload high quality images of your product.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-md overflow-hidden border group">
                        <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div 
                    className="border-2 border-dashed rounded-xl p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-medium">Click to upload images</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      JPEG, PNG or WEBP. Max file size 5MB.
                    </p>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                    />
                    <Button variant="secondary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Select Files</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Discounts</CardTitle>
                  <CardDescription>Set regular pricing, sale pricing, and active promotional offers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Regular Price <span className="text-destructive">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input type="number" min="0" placeholder="0.00" className="pl-7" value={price} onChange={e => setPrice(Number(e.target.value))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Compare at Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input type="number" min="0" placeholder="0.00" className="pl-7" value={comparePrice || ''} onChange={e => setComparePrice(Number(e.target.value) || null)} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <h3 className="text-sm font-semibold mb-4">Discounts & Offers</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Sale Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                          <Input 
                            type="number" 
                            min="0" 
                            max={price}
                            placeholder="0.00" 
                            className="pl-7" 
                            value={salePrice} 
                            onChange={e => setSalePrice(e.target.value ? Number(e.target.value) : '')} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Active Promotional Offer</label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={activeOfferId}
                          onChange={(e) => setActiveOfferId(e.target.value)}
                        >
                          <option value="">None</option>
                          {offers.filter(o => o.status === 'active' || o.status === 'scheduled').map(offer => (
                            <option key={offer.id} value={offer.id}>
                              {offer.name} ({offer.type === 'percentage' ? `${offer.discount_value}% Off` : `$${offer.discount_value} Off`})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Dynamic Price Preview */}
                    <div className="bg-muted p-4 rounded-lg flex items-center justify-between border">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Final Selling Price Preview</p>
                        <div className="flex items-center gap-3">
                          {(salePrice || activeOfferId) ? (
                            <>
                              <span className="text-lg font-semibold text-primary">
                                ${ (() => {
                                  let finalPrice = Number(salePrice) || price;
                                  if (activeOfferId) {
                                    const offer = offers.find(o => o.id === activeOfferId);
                                    if (offer) {
                                      if (offer.type === 'percentage') {
                                        finalPrice = finalPrice * (1 - (offer.discount_value / 100));
                                      } else if (offer.type === 'fixed') {
                                        finalPrice = Math.max(0, finalPrice - offer.discount_value);
                                      }
                                    }
                                  }
                                  return finalPrice.toFixed(2);
                                })()}
                              </span>
                              <span className="text-sm text-muted-foreground line-through">${price.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="text-lg font-semibold">${price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                      
                      {(salePrice || activeOfferId) && price > 0 && (
                        <div className="text-right">
                           <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20">
                            {(() => {
                              let finalPrice = Number(salePrice) || price;
                              if (activeOfferId) {
                                const offer = offers.find(o => o.id === activeOfferId);
                                if (offer) {
                                  if (offer.type === 'percentage') finalPrice = finalPrice * (1 - (offer.discount_value / 100));
                                  else if (offer.type === 'fixed') finalPrice = Math.max(0, finalPrice - offer.discount_value);
                                }
                              }
                              const saved = price - finalPrice;
                              const percent = Math.round((saved / price) * 100);
                              return `${percent}% Savings`;
                            })()}
                           </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border/50">
                    <label className="text-sm font-medium">Cost per item (Cost Price)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input type="number" min="0" placeholder="0.00" className="pl-7" value={costPrice || ''} onChange={e => setCostPrice(Number(e.target.value) || null)} />
                    </div>
                    <p className="text-xs text-muted-foreground">Customers won't see this. Used for margin calculations.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                  <CardDescription>Assign categories and brands to your product.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {(activeTab === 'inventory' || activeTab === 'shipping') && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardContent className="p-12 text-center text-muted-foreground">
                Additional settings for {activeTab} will appear here.
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
