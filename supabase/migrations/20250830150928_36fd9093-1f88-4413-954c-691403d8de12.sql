-- Create Users table
CREATE TABLE public.users (
  user_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  signup_date DATE NOT NULL,
  region TEXT NOT NULL CHECK (region IN ('North America', 'Europe', 'Asia', 'South America', 'Australia')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Orders table
CREATE TABLE public.orders (
  order_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  order_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a demo app)
CREATE POLICY "Users are publicly accessible" 
ON public.users 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Orders are publicly accessible" 
ON public.orders 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_users_signup_date ON public.users(signup_date);
CREATE INDEX idx_users_region ON public.users(region);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_order_date ON public.orders(order_date);
CREATE INDEX idx_orders_amount ON public.orders(amount);

-- Insert sample data for demonstration
INSERT INTO public.users (user_id, signup_date, region) VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-01-15', 'North America'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d480', '2024-01-20', 'Europe'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d481', '2024-02-10', 'Asia'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d482', '2024-02-15', 'North America'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d483', '2024-03-01', 'Europe'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d484', '2024-03-05', 'Asia'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d485', '2024-03-10', 'North America'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d486', '2024-04-01', 'Europe'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d487', '2024-04-15', 'Asia'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d488', '2024-05-01', 'North America');

INSERT INTO public.orders (order_id, user_id, order_date, amount) VALUES
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-01-16', 150.00),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-02-15', 200.00),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '2024-03-10', 175.00),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d480', '2024-01-25', 300.00),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d480', '2024-02-20', 250.00),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d481', '2024-02-12', 120.00),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d481', '2024-03-15', 180.00),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d482', '2024-02-20', 400.00),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d482', '2024-03-25', 350.00),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d482', '2024-04-10', 275.00),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d483', '2024-03-05', 190.00),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d483', '2024-04-12', 220.00),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d484', '2024-03-08', 160.00),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d485', '2024-03-15', 280.00),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d485', '2024-04-20', 320.00),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d486', '2024-04-05', 210.00),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d487', '2024-04-18', 140.00),
  (gen_random_uuid(), 'f47ac10b-58cc-4372-a567-0e02b2c3d488', '2024-05-05', 390.00);