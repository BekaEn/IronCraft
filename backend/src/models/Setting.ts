import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface SettingAttributes {
  id?: number;
  promoEnabled: boolean;
  promoText: string;
  promoYoutubeUrl?: string | null;
  promoYoutubeTitle?: string | null;
  promoYoutubeThumbnail?: string | null;
}

class Setting extends Model<SettingAttributes> implements SettingAttributes {
  declare id: number;
  declare promoEnabled: boolean;
  declare promoText: string;
  declare promoYoutubeUrl: string | null;
  declare promoYoutubeTitle: string | null;
  declare promoYoutubeThumbnail: string | null;
}

Setting.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  promoEnabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  promoText: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: '',
  },
  promoYoutubeUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
  promoYoutubeTitle: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
  promoYoutubeThumbnail: {
    type: DataTypes.STRING(512),
    allowNull: true,
    defaultValue: null,
  },
}, {
  sequelize,
  modelName: 'Setting',
  tableName: 'settings',
  timestamps: true,
});

export default Setting;

