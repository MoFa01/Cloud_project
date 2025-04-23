const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('../config/config').patientService;
const app = express();
const PORT = process.env.PORT || config.port;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL || config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(`Connected to Patient Management Database (${process.env.NODE_ENV || 'development'})`))
.catch(err => console.error('Database connection error:', err));

// Middleware
app.use(cors(config.corsOptions));
app.use(express.json());

// Add environment info to response headers
app.use((req, res, next) => {
  res.setHeader('X-Environment', process.env.NODE_ENV || 'development');
  next();
});

// Simplified Patient Schema
const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  contactNumber: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});

const Patient = mongoose.model('Patient', patientSchema);

// Routes
app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/patients', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    const newPatient = await patient.save();
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'Patient service is healthy',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Environment info endpoint
app.get('/environment', (req, res) => {
  res.status(200).json({
    environment: process.env.NODE_ENV || 'development',
    service: 'Patient Management Service',
    version: '1.0.0'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Patient Management Service running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});
