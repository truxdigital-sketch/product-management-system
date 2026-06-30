import { useState } from 'react';
import { Search, CheckCircle, XCircle, Trash2, Star, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useReviewStore } from '@/store/useReviewStore';
import { useProductStore } from '@/store/useProductStore';
import { ConfirmModal } from '@/components/ui/modal';

export function Reviews() {
  const { reviews, updateReviewStatus, deleteReview } = useReviewStore();
  const { products } = useProductStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const getProductName = (id: string) => {
    return products.find(p => p.id === id)?.name || 'Unknown Product';
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.comment.toLowerCase().includes(searchTerm.toLowerCase()) || r.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
          <p className="text-muted-foreground">Manage and moderate product ratings and feedback.</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by customer or keyword..."
              className="w-full pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="flex items-center border rounded-md px-3 bg-muted/50 h-10">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <select 
                className="bg-transparent border-none outline-none text-sm focus:ring-0 cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Reviews</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="w-[300px]">Review</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No reviews found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.customer_name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm truncate max-w-[150px]">
                    {getProductName(review.product_id)}
                  </TableCell>
                  <TableCell>{renderStars(review.rating)}</TableCell>
                  <TableCell>
                    <p className="text-sm line-clamp-2" title={review.comment}>{review.comment}</p>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        review.status === 'approved' ? 'success' : 
                        review.status === 'rejected' ? 'destructive' : 'warning'
                      }
                      className="capitalize"
                    >
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {review.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="icon" title="Approve" onClick={() => updateReviewStatus(review.id, 'approved')}>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Reject" onClick={() => updateReviewStatus(review.id, 'rejected')}>
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" title="Delete" onClick={() => setReviewToDelete(review.id)}>
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
        isOpen={!!reviewToDelete}
        onClose={() => setReviewToDelete(null)}
        onConfirm={() => {
          if (reviewToDelete) deleteReview(reviewToDelete);
          setReviewToDelete(null);
        }}
        title="Delete Review"
        description="Are you sure you want to delete this review permanently?"
        variant="destructive"
        confirmText="Delete"
      />
    </div>
  );
}
