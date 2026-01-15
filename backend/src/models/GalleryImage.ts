import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface GalleryImageAttributes {
  id?: number;
  title?: string;
  description?: string;
  imagePath: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface GalleryImageCreationAttributes extends Optional<GalleryImageAttributes, 'id' | 'title' | 'description' | 'sortOrder' | 'isActive'> {}

class GalleryImage extends Model<GalleryImageAttributes, GalleryImageCreationAttributes> implements GalleryImageAttributes {
  public id!: number;
  public title?: string;
  public description?: string;
  public imagePath!: string;
  public sortOrder!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

GalleryImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imagePath: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'gallery_images',
    timestamps: true,
  }
);

export default GalleryImage;
