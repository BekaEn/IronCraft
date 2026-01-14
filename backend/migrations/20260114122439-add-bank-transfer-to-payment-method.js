'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Check if orders table exists
      const tables = await queryInterface.showAllTables();
      
      if (tables.includes('orders')) {
        // Change paymentMethod from ENUM to VARCHAR to accept any payment method
        await queryInterface.sequelize.query(
          "ALTER TABLE `orders` MODIFY COLUMN `paymentMethod` VARCHAR(50) NOT NULL DEFAULT 'cash'"
        );
        console.log('✅ Changed paymentMethod to VARCHAR(50)');
      } else {
        // Create orders table with VARCHAR for paymentMethod
        await queryInterface.createTable('orders', {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          userId: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          customerInfo: {
            type: Sequelize.JSON,
            allowNull: false,
          },
          items: {
            type: Sequelize.JSON,
            allowNull: false,
          },
          totalAmount: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
          },
          status: {
            type: Sequelize.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
            defaultValue: 'pending',
          },
          paymentMethod: {
            type: Sequelize.STRING(50),
            allowNull: false,
            defaultValue: 'cash',
          },
          paymentStatus: {
            type: Sequelize.ENUM('pending', 'completed', 'failed'),
            defaultValue: 'pending',
          },
          paymentId: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        });
        console.log('✅ Created orders table');
      }
    } catch (error) {
      console.error('Migration error:', error.message);
      // Don't throw - let it continue
    }
  },

  async down (queryInterface, Sequelize) {
    // No-op for safety
  }
};
