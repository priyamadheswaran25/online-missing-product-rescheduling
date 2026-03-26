import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/User.js';
import Complaint from './models/Complaint.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- Auth Routes ---
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already registered' });
    }

    // Determine Role
    const userRole = email === 'admin@reschedulex.com' ? 'admin' : (role || 'user');

    // Create New User 
    // (Note: In a production app, password should be hashed with bcrypt)
    const newUser = new User({ name, email, phone, password, role: userRole });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful!', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// --- Complaint Routes ---
app.get('/api/complaints', async (req, res) => {
  try {
    // If we wanted to filter by user on backend, we'd pass userId query param
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

app.post('/api/complaints', async (req, res) => {
  try {
    const newComplaint = new Complaint(req.body);
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create complaint' });
  }
});

app.put('/api/complaints/:id', async (req, res) => {
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!updatedComplaint) return res.status(404).json({ error: 'Complaint not found' });
    
    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update complaint' });
  }
});

app.delete('/api/complaints/:id', async (req, res) => {
  try {
    const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!deletedComplaint) return res.status(404).json({ error: 'Complaint not found' });
    
    res.status(200).json({ message: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete complaint' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
