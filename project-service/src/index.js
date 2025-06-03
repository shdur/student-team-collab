const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 4002;

app.use(express.json()); // Ky është shumë i rëndësishëm për të lexuar body në POST

const mongoUri = process.env.DATABASE_URL || 'mongodb://mongo:27017/projectdb';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB projectdb'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic health check
app.get('/', (req, res) => {
  res.send('Project service is running!');
});

// Test POST endpoint to insert a project document
app.post('/test-project', async (req, res) => {
  try {
    // Për test, po krijojmë një schema minimale direkt këtu
    const projectSchema = new mongoose.Schema({
      name: String,
      description: String,
    });

    const Project = mongoose.model('Project', projectSchema);

    // Në test po futim të dhëna fikse, ose mund të marrim nga req.body
    const newProject = new Project({
      name: req.body.name || 'Test Project',
      description: req.body.description || 'Test description',
    });

    await newProject.save();

    res.status(201).json({ message: 'Project saved', project: newProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Project service listening on port ${port}`);
});
