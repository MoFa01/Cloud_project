// ===========================================================================
// 1. CONFIGURATION FILES
// ===========================================================================

// File: config/config.js
const environments = {
    development: {
      patientService: {
        port: 3001,
        mongoUri: "mongodb+srv://fahd:fahd@cluster0.rc599zk.mongodb.net/healthcare-patients-dev",
        corsOptions: {
          origin: '*',
          optionsSuccessStatus: 200
        }
      },
      healthRecordsService: {
        port: 3002,
        mongoUri: "mongodb+srv://fahd:fahd@cluster0.rc599zk.mongodb.net/healthcare-patients-dev",
        patientServiceUrl: 'http://localhost:3001',
        corsOptions: {
          origin: '*',
          optionsSuccessStatus: 200
        }
      }
    },
    staging: {
      patientService: {
        port: 3001,
        mongoUri: "mongodb+srv://fahd:fahd@cluster0.rc599zk.mongodb.net/healthcare-patients-staging",
        corsOptions: {
          origin: ['https://staging.healthcare-app.com'],
          optionsSuccessStatus: 200
        }
      },
      healthRecordsService: {
        port: 3002,
        mongoUri: "mongodb+srv://fahd:fahd@cluster0.rc599zk.mongodb.net/healthcare-patients-staging",
        patientServiceUrl: 'http://patient-service:3001',
        corsOptions: {
          origin: ['https://staging.healthcare-app.com'],
          optionsSuccessStatus: 200
        }
      }
    },
    production: {
      patientService: {
        port: 3001,
        mongoUri: "mongodb+srv://fahd:fahd@cluster0.rc599zk.mongodb.net/healthcare-patients-prod",
        corsOptions: {
          origin: ['https://healthcare-app.com'],
          optionsSuccessStatus: 200
        }
      },
      healthRecordsService: {
        port: 3002,
        mongoUri: "mongodb+srv://fahd:fahd@cluster0.rc599zk.mongodb.net/healthcare-patients-prod",
        patientServiceUrl: 'http://patient-service:3001',
        corsOptions: {
          origin: ['https://healthcare-app.com'],
          optionsSuccessStatus: 200
        }
      }
    }
  };
  
  // Determine which environment to use
  const currentEnv = process.env.NODE_ENV || 'development';
  
  // Export the configuration for the current environment
  module.exports = environments[currentEnv];
  