const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 4003;

// Middleware
app.use(cors({ origin: ['http://localhost:3001', 'http://frontend:3000'] }));
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.DATABASE_URL || 'mongodb://mongo:27017/taskdb';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB taskdb'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schema & Model
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  assignedTo: String,
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// Health Check
app.get('/', (req, res) => {
  res.send('🚀 Task service is running!');
});

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('❌ Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a new task
app.post('/tasks', async (req, res) => {
  try {
    const { title, description, status, assignedTo, priority, dueDate } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required' });

    const newTask = new Task({
      title,
      description,
      status,
      assignedTo,
      priority,
      dueDate
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error('❌ Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
  try {
    const { title, description, status, assignedTo, priority, dueDate } = req.body;

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, assignedTo, priority, dueDate },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Task not found' });

    res.json(updated);
  } catch (err) {
    console.error('❌ Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ error: 'Task not found' });

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Task service listening on port ${port}`);
});
