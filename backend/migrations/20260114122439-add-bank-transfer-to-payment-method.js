'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // For MySQL, we need to ALTER the ENUM type to add new value
    // This modifies the column to include the new enum value
    await queryInterface.sequelize.query(
      "ALTER TABLE `orders` MODIFY COLUMN `paymentMethod` ENUM('online', 'cash', 'bank_transfer') NOT NULL DEFAULT 'cash'"
    );
  },

  async down (queryInterface, Sequelize) {
    // Revert back to original ENUM (note: this will fail if any rows have 'bank_transfer')
    await queryInterface.sequelize.query(
      "ALTER TABLE `orders` MODIFY COLUMN `paymentMethod` ENUM('online', 'cash') NOT NULL DEFAULT 'cash'"
    );
  }
};
