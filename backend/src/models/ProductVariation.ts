import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import Product from './Product';

export interface ProductVariationAttributes {
  id?: number;
  productId: number;
  color: string;
  size: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  isActive: boolean;
}

class ProductVariation extends Model<ProductVariationAttributes> implements ProductVariationAttributes {
  declare id: number;
  declare productId: number;
  declare color: string;
  declare size: string;
  declare price: number;
  declare salePrice?: number | null;
  declare images: string[];
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ProductVariation.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id',
    references: {
      model: 'products',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  color: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  size: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  salePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: null,
    field: 'sale_price',
  },
  images: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
}, {
  sequelize,
  modelName: 'ProductVariation',
  tableName: 'product_variations',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['product_id', 'color', 'size'],
      name: 'unique_variation',
    },
  ],
});

// Define associations
Product.hasMany(ProductVariation, {
  foreignKey: 'productId',
  as: 'variations',
});

ProductVariation.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

export default ProductVariation;
