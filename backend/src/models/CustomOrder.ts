import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CustomOrderAttributes {
  id?: number;
  customerName: string;
  email: string;
  phone: string;
  designImage: string;
  width: string;
  height: string;
  quantity: number;
  additionalDetails?: string;
  status: 'pending' | 'in_review' | 'approved' | 'in_production' | 'completed' | 'cancelled';
  estimatedPrice?: number;
  adminNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CustomOrderCreationAttributes extends Optional<CustomOrderAttributes, 'id' | 'status' | 'additionalDetails' | 'estimatedPrice' | 'adminNotes'> {}

class CustomOrder extends Model<CustomOrderAttributes, CustomOrderCreationAttributes> implements CustomOrderAttributes {
  public id!: number;
  public customerName!: string;
  public email!: string;
  public phone!: string;
  public designImage!: string;
  public width!: string;
  public height!: string;
  public quantity!: number;
  public additionalDetails?: string;
  public status!: 'pending' | 'in_review' | 'approved' | 'in_production' | 'completed' | 'cancelled';
  public estimatedPrice?: number;
  public adminNotes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CustomOrder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customerName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    designImage: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    width: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    height: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    additionalDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_review', 'approved', 'in_production', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    estimatedPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'custom_orders',
    timestamps: true,
  }
);

export default CustomOrder;
