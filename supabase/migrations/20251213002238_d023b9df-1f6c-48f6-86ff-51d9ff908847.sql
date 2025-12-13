-- Create shop_products table
CREATE TABLE public.shop_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  category TEXT CHECK (category IN ('merch', 'ticket', 'membership', 'upgrade')),
  image_url TEXT,
  inventory_count INT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create coupon_codes table
CREATE TABLE public.coupon_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase DECIMAL(10,2) DEFAULT 0,
  max_uses INT,
  current_uses INT DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  applicable_products UUID[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'disabled')),
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  discount_applied DECIMAL(10,2) DEFAULT 0,
  coupon_code TEXT,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Shop products policies (public read, admin/team manage)
CREATE POLICY "Anyone can view active products"
ON public.shop_products FOR SELECT
USING (status = 'active');

CREATE POLICY "Admins can manage products"
ON public.shop_products FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Team can view all products"
ON public.shop_products FOR SELECT
USING (has_role(auth.uid(), 'team'));

-- Coupon codes policies (admin manage, team view)
CREATE POLICY "Admins can manage coupons"
ON public.coupon_codes FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Team can view coupons"
ON public.coupon_codes FOR SELECT
USING (has_role(auth.uid(), 'team'));

-- Orders policies
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders"
ON public.orders FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Team can view all orders"
ON public.orders FOR SELECT
USING (has_role(auth.uid(), 'team'));

-- Update triggers
CREATE TRIGGER update_shop_products_updated_at
BEFORE UPDATE ON public.shop_products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();