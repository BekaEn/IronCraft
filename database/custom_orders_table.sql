-- Custom Orders Table
CREATE TABLE IF NOT EXISTS custom_orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customerName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  designImage VARCHAR(512) NOT NULL,
  width VARCHAR(50) NOT NULL,
  height VARCHAR(50) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  additionalDetails TEXT,
  status ENUM('pending', 'in_review', 'approved', 'in_production', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  estimatedPrice DECIMAL(10, 2),
  adminNotes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created_at (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
