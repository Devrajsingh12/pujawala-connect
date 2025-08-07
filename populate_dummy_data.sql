-- Insert sample shop items
INSERT INTO shop_items (name, description, price, image_url) VALUES
('Sacred Rudraksha Mala', 'Authentic 108 beads Rudraksha mala for meditation and spiritual practice. Made from genuine Rudraksha seeds.', 1499, '/placeholder.svg'),
('Brass Ganesha Idol', 'Handcrafted brass Ganesha idol for home temple and daily worship. Height: 6 inches.', 2999, '/placeholder.svg'),
('Sandalwood Incense Sticks', 'Premium quality sandalwood incense sticks for aromatic prayers. Pack of 50 sticks.', 299, '/placeholder.svg'),
('Copper Kalash', 'Traditional copper kalash for puja ceremonies and rituals. Ideal for festivals.', 899, '/placeholder.svg'),
('Tulsi Plant with Pot', 'Sacred Tulsi plant with decorative terracotta pot for spiritual benefits and daily worship.', 599, '/placeholder.svg'),
('Pure Camphor Tablets', 'Pure camphor tablets for aarti and spiritual ceremonies. Pack of 20 tablets.', 199, '/placeholder.svg'),
('Silver Pooja Thali Set', 'Complete silver plated pooja thali set with diya, incense holder, and accessories.', 3499, '/placeholder.svg'),
('Bhagavad Gita Book', 'Sacred Bhagavad Gita with Hindi and English translation. Hardcover edition.', 799, '/placeholder.svg'),
('Marble Shiva Lingam', 'Beautiful marble Shiva Lingam for home temple worship. Hand-carved with base.', 1899, '/placeholder.svg'),
('Crystal Mala Beads', 'Clear crystal mala with 108 beads for meditation and chanting. Authentic healing crystals.', 999, '/placeholder.svg'),
('Brass Oil Lamp (Diya)', 'Traditional brass oil lamp for daily aarti and festivals. Decorative design.', 399, '/placeholder.svg'),
('Kumkum and Turmeric Set', 'Organic kumkum and turmeric powder set for tilaka and religious ceremonies.', 149, '/placeholder.svg');

-- Note: To insert pandit profiles, you would need actual user IDs from the auth.users table
-- This would typically be done after users register as pandits through the application

-- Example of how pandit profiles would be inserted (with real user IDs):
-- INSERT INTO profiles (id, email, full_name, is_pandit, phone, address, specialization, experience_years, rate_per_hour) VALUES
-- ('real-user-id-1', 'pandit1@example.com', 'Pandit Ramesh Sharma', true, '+91 9876543210', 'Varanasi, Uttar Pradesh', 'Vedic Rituals, Wedding Ceremonies', 15, 2000),
-- ('real-user-id-2', 'pandit2@example.com', 'Pandit Suresh Gupta', true, '+91 9876543211', 'Haridwar, Uttarakhand', 'Griha Pravesh, Puja Ceremonies', 12, 1800),
-- ('real-user-id-3', 'pandit3@example.com', 'Pandit Mahesh Tiwari', true, '+91 9876543212', 'Mathura, Uttar Pradesh', 'Krishna Puja, Bhagavat Katha', 20, 2500);
