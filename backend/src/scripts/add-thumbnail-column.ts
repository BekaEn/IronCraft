import { sequelize } from '../config/database';

async function addThumbnailColumn() {
  try {
    console.log('Checking if thumbnail column exists...');
    
    // Check if column exists
    const [results]: any = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'products' 
        AND COLUMN_NAME = 'thumbnail';
    `);
    
    if (results.length > 0) {
      console.log('✅ Thumbnail column already exists!');
      process.exit(0);
      return;
    }
    
    console.log('Adding thumbnail column to products table...');
    
    await sequelize.query(`
      ALTER TABLE products 
      ADD COLUMN thumbnail VARCHAR(500) DEFAULT NULL;
    `);
    
    console.log('✅ Thumbnail column added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding thumbnail column:', error);
    process.exit(1);
  }
}

addThumbnailColumn();
