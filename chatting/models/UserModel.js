import sequelize from '../config/database.js'
import { DataTypes } from 'sequelize'

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'full name is required' },
        notEmpty: { msg: 'full name is must not be empty' },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: { msg: 'Email is required' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
  }
)

export default User
