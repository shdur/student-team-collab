// Task service entry point
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 4003;

const mongoUri = process.env.DATABASE_URL || 'mongodb://mongo:27017/taskdb';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB taskdb'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Task service is running!');
});

app.listen(port, () => {
  console.log(`Task service listening on port ${port}`);
});
