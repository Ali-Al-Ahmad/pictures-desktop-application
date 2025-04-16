import User from './UserModel.js'
import Chat from './ChatModel.js'

User.hasMany(Chat, {
  foreignKey: 'user_id',
  as: 'chats',
})

Chat.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
})

export { User, Chat }
