import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import sequelize from './config/database.js'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { Chat, User } from './models/index.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

app.get('/messages', async (req, res) => {
  const messages = await Chat.findAll({
    include: [{ model: User, as: 'user' }],
  })
  res.json(messages)
})

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id)

  socket.on('send-message', async (data) => {
    const saved = await Chat.create({
      user_id: data.user_id,
      message: data.message,
    })
    io.emit('new-message', saved)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

server.listen(PORT, () => {
  console.log('Server listening on http://localhost:3000')
})
