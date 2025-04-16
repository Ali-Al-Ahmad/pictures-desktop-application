import sequelize from '../config/database.js'
import { DataTypes } from 'sequelize'
import User from './UserModel.js'

const Chat = sequelize.define(
  'Chat',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    tableName: 'chats',
  }
)

export default Chat
