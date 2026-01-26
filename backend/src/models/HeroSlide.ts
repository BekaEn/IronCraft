import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface HeroSlideAttributes {
  id?: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  primaryButtonText?: string | null;
  primaryButtonUrl?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonUrl?: string | null;
  youtubeUrl?: string | null;
  imageUrl?: string | null;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type HeroSlideCreationAttributes = Optional<HeroSlideAttributes, 'id' | 'subtitle' | 'description' | 'primaryButtonText' | 'primaryButtonUrl' | 'secondaryButtonText' | 'secondaryButtonUrl' | 'youtubeUrl' | 'imageUrl' | 'order' | 'isActive'>;

class HeroSlide extends Model<HeroSlideAttributes, HeroSlideCreationAttributes> implements HeroSlideAttributes {
  public id!: number;
  public title!: string;
  public subtitle!: string | null;
  public description!: string | null;
  public primaryButtonText!: string | null;
  public primaryButtonUrl!: string | null;
  public secondaryButtonText!: string | null;
  public secondaryButtonUrl!: string | null;
  public youtubeUrl!: string | null;
  public imageUrl!: string | null;
  public order!: number;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

HeroSlide.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  subtitle: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  primaryButtonText: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: null,
  },
  primaryButtonUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
  secondaryButtonText: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: null,
  },
  secondaryButtonUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
  youtubeUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  imageUrl: {
    type: DataTypes.STRING(512),
    allowNull: true,
    defaultValue: null,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  sequelize,
  modelName: 'HeroSlide',
  tableName: 'hero_slides',
  timestamps: true,
});

export default HeroSlide;


