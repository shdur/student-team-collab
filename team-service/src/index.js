const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 4004;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://frontend:3000']
}));
app.use(express.json());

// MongoDB URI
const mongoUri = process.env.DATABASE_URL || 'mongodb://mongo:27017/teamdb';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB teamdb'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schema & Model
const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  members: [String],
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Inactive'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Team = mongoose.model('Team', teamSchema);

// Health check
app.get('/', (req, res) => {
  res.send('🚀 Team service is running!');
});

// GET all teams (optionally filtered by status)
app.get('/teams', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status === 'Active' || status === 'Inactive') {
      query.status = status;
    }

    const teams = await Team.find(query).sort({ status: -1, createdAt: -1 });
    res.json(teams);
  } catch (err) {
    console.error('❌ Error fetching teams:', err);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// POST new team
app.post('/teams', async (req, res) => {
  try {
    const { name, members, status } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const newTeam = new Team({ name, members, status });
    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (err) {
    console.error('❌ Error creating team:', err);
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// PUT update team
app.put('/teams/:id', async (req, res) => {
  try {
    const { name, members, status } = req.body;

    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      { name, members, status },
      { new: true, runValidators: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json(updatedTeam);
  } catch (err) {
    console.error('❌ Error updating team:', err);
    res.status(500).json({ error: 'Failed to update team' });
  }
});

// DELETE team
app.delete('/teams/:id', async (req, res) => {
  try {
    const deleted = await Team.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({ message: 'Team deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting team:', err);
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Team service listening on port ${port}`);
});
