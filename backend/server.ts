
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"]
  }
});

const MONGO_URI = 'mongodb+srv://harsh9599566:i2jhnyqd@H@cluster0.se1hb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(MONGO_URI);
let db: any;

app.use(cors());
app.use(express.json());

// MongoDB Connection
async function connectDB() {
  try {
    await client.connect();
    db = client.db('chatapp');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Message Routes
app.post('/api/messages', async (req, res) => {
  try {
    const message = {
      ...req.body,
      timestamp: new Date(),
      _id: new ObjectId()
    };
    await db.collection('messages').insertOne(message);
    io.emit('new_message', message);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error saving message' });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;
    const messages = await db.collection('messages')
      .find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      })
      .sort({ timestamp: 1 })
      .toArray();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  socket.on('send_message', async (messageData) => {
    try {
      const message = {
        ...messageData,
        timestamp: new Date(),
        _id: new ObjectId()
      };
      await db.collection('messages').insertOne(message);
      io.to(messageData.chatId).emit('receive_message', message);
    } catch (error) {
      console.error('Error handling socket message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
