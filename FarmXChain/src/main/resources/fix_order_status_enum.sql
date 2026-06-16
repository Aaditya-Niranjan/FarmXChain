-- Fix for "Data truncated for column 'status'" error
-- Add missing ASSIGNED and IN_TRANSIT status values to orders table

-- Update the orders table status column to include new status values
ALTER TABLE orders 
MODIFY COLUMN status ENUM(
    'PENDING',
    'ACCEPTED', 
    'REJECTED',
    'ASSIGNED',      -- NEW: Order assigned to distributor
    'IN_TRANSIT',    -- NEW: Shipment in progress
    'SHIPPED',
    'DELIVERED',
    'COMPLETED',
    'CANCELLED'
) NOT NULL DEFAULT 'PENDING';

-- Verify the change
SHOW COLUMNS FROM orders LIKE 'status';
