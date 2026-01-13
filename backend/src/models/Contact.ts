import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface ContactAttributes {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded' | 'closed';
  createdAt?: Date;
  updatedAt?: Date;
}

class Contact extends Model<ContactAttributes> implements ContactAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare phone?: string;
  declare subject: string;
  declare message: string;
  declare status: 'new' | 'read' | 'responded' | 'closed';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Contact.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 20],
    },
  },
  subject: {
    type: DataTypes.ENUM('sales', 'support', 'installation', 'warranty', 'other'),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [5, 2000],
    },
  },
  status: {
    type: DataTypes.ENUM('new', 'read', 'responded', 'closed'),
    defaultValue: 'new',
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Contact',
  tableName: 'contacts',
  timestamps: true,
  indexes: [
    {
      fields: ['status'],
    },
    {
      fields: ['subject'],
    },
    {
      fields: ['createdAt'],
    },
    {
      fields: ['email'],
    },
  ],
});

export default Contact;
