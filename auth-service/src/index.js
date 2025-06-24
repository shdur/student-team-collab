// Auth service entry point
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('./models/User'); // Sigurohu që models/User.js ekziston

const app = express();
const port = 4001;

const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/authdb';

// 🔗 Lidhje me MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// 🔧 Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json());

// 🔍 Test route
app.get('/', (req, res) => {
  res.send('Auth service is running!');
});

// 👤 Register route
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Emaili është përdorur.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Përdoruesi u regjistrua me sukses.' });
  } catch (error) {
    console.error('❌ Gabim gjatë regjistrimit:', error);
    res.status(500).json({ message: 'Gabim gjatë regjistrimit.' });
  }
});

// 👤 Login route
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ose fjalëkalim i pasaktë.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ose fjalëkalim i pasaktë.' });
    }

    res.status(200).json({
      message: 'Login i suksesshëm.',
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('❌ Gabim gjatë login:', error);
    res.status(500).json({ message: 'Gabim në server.' });
  }
});

// ▶️ Starto serverin
app.listen(port, () => {
  console.log(`🚀 Auth service listening on port ${port}`);
});
