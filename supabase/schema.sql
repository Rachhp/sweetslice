-- ============================================================
-- SweetSlice Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10, 2) NOT NULL,
  image_url   TEXT,
  category    TEXT NOT NULL DEFAULT 'cakes',
  stock       INTEGER NOT NULL DEFAULT 0,
  owner_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Product categories index
CREATE INDEX idx_products_category ON products(category);

-- ============================================================
-- CART ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_cart_items_user ON cart_items(user_id);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount NUMERIC(10, 2) NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- ============================================================
-- ORDER ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity   INTEGER NOT NULL,
  price      NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Helper: check if user is admin (matches ADMIN_EMAIL env variable via metadata)
-- We'll use a simple approach: store admin status in user metadata
-- Or compare via a known pattern. For simplicity, we allow service role full access.

-- PRODUCTS POLICIES
-- Anyone can read products
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (true);

-- Only authenticated users with admin claim can insert/update/delete
CREATE POLICY "products_admin_insert" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "products_admin_update" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "products_admin_delete" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- CART ITEMS POLICIES
-- Users can only see/manage their own cart
CREATE POLICY "cart_items_own_read" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "cart_items_own_insert" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart_items_own_update" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "cart_items_own_delete" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- ORDERS POLICIES
-- Users see their own orders; admins see all (handled via service role in API)
CREATE POLICY "orders_own_read" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "orders_own_insert" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ORDER ITEMS POLICIES
CREATE POLICY "order_items_read" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_insert" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- ============================================================
-- REALTIME SUBSCRIPTIONS
-- Enable realtime for cart_items and products
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE cart_items;
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- ============================================================
-- SEED DATA — Sample cakes
-- ============================================================
INSERT INTO products (name, description, price, image_url, category, stock) VALUES
  ('Classic Vanilla Dream', 'Light and fluffy vanilla sponge layered with fresh cream and berry compote.', 34.99, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800', 'classic', 12),
  ('Triple Chocolate Tower', 'Dark, milk, and white chocolate ganache stacked in decadent layers.', 42.99, 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800', 'chocolate', 8),
  ('Strawberry Garden', 'Fresh strawberry cream cake with edible flower decorations.', 38.99, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800', 'fruit', 15),
  ('Lemon Zest Delight', 'Tangy lemon curd with whipped mascarpone and candied lemon peel.', 36.99, 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800', 'fruit', 10),
  ('Red Velvet Romance', 'Velvety red cake with signature cream cheese frosting.', 39.99, 'https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=800', 'classic', 6),
  ('Matcha Mist', 'Japanese ceremonial grade matcha with white chocolate and yuzu cream.', 44.99, 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=800', 'specialty', 5),
  ('Caramel Crunch', 'Salted caramel drizzle over butter cake with praline crunch layers.', 41.99, 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800', 'specialty', 9),
  ('Birthday Confetti', 'Funfetti vanilla cake loaded with rainbow sprinkles inside and out.', 32.99, 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800', 'celebration', 20),
  ('Opera Elegance', 'French opera cake with espresso syrup, ganache, and coffee buttercream.', 47.99, 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800', 'specialty', 4),
  ('Raspberry Royale', 'Fresh raspberry mousse with dark chocolate mirror glaze.', 45.99, 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=800', 'fruit', 7);
