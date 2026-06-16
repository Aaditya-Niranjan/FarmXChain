-- FarmXChain Database Setup Script
-- MySQL Version

-- Create Database
CREATE DATABASE IF NOT EXISTS farmxchain_db;
USE farmxchain_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('FARMER', 'DISTRIBUTOR', 'RETAILER', 'CONSUMER', 'ADMIN') NOT NULL DEFAULT 'FARMER',
    status ENUM('PENDING', 'VERIFIED', 'ACTIVE', 'SUSPENDED', 'DELETED') NOT NULL DEFAULT 'PENDING',
    phone_number VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(10),
    balance DECIMAL(15,2) NOT NULL DEFAULT 500000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Farmers Table
CREATE TABLE IF NOT EXISTS farmers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    farm_name VARCHAR(255) NOT NULL,
    farm_location VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    farm_size_acres DECIMAL(10,2),
    crop_type VARCHAR(255) NOT NULL,
    crop_varieties VARCHAR(255),
    farming_method VARCHAR(100),
    license_number VARCHAR(100),
    aadhar_number VARCHAR(20),
    bank_account_holder VARCHAR(255),
    bank_account_number VARCHAR(20),
    bank_ifsc_code VARCHAR(20),
    bank_name VARCHAR(100),
    upi_id VARCHAR(100),
    verification_status ENUM('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'RESUBMITTED') NOT NULL DEFAULT 'PENDING',
    verified_by BIGINT NULL,
    verified_at TIMESTAMP NULL,
    rejection_reason TEXT,
    experience_years INT,
    certification VARCHAR(255),
    total_produce_kg DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_farmers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_verification_status (verification_status),
    INDEX idx_crop_type (crop_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Index for Performance
CREATE INDEX idx_users_email_status ON users(email, status);
CREATE INDEX idx_farmers_user_verification ON farmers(user_id, verification_status);

-- Sample Data (Optional - Comment out if not needed)

-- Insert Sample Admin User (Password: AdminPass@123)
-- Password hash: $2a$10$slYQmyNdGzin7olVN3p5be39ijY.P35eCSqbVxVgNNbIQgLJG2ejm
INSERT INTO users (email, name, password, role, status, is_verified, created_at) VALUES 
('admin@farmxchain.com', 'Admin User', '$2a$10$slYQmyNdGzin7olVN3p5be39ijY.P35eCSqbVxVgNNbIQgLJG2ejm', 'ADMIN', 'ACTIVE', TRUE, NOW());

-- Insert Sample Farmer User (Password: Farmer@123)
-- Password hash: $2a$10$6nQJglPVqL8F/XZ.N2qL0uB/F9qgJdK8pM9vL3K2pQ7R8v9X2e9dO
INSERT INTO users (email, name, password, role, status, phone_number, address, city, state, postal_code, is_verified, created_at) VALUES 
('farmer1@farmxchain.com', 'Raj Kumar Singh', '$2a$10$6nQJglPVqL8F/XZ.N2qL0uB/F9qgJdK8pM9vL3K2pQ7R8v9X2e9dO', 'FARMER', 'ACTIVE', '+91-9876543210', '123 Farm Lane', 'Jaipur', 'Rajasthan', '302001', TRUE, NOW());

-- Insert Sample Farmer Profile
INSERT INTO farmers (user_id, farm_name, farm_location, latitude, longitude, farm_size_acres, crop_type, crop_varieties, farming_method, license_number, aadhar_number, bank_account_holder, bank_account_number, bank_ifsc_code, bank_name, upi_id, verification_status, verified_by, verified_at, experience_years, created_at) VALUES 
(2, 'Sunflower Fields', 'Jaipur, Rajasthan', 26.9124, 75.7873, 50.00, 'Wheat', 'HD2733, HD2864', 'Conventional', 'LIC-2024-001', '1234-5678-9012-3456', 'Raj Kumar Singh', '123456789012', 'HDFC0001234', 'HDFC Bank', 'raj@hdfc', 'VERIFIED', 1, NOW(), 15, NOW());

-- Create View for Dashboard Statistics
CREATE VIEW farmer_statistics AS
SELECT 
    COUNT(*) as total_farmers,
    SUM(CASE WHEN verification_status = 'VERIFIED' THEN 1 ELSE 0 END) as verified_farmers,
    SUM(CASE WHEN verification_status = 'PENDING' THEN 1 ELSE 0 END) as pending_farmers,
    SUM(CASE WHEN verification_status = 'REJECTED' THEN 1 ELSE 0 END) as rejected_farmers,
    COUNT(DISTINCT crop_type) as crop_types,
    ROUND(SUM(farm_size_acres), 2) as total_farm_size_acres
FROM farmers;

-- Create View for User Statistics
CREATE VIEW user_statistics AS
SELECT 
    COUNT(*) as total_users,
    SUM(CASE WHEN role = 'FARMER' THEN 1 ELSE 0 END) as total_farmers,
    SUM(CASE WHEN role = 'DISTRIBUTOR' THEN 1 ELSE 0 END) as total_distributors,
    SUM(CASE WHEN role = 'RETAILER' THEN 1 ELSE 0 END) as total_retailers,
    SUM(CASE WHEN role = 'CONSUMER' THEN 1 ELSE 0 END) as total_consumers,
    SUM(CASE WHEN role = 'ADMIN' THEN 1 ELSE 0 END) as total_admins,
    SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) as active_users,
    SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending_users
FROM users;

-- Display Tables Info
SELECT 'Database Setup Completed Successfully!' as Status;
SELECT COUNT(*) as Total_Users FROM users;
SELECT COUNT(*) as Total_Farmers FROM farmers;

-- Crops Table
CREATE TABLE IF NOT EXISTS crops (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    farmer_id BIGINT NOT NULL,
    crop_name VARCHAR(255) NOT NULL,
    quantity_kg DECIMAL(10,2) NOT NULL,
    price_per_kg DECIMAL(10,2) NOT NULL,
    harvest_date DATETIME NOT NULL,
    quality_certificate_url VARCHAR(255),
    blockchain_hash VARCHAR(255),
    blockchain_tx_hash VARCHAR(255),
    origin_location VARCHAR(255),
    quality_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    INDEX idx_crop_farmer (farmer_id),
    INDEX idx_crop_blockchain (blockchain_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Crop Data
INSERT INTO crops (id, farmer_id, crop_name, quantity_kg, price_per_kg, harvest_date, origin_location, quality_data, created_at, blockchain_hash) VALUES 
(1, 1, 'Wheat', 1000.50, 45.00, NOW(), 'Jaipur, Rajasthan', 'Grade A Quality', NOW(), '0x123456789abcdef');

SELECT COUNT(*) as Total_Crops FROM crops;

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    buyer_id BIGINT NOT NULL,
    farmer_id BIGINT NOT NULL,
    crop_id BIGINT NOT NULL,
    quantity DECIMAL(15,2) NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    blockchain_tx_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (farmer_id) REFERENCES farmers(id),
    FOREIGN KEY (crop_id) REFERENCES crops(id),
    INDEX idx_order_buyer (buyer_id),
    INDEX idx_order_farmer (farmer_id),
    INDEX idx_order_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Shipments Table
CREATE TABLE IF NOT EXISTS shipments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT UNIQUE NOT NULL,
    current_location VARCHAR(255),
    temperature DOUBLE PRECISION,
    humidity DOUBLE PRECISION,
    status ENUM('PENDING', 'IN_TRANSIT', 'DELAYED', 'DELIVERED', 'RETURNED') NOT NULL DEFAULT 'PENDING',
    blockchain_tx_hash VARCHAR(255),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_shipment_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT COUNT(*) as Total_Orders FROM orders;
SELECT COUNT(*) as Total_Shipments FROM shipments;
