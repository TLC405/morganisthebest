import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, DollarSign, Package, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Order {
  id: string;
  user_id: string;
  items: any;
  subtotal: number;
  discount_applied: number | null;
  coupon_code: string | null;
  total: number;
  status: string | null;
  created_at: string | null;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: 'Error loading orders', variant: 'destructive' });
    } else {
      setOrders(data || []);
    }
    setIsLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    
    if (error) {
      toast({ title: 'Error updating order', variant: 'destructive' });
    } else {
      toast({ title: `Order ${status}` });
      fetchOrders();
    }
  };

  const getStatusBadge = (status: string | null) => {
    const configs: Record<string, { color: string; icon: React.ElementType }> = {
      pending: { color: 'bg-yellow-500/20 text-yellow-500', icon: Clock },
      paid: { color: 'bg-blue-500/20 text-blue-500', icon: DollarSign },
      fulfilled: { color: 'bg-secondary/20 text-secondary', icon: CheckCircle },
      cancelled: { color: 'bg-destructive/20 text-destructive', icon: XCircle },
      refunded: { color: 'bg-muted text-muted-foreground', icon: RefreshCw },
    };
    const config = configs[status || 'pending'] || configs.pending;
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status || 'pending'}
      </Badge>
    );
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const totalRevenue = orders.filter(o => o.status === 'paid' || o.status === 'fulfilled')
    .reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const fulfilledOrders = orders.filter(o => o.status === 'fulfilled').length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground">Manage and fulfill customer orders</p>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="fulfilled">Fulfilled</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/20">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-yellow-500/20">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingOrders}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-secondary/20">
                  <Package className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{fulfilledOrders}</p>
                  <p className="text-sm text-muted-foreground">Fulfilled</p>
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
                  <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const items = order.items as any[];
            return (
              <Card key={order.id} variant="elevated">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <code className="text-sm font-mono text-muted-foreground">
                          #{order.id.slice(0, 8)}
                        </code>
                        {getStatusBadge(order.status)}
                        {order.coupon_code && (
                          <Badge variant="outline" className="text-xs">
                            Coupon: {order.coupon_code}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {items?.map((item: any, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {item.name} × {item.quantity}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.created_at && format(new Date(order.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <div>
                        {(order.discount_applied || 0) > 0 && (
                          <p className="text-sm text-secondary">-${order.discount_applied?.toFixed(2)}</p>
                        )}
                        <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => updateOrderStatus(order.id, 'paid')}>
                              Mark Paid
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, 'cancelled')}>
                              Cancel
                            </Button>
                          </>
                        )}
                        {order.status === 'paid' && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'fulfilled')}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Fulfill
                          </Button>
                        )}
                        {order.status === 'fulfilled' && (
                          <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, 'refunded')}>
                            Refund
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredOrders.length === 0 && !isLoading && (
          <Card variant="elevated" className="text-center py-12">
            <CardContent>
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders yet</h3>
              <p className="text-muted-foreground">Orders will appear here when customers make purchases</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AdminOrders;
