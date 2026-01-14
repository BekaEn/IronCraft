import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface ProductAttributes {
  id?: number;
  name: string;
  slug: string;
  description: string;
  detailedDescription?: string[];
  price: number;
  images: string[];
  features: string[];
  specifications: {
    dimensions?: string;
    material: string;
    weight?: string;
    thickness?: string;
    finish?: string;
    mounting?: string;
    care?: string;
    unlockMethods?: string[];
    batteryLife?: string;
    installation?: string;
    compatibility?: string[];
  };
  category: 'anime' | 'abstract' | 'nature' | 'custom' | 'geometric' | 'portrait' | 'other';
  isActive: boolean;
  isOnSale?: boolean;
  salePrice?: number | null;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  declare id: number;
  declare name: string;
  declare slug: string;
  declare description: string;
  declare detailedDescription?: string[];
  declare price: number;
  declare images: string[];
  declare features: string[];
  declare specifications: {
    dimensions?: string;
    material: string;
    weight?: string;
    thickness?: string;
    finish?: string;
    mounting?: string;
    care?: string;
    unlockMethods?: string[];
    batteryLife?: string;
    installation?: string;
    compatibility?: string[];
  };
  declare category: 'anime' | 'abstract' | 'nature' | 'custom' | 'geometric' | 'portrait' | 'other';
  declare isActive: boolean;
  declare isOnSale?: boolean;
  declare salePrice?: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  detailedDescription: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  images: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  features: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  specifications: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  category: {
    type: DataTypes.ENUM('anime', 'abstract', 'nature', 'custom', 'geometric', 'portrait', 'other'),
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isOnSale: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  salePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: null,
  },
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  timestamps: true,
});

export default Product;
