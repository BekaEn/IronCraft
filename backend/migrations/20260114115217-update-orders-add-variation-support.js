'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Check if orders table exists
    const tableExists = await queryInterface.showAllTables().then(tables => 
      tables.includes('orders')
    );

    if (!tableExists) {
      // Create orders table if it doesn't exist
      await queryInterface.createTable('orders', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
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
          type: Sequelize.ENUM('online', 'cash'),
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
    }
    
    // The items field is already JSON, so it will support variation data
    // No schema changes needed - just ensuring table exists
  },

  async down (queryInterface, Sequelize) {
    // Don't drop the table in down migration to preserve data
    // await queryInterface.dropTable('orders');
  }
};
