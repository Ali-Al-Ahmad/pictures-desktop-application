import { useEffect, useState } from 'react'
import './Chats.css'
import { io } from 'socket.io-client'
import { useSelector } from 'react-redux'
import axios from 'axios'

const socket = io('http://localhost:3000')
const Chats = () => {
  const user = useSelector((state) => state.user)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const userId = localStorage.getItem('user_id')

  console.log('localstorageID:', userId)
  console.log('user: ', user, messages)

  useEffect(() => {
    axios.get('http://localhost:3000/messages').then((res) => {
      setMessages(res.data)
    })

    socket.on('new-message', (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.off('new-message')
    }
  }, [])

  const sendMessage = () => {
    if (message.trim() === '') return
    socket.emit('send-message', {
      user_id: userId,
      message: message,
      user: { email: user.email }
    })
    setMessage('')
  }

  const formatDate = (iso) => new Date(iso).toLocaleString()

  return (
    <div className="chat-container">
      <h2>Chats</h2>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message-bubble ${msg?.user_id == userId ? 'mine' : 'theirs'}`}>
            <div className="msg-header">
              <div className="msg-user-info">
                <strong>{message?.user?.full_name}</strong> <span>({msg?.user?.email})</span>
              </div>
              <span className="msg-timestamp">{formatDate(msg.created_at)}</span>
            </div>
            <div className="msg-content">{msg?.message}</div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default Chats
