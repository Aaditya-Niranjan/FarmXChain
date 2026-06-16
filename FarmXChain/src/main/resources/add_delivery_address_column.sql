-- Add delivery_address column to orders table
-- This allows consumers and retailers to specify where crops should be delivered

ALTER TABLE orders 
ADD COLUMN delivery_address TEXT AFTER updated_at;

-- Verify the change
DESCRIBE orders;
