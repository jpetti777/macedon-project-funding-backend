console.log('Script is starting...');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

console.log('Middleware setup...');
app.use(cors({
  origin: 'https://macedon-project-funding-wq2g-451gv2311-jps-projects-0831da4b.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const surveySchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  selectedProjects: [Number],
  comments: Object,
  submittedAt: { type: Date, default: Date.now }
});

const Survey = mongoose.model('Survey', surveySchema);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/submit-survey', async (req, res) => {
  console.log('Received survey submission:', req.body);
  try {
    const newSurvey = new Survey(req.body);
    await newSurvey.save();
    console.log('Survey saved successfully:', newSurvey);
    res.status(201).json({ message: 'Survey submitted successfully', survey: newSurvey });
  } catch (error) {
    console.error('Error submitting survey:', error);
    res.status(400).json({ message: 'Error submitting survey', error: error.message, stack: error.stack });
  }
});

const PORT = process.env.PORT || 3001;  // Changed to 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});