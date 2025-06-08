const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 4002;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://frontend:3000']
}));
app.use(express.json());

// MongoDB URI
const mongoUri = process.env.DATABASE_URL || 'mongodb://mongo:27017/projectdb';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB projectdb'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Project Schema
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Inactive',
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model('Project', projectSchema);

// Health check
app.get('/', (req, res) => {
  res.send('🚀 Project service is running!');
});

// GET all projects
app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('❌ Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST new project
app.post('/projects', async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const newProject = new Project({
      name,
      description,
      status: status === 'Inactive' ? 'Inactive' : 'Active' // fallback to Active
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error('❌ Error creating project:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT update project
app.put('/projects/:id', async (req, res) => {
  try {
    const { name, description, status } = req.body;

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Error updating project:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE project
app.delete('/projects/:id', async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting project:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Project service listening on port ${port}`);
});
