import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Ticket, Percent, DollarSign, Copy, Trash2, Calendar, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_purchase: number | null;
  max_uses: number | null;
  current_uses: number | null;
  valid_from: string | null;
  valid_until: string | null;
  status: string | null;
  created_at: string | null;
}

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_purchase: '',
    max_uses: '',
    valid_from: '',
    valid_until: '',
    hasExpiry: false,
    hasLimit: false,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const { data, error } = await supabase
      .from('coupon_codes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: 'Error loading coupons', variant: 'destructive' });
    } else {
      setCoupons(data || []);
    }
    setIsLoading(false);
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const couponData = {
      code: formData.code.toUpperCase(),
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value),
      min_purchase: formData.min_purchase ? parseFloat(formData.min_purchase) : 0,
      max_uses: formData.hasLimit && formData.max_uses ? parseInt(formData.max_uses) : null,
      valid_from: formData.hasExpiry && formData.valid_from ? formData.valid_from : null,
      valid_until: formData.hasExpiry && formData.valid_until ? formData.valid_until : null,
      created_by: user?.id,
      status: 'active',
    };

    const { error } = await supabase.from('coupon_codes').insert(couponData);
    
    if (error) {
      toast({ title: 'Error creating coupon', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Coupon created successfully' });
      setIsDialogOpen(false);
      fetchCoupons();
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('coupon_codes').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error deleting coupon', variant: 'destructive' });
    } else {
      toast({ title: 'Coupon deleted' });
      fetchCoupons();
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Copied to clipboard', description: code });
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: '',
      min_purchase: '',
      max_uses: '',
      valid_from: '',
      valid_until: '',
      hasExpiry: false,
      hasLimit: false,
    });
  };

  const getStatusBadge = (coupon: Coupon) => {
    if (coupon.status === 'disabled') return <Badge variant="secondary">Disabled</Badge>;
    if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (coupon.max_uses && (coupon.current_uses || 0) >= coupon.max_uses) {
      return <Badge variant="secondary">Maxed Out</Badge>;
    }
    return <Badge className="bg-secondary/20 text-secondary">Active</Badge>;
  };

  const totalSaved = coupons.reduce((acc, c) => {
    const uses = c.current_uses || 0;
    if (c.discount_type === 'fixed') {
      return acc + (c.discount_value * uses);
    }
    return acc + (uses * 10); // Approximate average
  }, 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Coupon Codes</h1>
            <p className="text-muted-foreground">Create and manage discount codes</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg glass-strong">
              <DialogHeader>
                <DialogTitle>Create New Coupon</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="code">Coupon Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="SAVE20"
                      className="uppercase"
                      required
                    />
                    <Button type="button" variant="outline" onClick={generateCode}>
                      Generate
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discount_type">Discount Type</Label>
                    <Select value={formData.discount_type} onValueChange={(v) => setFormData({ ...formData, discount_type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="discount_value">
                      {formData.discount_type === 'percentage' ? 'Percentage Off' : 'Amount Off ($)'}
                    </Label>
                    <Input
                      id="discount_value"
                      type="number"
                      step="0.01"
                      value={formData.discount_value}
                      onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                      placeholder={formData.discount_type === 'percentage' ? '20' : '10.00'}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="min_purchase">Minimum Purchase ($)</Label>
                  <Input
                    id="min_purchase"
                    type="number"
                    step="0.01"
                    value={formData.min_purchase}
                    onChange={(e) => setFormData({ ...formData, min_purchase: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <Label htmlFor="hasLimit" className="cursor-pointer">Limit total uses</Label>
                  <Switch
                    id="hasLimit"
                    checked={formData.hasLimit}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasLimit: checked })}
                  />
                </div>
                {formData.hasLimit && (
                  <div>
                    <Label htmlFor="max_uses">Maximum Uses</Label>
                    <Input
                      id="max_uses"
                      type="number"
                      value={formData.max_uses}
                      onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                      placeholder="100"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <Label htmlFor="hasExpiry" className="cursor-pointer">Set expiration dates</Label>
                  <Switch
                    id="hasExpiry"
                    checked={formData.hasExpiry}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasExpiry: checked })}
                  />
                </div>
                {formData.hasExpiry && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="valid_from">Valid From</Label>
                      <Input
                        id="valid_from"
                        type="datetime-local"
                        value={formData.valid_from}
                        onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="valid_until">Valid Until</Label>
                      <Input
                        id="valid_until"
                        type="datetime-local"
                        value={formData.valid_until}
                        onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                <Button type="submit" className="w-full">Create Coupon</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Ticket className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{coupons.length}</p>
                  <p className="text-sm text-muted-foreground">Total Coupons</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-secondary/20">
                  <Percent className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{coupons.filter(c => c.status === 'active').length}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-accent/20">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{coupons.reduce((acc, c) => acc + (c.current_uses || 0), 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Redemptions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-chart-4/20">
                  <DollarSign className="h-6 w-6 text-chart-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${totalSaved.toFixed(0)}</p>
                  <p className="text-sm text-muted-foreground">Total Saved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coupons List */}
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <Card key={coupon.id} variant="elevated">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                      {coupon.discount_type === 'percentage' ? (
                        <Percent className="h-6 w-6 text-primary" />
                      ) : (
                        <DollarSign className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <code className="text-lg font-mono font-bold tracking-wider">{coupon.code}</code>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyCode(coupon.code)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% off` : `$${coupon.discount_value} off`}
                        {(coupon.min_purchase || 0) > 0 && ` • Min $${coupon.min_purchase}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-lg font-bold">{coupon.current_uses || 0}{coupon.max_uses ? `/${coupon.max_uses}` : ''}</p>
                      <p className="text-xs text-muted-foreground">Uses</p>
                    </div>
                    {coupon.valid_until && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Expires {format(new Date(coupon.valid_until), 'MMM d')}</span>
                      </div>
                    )}
                    {getStatusBadge(coupon)}
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(coupon.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {coupons.length === 0 && !isLoading && (
          <Card variant="glass" className="text-center py-12">
            <CardContent>
              <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No coupons yet</h3>
              <p className="text-muted-foreground mb-4">Create your first discount code</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Create Coupon
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AdminCoupons;
