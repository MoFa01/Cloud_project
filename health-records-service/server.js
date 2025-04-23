// ===========================================================================
// HEALTH RECORDS & APPOINTMENTS SERVICE
// ===========================================================================

// File: health-records-service/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3002;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL || "mongodb+srv://fahd:fahd@cluster0.rc599zk.mongodb.net/healthcare-patients-dev" , {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(`Connected to Health Records Database (${process.env.NODE_ENV || 'development'})`))
.catch(err => console.error('Database connection error:', err));

// Middleware
app.use(cors()); // Allow requests from any origin
app.use(express.json());

// Add environment info to response headers
app.use((req, res, next) => {
  res.setHeader('X-Environment', process.env.NODE_ENV || 'development');
  next();
});

// Add Patient Schema in this service for independent patient validation
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

// Simplified Medical Record Schema
const medicalRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, required: true },
  doctorName: { type: String, required: true },
  diagnosis: String,
  treatment: String,
  createdAt: { type: Date, default: Date.now }
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

// Simplified Appointment Schema
const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, required: true },
  doctorName: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Completed', 'Cancelled', 'No-Show'],
    default: 'Scheduled'
  },
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Utility function to verify patient exists locally
async function verifyPatient(patientId) {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new Error('Patient not found');
  }
  return patient;
}

// Patient routes - minimal implementation for local use
app.get('/local-patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/local-patients', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    const newPatient = await patient.save();
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/local-patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Data synchronization endpoint - could be called by a scheduled job
app.post('/sync-patients', async (req, res) => {
  try {
    // This would typically involve a more complex sync mechanism
    // For this example, we're just adding new patients sent in the request
    const patients = req.body;
    const results = await Patient.insertMany(patients, { ordered: false });
    res.status(200).json({ 
      message: 'Patient synchronization completed',
      added: results.length
    });
  } catch (err) {
    // Handle duplicate key errors specially
    if (err.code === 11000) {
      res.status(200).json({ 
        message: 'Patient synchronization completed with duplicates',
        error: err.message
      });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
});

// Medical Records Routes
app.get('/medical-records', async (req, res) => {
  try {
    const records = await MedicalRecord.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/medical-records/:id', async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Medical record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/medical-records/patient/:patientId', async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.params.patientId });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/medical-records', async (req, res) => {
  try {
    // Verify patient exists locally instead of making a service call
    await verifyPatient(req.body.patientId);
    
    const record = new MedicalRecord(req.body);
    const newRecord = await record.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/medical-records/:id', async (req, res) => {
  try {
    if (req.body.patientId) {
      // Verify patient exists locally if patientId is being updated
      await verifyPatient(req.body.patientId);
    }
    
    const record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ message: 'Medical record not found' });
    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/medical-records/:id', async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Medical record not found' });
    res.json({ message: 'Medical record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Appointment Routes
app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/appointments/patient/:patientId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/appointments', async (req, res) => {
  try {
    // Verify patient exists locally
    await verifyPatient(req.body.patientId);
    
    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      doctorName: req.body.doctorName,
      appointmentDate: req.body.appointmentDate,
      status: 'Scheduled'
    });
    
    if (conflictingAppointment) {
      return res.status(409).json({ message: 'This time slot is already booked' });
    }
    
    const appointment = new Appointment(req.body);
    const newAppointment = await appointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/appointments/:id', async (req, res) => {
  try {
    if (req.body.patientId) {
      // Verify patient exists locally if patientId is being updated
      await verifyPatient(req.body.patientId);
    }
    
    // If appointment date is being updated, check for conflicts
    if (req.body.appointmentDate && req.body.doctorName) {
      const conflictingAppointment = await Appointment.findOne({
        _id: { $ne: req.params.id },
        doctorName: req.body.doctorName,
        appointmentDate: req.body.appointmentDate,
        status: 'Scheduled'
      });
      
      if (conflictingAppointment) {
        return res.status(409).json({ message: 'This time slot is already booked' });
      }
    }
    
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Combined patient and medical record endpoint
app.get('/patient-records/:patientId', async (req, res) => {
  try {
    const patientId = req.params.patientId;
    
    // Get patient details
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Get patient's medical records
    const records = await MedicalRecord.find({ patientId });
    
    // Get patient's appointments
    const appointments = await Appointment.find({ patientId });
    
    // Return combined data
    res.json({
      patient,
      medicalRecords: records,
      appointments: appointments
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'Health Records & Appointments service is healthy',
    environment: process.env.NODE_ENV || 'development',
    dependencies: 'self-contained - no external dependencies',
    timestamp: new Date().toISOString()
  });
});

// Environment info endpoint
app.get('/environment', (req, res) => {
  res.status(200).json({
    environment: process.env.NODE_ENV || 'development',
    service: 'Health Records & Appointments Service - Independent Version',
    version: '1.0.0',
    dependencies: 'self-contained'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Health Records & Appointments Service (Independent) running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});