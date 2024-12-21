// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Kudos'; // Fallback to localhost if not defined

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Define Schema for Kudos
const kudosSchema = new mongoose.Schema({
  employee: String,
  message: String,
  date: { type: Date, default: Date.now },
  rating: { type: Number, default: 0 }, // Adding rating to the schema
});

// Create the model for the Kudos schema
const Kudos = mongoose.model('Kudos', kudosSchema);

// API to get all kudos data
app.get('/api/kudos', async (req, res) => {
  try {
    const kudosData = await Kudos.find(); // Fetch all kudos
    res.json(kudosData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


// API to get the leaderboard (top ratings)
app.get('/api/kudos/leaderboard', async (req, res) => {
    try {
      // Fetch the top Kudos sorted by rating in descending order
      const leaderboard = await Kudos.find().sort({ rating: -1 });  // Sort by rating (descending)
      res.json(leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).send('Server Error');
    }
  });
  

// API to post a new kudo
app.post('/api/kudos', async (req, res) => {
    try {
      const { employee, message, date, rating } = req.body;
  
      // Log incoming request data to check
      console.log('Received Kudos Data:', req.body);
  
      // Ensure the employee name and message are provided
      if (!employee || !message) {
        return res.status(400).send('Employee name and message are required');
      }
  
      // Create a new Kudo
      const newKudo = new Kudos({
        employee,
        message,
        date,
        rating,
      });
  
      // Save the new kudo to the database
      await newKudo.save();
      console.log('Kudo saved successfully:', newKudo);
  
      res.status(201).json({ message: 'Kudo added successfully' });
    } catch (error) {
      console.error('Error saving Kudos:', error);
      res.status(500).send('Server Error');
    }
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
