// Team service entry point
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 4004;

const mongoUri = process.env.DATABASE_URL || 'mongodb://mongo:27017/teamdb';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB teamdb'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Team service is running!');
});

app.listen(port, () => {
  console.log(`Team service listening on port ${port}`);
});
