import express, { Request, response, Response } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoURI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/conversations_db';

// Connect to MongoDB
mongoose
  .connect(mongoURI, {})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define a schema and model for conversations
const messageSchema = new mongoose.Schema({
  message: String,
  response: {
    type: String,
    require: false,
  },
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  model: { type: Number, required: true }, // Model attribute
  messages: [messageSchema],
});

const Conversation = mongoose.model('Conversation', conversationSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Route to get all conversations
app.get('/api/conversations', async (req: Request, res: Response) => {
  try {
    const conversations = await Conversation.find();
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Route to get a single conversation by ID
app.get('/api/conversations/:id', async (req: Request, res: Response) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation)
      return res.status(404).json({ error: 'Conversation not found' });
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Route to create a new conversation
app.post('/api/conversations', async (req: Request, res: Response) => {
  try {
    const { initialMessage, model } = req.body;

    if (typeof model !== 'number') {
      return res.status(400).json({ error: 'Model must be a number' });
    }

    const newConversation = new Conversation({
      model,
      messages: initialMessage
        ? [{ ...initialMessage, timestamp: new Date() }]
        : [],
    });

    await newConversation.save();
    res.status(201).json(newConversation);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Route to add a new message to a conversation
app.post(
  '/api/conversations/:id/messages',
  async (req: Request, res: Response) => {
    try {
      const conversation = await Conversation.findById(req.params.id);
      if (!conversation)
        return res.status(404).json({ error: 'Conversation not found' });

      const { message } = req.body;

      const newMessage = {
        message,
        timestamp: new Date(),
      };

      conversation.messages.push(newMessage);
      await conversation.save();
      res.status(201).json(conversation);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
