-- TechDrill2026 Seed Data
-- Run after schema.sql

USE techdrill2026;

-- Test users (password for all: "Test@123")
-- bcrypt hash of "Test@123" with 10 rounds
INSERT INTO users (username, email, password, role, status) VALUES
('Aarav Menon',    'customer@techdrill.dev',   '$2b$10$HmMRMBi1fC6zAySX7FSPEuHY9XQU.494eQulgqgUd0mIKIed/2l1K', 'customer',   'active'),
('Nisha Rao',      'admin@techdrill.dev',      '$2b$10$HmMRMBi1fC6zAySX7FSPEuHY9XQU.494eQulgqgUd0mIKIed/2l1K', 'admin',      'active'),
('Ishaan Kapoor',  'superadmin@techdrill.dev', '$2b$10$HmMRMBi1fC6zAySX7FSPEuHY9XQU.494eQulgqgUd0mIKIed/2l1K', 'superadmin', 'active'),
('Sara Bhat',      'newuser@techdrill.dev',    '$2b$10$HmMRMBi1fC6zAySX7FSPEuHY9XQU.494eQulgqgUd0mIKIed/2l1K', 'customer',   'pending'),
('Dev Malhotra',   'blocked@techdrill.dev',    '$2b$10$HmMRMBi1fC6zAySX7FSPEuHY9XQU.494eQulgqgUd0mIKIed/2l1K', 'customer',   'blocked');

-- Products (match frontend mocks exactly)
INSERT INTO products (name, category, price, originalPrice, image, description, stock, badge, targetGroup, reorder_level, sku) VALUES
('Velocity Sprint', 'Running',   6499, 7999, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', 'Lightweight daily trainer built for long city miles.', 12, 'New', 'Men', 10, 'TD-RUN-001'),
('Studio Court',    'Lifestyle',  5899, 6199, 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=900&q=80', 'Minimal low-top silhouette with premium leather finish.', 8, 'Bestseller', 'Women', 8, 'TD-LIFE-014'),
('Summit Trek',     'Outdoor',    7299, 8599, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80', 'Trail-ready support with all-weather grip and cushioning.', 5, 'Low stock', 'Unisex', 7, 'TD-OUT-009'),
('Metro Glide',     'Lifestyle',  5299, 6199, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80', 'Soft neutral palette with cushioned comfort for all-day wear.', 16, 'Weekend pick', 'Men', 10, 'TD-LIFE-020'),
('Circuit Pulse',   'Training',   6999, 7200, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80', 'Stability-focused cross trainer for quick cuts and indoor sessions.', 10, 'Trainer', 'Women', 9, 'TD-TRN-022'),
('Canvas Draft',    'Casual',     3999, 4699, 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=900&q=80', 'Clean everyday canvas pair with a low-profile cup sole.', 21, 'Everyday', 'Unisex', 10, 'TD-CAS-031'),
('Hoops Pro',       'Basketball', 8999, 10999, 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=900&q=80', 'High-top support with superior ankle mobility for the court.', 14, 'Pro Series', 'Men', 5, 'TD-BSK-044'),
('Cloud Stride',    'Walking',    4599, 5299, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=80', 'Maximum cushioning designed specifically for walking comfort.', 20, 'Comfort', 'Women', 15, 'TD-WLK-051'),
('Pitch Cleat',     'Football',   6299, 7499, 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=900&q=80', 'Aggressive traction and lightweight build for explosive speed.', 18, 'Match Ready', 'Men', 8, 'TD-FTB-042'),
('Kickflip Retro',  'Skateboard', 5499, 5700, 'https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=900&q=80', 'Durable suede and reinforced toe for skateboarding.', 11, 'Retro', 'Unisex', 12, 'TD-SKT-028'),
('Marathon Elite',  'Running',    11999, 13999, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80', 'Carbon-plated racing shoe for elite marathon performance.', 4, 'Elite', 'Unisex', 3, 'TD-RUN-099'),
('Alpaca Sandal',   'Sandals',    2999, 3499, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&q=80', 'Adjustable straps with rugged outsole for light trails.', 30, 'Summer', 'Unisex', 20, 'TD-SNO-012');

-- Sample pricing campaigns
INSERT INTO pricing_campaigns (name, product_id, base_price, sale_price, starts_at, ends_at, status) VALUES
('Weekend sprint sale', 1, 6499, 5999, '2026-04-10 00:00:00', '2026-04-15 23:59:00', 'scheduled'),
('City edit markdown',  4, 5299, 4799, '2026-04-08 00:00:00', '2026-04-11 23:59:00', 'live'),
('Campus launch',       6, 3999, 3699, '2026-04-01 00:00:00', '2026-04-05 23:59:00', 'ended');

-- Sample price history
INSERT INTO price_history (product_id, amount, note, effective_at) VALUES
(1, 6499, 'Base price refresh for Q2.', '2026-04-01 00:00:00'),
(1, 5999, 'Weekend sprint sale.', '2026-04-10 00:00:00'),
(4, 4799, 'City edit markdown.', '2026-04-08 00:00:00');

-- Sample orders
INSERT INTO orders (user_id, total_amount, status, payment_method, payment_status, shipping_address, eta, tracking_note) VALUES
(1, 6499, 'dispatched', 'Razorpay', 'paid', '14 MG Road, Bengaluru', '2026-04-11 18:30:00', 'Packed at the Bengaluru hub and transferred to BlueDart.'),
(1, 9298, 'processed', 'UPI', 'paid', '87 Residency Road, Hyderabad', '2026-04-10 18:30:00', 'The warehouse team has completed QC and is printing labels.'),
(1, 5899, 'delivered', 'Card', 'paid', '22 Boat Club Road, Chennai', '2026-04-04 12:30:00', 'Delivered to the front desk. Customer marked the fit as perfect.');

INSERT INTO order_items (order_id, product_id, quantity, size, price) VALUES
(1, 1, 1, 'UK 9', 6499),
(2, 4, 1, 'UK 8', 5299),
(2, 6, 1, 'UK 8', 3999),
(3, 2, 1, 'UK 7', 5899);

-- Sample favourites
INSERT INTO favourites (user_id, product_id) VALUES
(1, 2), (1, 4), (1, 6);
