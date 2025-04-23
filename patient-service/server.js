const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('../config/config').patientService;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

//--
// Admin Schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Worker Schema
const workerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salary: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);
const Worker = mongoose.model('Worker', workerSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication Middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Initialize default admin if not exists
const initializeDefaultAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: 'fahd@gmail.com' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('fahd', 10);
      const admin = new Admin({
        email: 'fahd@gmail.com',
        password: hashedPassword
      });
      await admin.save();
      console.log('Default admin created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

initializeDefaultAdmin();


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

//-----------------------

// Authentication Routes
app.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Worker Routes
app.get('/workers', async (req, res) => {
  try {
    const workers = await Worker.find().select('-password');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/workers/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).select('-password');
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/workers', async (req, res) => {
  try {
    const { email, password, salary } = req.body;
    
    const workerExists = await Worker.findOne({ email });
    if (workerExists) {
      return res.status(400).json({ message: 'Worker with this email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const worker = new Worker({
      email,
      password: hashedPassword,
      salary
    });
    
    const newWorker = await worker.save();
    
    // Don't return the password in the response
    const workerResponse = newWorker.toObject();
    delete workerResponse.password;
    
    res.status(201).json(workerResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/workers/:id', async (req, res) => {
  try {
    const { email, password, salary } = req.body;
    const updates = { email, salary };
    
    // Only hash and update password if it's provided
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }
    
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select('-password');
    
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    
    res.json(worker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/workers/:id', async (req, res) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    
    res.json({ message: 'Worker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//
// Worker Login Route
app.post('/worker/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const worker = await Worker.findOne({ email });
    if (!worker) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordMatch = await bcrypt.compare(password, worker.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { 
        id: worker._id,
        role: 'worker'  // Add role to distinguish from admin tokens
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token,
      worker: {
        id: worker._id,
        email: worker.email,
        salary: worker.salary
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Worker Authentication Middleware
// Add this middleware after the admin authentication middleware
const authenticateWorker = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Ensure the token belongs to a worker
    if (decoded.role !== 'worker') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const worker = await Worker.findById(decoded.id);
    
    if (!worker) {
      return res.status(401).json({ message: 'Worker not found' });
    }
    
    req.worker = worker;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`Patient Management Service running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});
