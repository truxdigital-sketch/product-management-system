import { useState } from 'react';
import { 
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Sparkles,
  Settings as SettingsIcon,
  Package,
  Tags,
  Globe,
  Truck,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/utils';
import { aiService } from '@/services/ai';

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
  const [activeTab, setActiveTab] = useState('general');

  // Form States
  const [productName, setProductName] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');

  // AI Loading States
  const [isGeneratingShort, setIsGeneratingShort] = useState(false);
  const [isGeneratingFull, setIsGeneratingFull] = useState(false);

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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/products')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Add Product</h2>
            <p className="text-muted-foreground">Create a new product for your store.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Save as Draft</Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Publish
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
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL Slug</label>
                    <Input placeholder="premium-wireless-headphones" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center justify-between">
                      Short Description
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs text-primary gap-1 px-2"
                        onClick={handleGenerateShortDesc}
                        disabled={isGeneratingShort}
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
                        disabled={isGeneratingFull}
                      >
                        {isGeneratingFull ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                        {isGeneratingFull ? "Generating..." : "AI Generate"}
                      </Button>
                    </label>
                    <div className="border rounded-md min-h-[200px] p-3 text-muted-foreground bg-muted/20 relative">
                      {fullDesc ? (
                         <div dangerouslySetInnerHTML={{ __html: fullDesc }} className="prose prose-sm dark:prose-invert max-w-none text-foreground" />
                      ) : (
                         "Rich text editor placeholder (e.g. TipTap / Quill)"
                      )}
                    </div>
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
                  <div className="border-2 border-dashed rounded-xl p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-medium">Drag & drop your images here</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      JPEG, PNG or WEBP. Max file size 5MB.
                    </p>
                    <Button variant="secondary">Select Files</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Strategy</CardTitle>
                  <CardDescription>Set regular and promotional pricing.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Regular Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input type="number" placeholder="0.00" className="pl-7" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sale Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input type="number" placeholder="0.00" className="pl-7" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cost per item (Cost Price)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input type="number" placeholder="0.00" className="pl-7" />
                    </div>
                    <p className="text-xs text-muted-foreground">Customers won't see this. Used for margin calculations.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {(activeTab === 'inventory' || activeTab === 'categories' || activeTab === 'shipping') && (
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
