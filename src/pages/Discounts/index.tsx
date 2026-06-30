import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Copy, Tag, Calendar, Activity, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { useDiscountStore } from '@/store/useDiscountStore';
import { ConfirmModal } from '@/components/ui/modal';

export function Discounts() {
  const navigate = useNavigate();
  const { offers, deleteOffer, duplicateOffer } = useDiscountStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);

  const filteredOffers = offers.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.coupon_code && o.coupon_code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeCount = offers.filter(o => o.status === 'active').length;
  const scheduledCount = offers.filter(o => o.status === 'scheduled').length;
  const expiredCount = offers.filter(o => o.status === 'expired').length;
  const totalUses = offers.reduce((acc, curr) => acc + curr.usage_count, 0);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return <Badge variant="success" className="gap-1"><CheckCircle className="w-3 h-3" /> Active</Badge>;
      case 'scheduled': return <Badge variant="warning" className="gap-1"><Clock className="w-3 h-3" /> Scheduled</Badge>;
      case 'expired': return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Expired</Badge>;
      default: return <Badge variant="secondary" className="gap-1"><Tag className="w-3 h-3" /> Draft</Badge>;
    }
  };

  const formatDiscount = (type: string, value: number) => {
    if (type === 'percentage') return `${value}% Off`;
    if (type === 'fixed') return `$${value} Off`;
    if (type === 'free_shipping') return 'Free Shipping';
    if (type === 'bogo') return 'BOGO';
    return `${value} Off`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Discounts & Offers</h2>
          <p className="text-muted-foreground">Manage sales, coupons, and promotional campaigns.</p>
        </div>
        <Button onClick={() => navigate('/discounts/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Offer
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" /> Active Offers
            </span>
            <span className="text-2xl font-bold">{activeCount}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" /> Scheduled
            </span>
            <span className="text-2xl font-bold">{scheduledCount}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" /> Total Usage
            </span>
            <span className="text-2xl font-bold">{totalUses}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <XCircle className="w-4 h-4 text-destructive" /> Expired
            </span>
            <span className="text-2xl font-bold">{expiredCount}</span>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or coupon code..."
              className="w-full pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Offer Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Discount Value</TableHead>
              <TableHead>Coupon Code</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOffers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No discounts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOffers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>
                    <div className="font-medium">{offer.name}</div>
                    <div className="text-sm text-muted-foreground">{offer.type.replace('_', ' ').toUpperCase()}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(offer.status)}</TableCell>
                  <TableCell className="font-medium text-primary">
                    {formatDiscount(offer.type, offer.discount_value)}
                  </TableCell>
                  <TableCell>
                    {offer.has_coupon && offer.coupon_code ? (
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono border">
                        {offer.coupon_code}
                      </code>
                    ) : (
                      <span className="text-muted-foreground text-sm">Automatic</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {offer.usage_count} {offer.max_uses ? `/ ${offer.max_uses}` : ''}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Edit" onClick={() => navigate(`/discounts/${offer.id}`)}>
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Duplicate" onClick={() => duplicateOffer(offer.id)}>
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete" onClick={() => setOfferToDelete(offer.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmModal
        isOpen={!!offerToDelete}
        onClose={() => setOfferToDelete(null)}
        onConfirm={() => {
          if (offerToDelete) deleteOffer(offerToDelete);
          setOfferToDelete(null);
        }}
        title="Delete Offer"
        description="Are you sure you want to delete this discount? Active carts using this offer may be affected."
        variant="destructive"
        confirmText="Delete Offer"
      />
    </div>
  );
}
