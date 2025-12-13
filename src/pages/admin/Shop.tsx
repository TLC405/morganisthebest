import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Package, DollarSign, Edit2, Trash2, ShoppingBag, Tag, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  category: string | null;
  image_url: string | null;
  inventory_count: number | null;
  status: string | null;
  created_at: string | null;
}

const AdminShop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sale_price: '',
    category: 'merch',
    image_url: '',
    inventory_count: '0',
    status: 'active',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('shop_products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: 'Error loading products', variant: 'destructive' });
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      category: formData.category,
      image_url: formData.image_url || null,
      inventory_count: parseInt(formData.inventory_count),
      status: formData.status,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('shop_products')
        .update(productData)
        .eq('id', editingProduct.id);
      
      if (error) {
        toast({ title: 'Error updating product', variant: 'destructive' });
      } else {
        toast({ title: 'Product updated successfully' });
        setIsDialogOpen(false);
        fetchProducts();
      }
    } else {
      const { error } = await supabase
        .from('shop_products')
        .insert(productData);
      
      if (error) {
        toast({ title: 'Error creating product', variant: 'destructive' });
      } else {
        toast({ title: 'Product created successfully' });
        setIsDialogOpen(false);
        fetchProducts();
      }
    }

    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      sale_price: product.sale_price?.toString() || '',
      category: product.category || 'merch',
      image_url: product.image_url || '',
      inventory_count: product.inventory_count?.toString() || '0',
      status: product.status || 'active',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('shop_products').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error deleting product', variant: 'destructive' });
    } else {
      toast({ title: 'Product deleted' });
      fetchProducts();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      sale_price: '',
      category: 'merch',
      image_url: '',
      inventory_count: '0',
      status: 'active',
    });
    setEditingProduct(null);
  };

  const getCategoryBadge = (category: string | null) => {
    const colors: Record<string, string> = {
      merch: 'bg-secondary/20 text-secondary',
      ticket: 'bg-primary/20 text-primary',
      membership: 'bg-accent/20 text-accent',
      upgrade: 'bg-chart-4/20 text-chart-4',
    };
    return colors[category || 'merch'] || colors.merch;
  };

  const totalRevenue = products.reduce((acc, p) => acc + (p.price * (p.inventory_count || 0)), 0);
  const activeProducts = products.filter(p => p.status === 'active').length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Shop Manager</h1>
            <p className="text-muted-foreground">Manage products, tickets, and merchandise</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg glass-strong">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sale_price">Sale Price ($)</Label>
                    <Input
                      id="sale_price"
                      type="number"
                      step="0.01"
                      value={formData.sale_price}
                      onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="merch">Merchandise</SelectItem>
                        <SelectItem value="ticket">Event Ticket</SelectItem>
                        <SelectItem value="membership">Membership</SelectItem>
                        <SelectItem value="upgrade">Upgrade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="inventory">Inventory</Label>
                    <Input
                      id="inventory"
                      type="number"
                      value={formData.inventory_count}
                      onChange={(e) => setFormData({ ...formData, inventory_count: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{products.length}</p>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-secondary/20">
                  <ShoppingBag className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeProducts}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-accent/20">
                  <Tag className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{products.filter(p => p.sale_price).length}</p>
                  <p className="text-sm text-muted-foreground">On Sale</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-chart-4/20">
                  <TrendingUp className="h-6 w-6 text-chart-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${totalRevenue.toFixed(0)}</p>
                  <p className="text-sm text-muted-foreground">Inventory Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} variant="elevated" className="overflow-hidden">
              {product.image_url && (
                <div className="h-40 bg-muted overflow-hidden">
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge className={getCategoryBadge(product.category)}>
                      {product.category || 'merch'}
                    </Badge>
                  </div>
                  <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                    {product.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description || 'No description'}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    {product.sale_price ? (
                      <>
                        <span className="font-bold text-primary">${product.sale_price}</span>
                        <span className="text-sm line-through text-muted-foreground">${product.price}</span>
                      </>
                    ) : (
                      <span className="font-bold">${product.price}</span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{product.inventory_count} in stock</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleEdit(product)}>
                    <Edit2 className="h-3 w-3" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && !isLoading && (
          <Card variant="glass" className="text-center py-12">
            <CardContent>
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first product</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AdminShop;
