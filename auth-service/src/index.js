// Auth service entry point
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 4001;

const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/authdb';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Auth service is running!');
});

app.listen(port, () => {
  console.log(`Auth service listening on port ${port}`);
});
