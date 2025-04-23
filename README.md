# Project: Patient and Health Records Management System

## Prerequisites
- Docker and Docker Compose installed on your machine
- Git (for cloning the repository)
- Node.js (for local development)

## Environment Setup
1. Create a `.env` file in the root directory with the following variables:
```env
MONGODB_CLOUD_URL_DEV=your_dev_mongodb_url
MONGODB_CLOUD_URL_STAGING=your_staging_mongodb_url
MONGODB_CLOUD_URL_PROD=your_production_mongodb_url
PROD_JWT_SECRET=your_production_jwt_secret
```

## Running with Docker Compose

### Development Environment
```bash
docker compose up patient-service-dev health-records-service-dev
```
- Patient Service will be available at: http://localhost:3001
- Health Records Service will be available at: http://localhost:3002

### Staging Environment
```bash
docker compose up patient-service-staging health-records-service-staging
```
- Patient Service will be available at: http://localhost:4001
- Health Records Service will be available at: http://localhost:3003

### Production Environment
```bash
docker compose up patient-service-prod health-records-service-prod
```
- Patient Service will be available at: http://localhost:4002
- Health Records Service will be available at: http://localhost:3004

### Running All Environments
To run all environments simultaneously:
```bash
docker compose up
```

### Stopping the Services
```bash
docker compose down
```

### Rebuilding the Services
If you make changes to the code:
```bash
docker compose build
docker compose up
```

## Service Details

### Patient Service
- Development: Port 3001
- Staging: Port 4001
- Production: Port 4002

### Health Records Service
- Development: Port 3002
- Staging: Port 3003
- Production: Port 3004

## Local Development (Without Docker)

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/MoFa01/Cloud_project.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Cloud_project
   ```

3. Install dependencies for both services:
   ```bash
   cd patient-service
   npm install
   cd ../health-records-service
   npm install
   ```

### Running the Application Locally
1. Start the `patient-service`:
   ```bash
   cd patient-service
   npm run start:dev
   ```

2. Start the `health-records-service` in another terminal:
   ```bash
   cd health-records-service
   npm run start:dev
   ```

## API Documentation
Access the API documentation using the following link:
[Postman Documentation](https://documenter.getpostman.com/view/24694319/2sB2ixjZbe)
