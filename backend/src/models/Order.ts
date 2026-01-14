import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';

export interface OrderAttributes {
  id?: number;
  userId?: number; // Optional for guest orders
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    documentNumber: string;
    address: string;
    comment?: string;
  };
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
    name: string;
    image?: string;
    variation?: {
      color: string;
      size: string;
      price: string;
      salePrice?: string | null;
    };
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'online' | 'cash';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentId?: string;
}

class Order extends Model<OrderAttributes> implements OrderAttributes {
  declare id: number;
  declare userId?: number;
  declare customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    documentNumber: string;
    address: string;
    comment?: string;
  };
  declare items: Array<{
    productId: number;
    quantity: number;
    price: number;
    name: string;
    image?: string;
    variation?: {
      color: string;
      size: string;
      price: string;
      salePrice?: string | null;
    };
  }>;
  declare totalAmount: number;
  declare status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  declare paymentMethod: 'online' | 'cash';
  declare paymentStatus: 'pending' | 'completed' | 'failed';
  declare paymentId?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Allow guest orders
    references: {
      model: User,
      key: 'id',
    },
  },
  customerInfo: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
  },
  paymentMethod: {
    type: DataTypes.ENUM('online', 'cash'),
    allowNull: false,
    defaultValue: 'cash',
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending',
  },
  paymentId: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders',
  timestamps: true,
});

// Define associations
Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

export default Order;
