# Project: Patient and Health Records Management System

## Prerequisites
- Docker and Docker Compose installed on your machine
- Git (for cloning the repository)
- Node.js (for local development)

## Tech Stack
- Frontend: Next.js with TypeScript
- Backend Services: Node.js/Express
- Database: MongoDB
- Containerization: Docker

## Environment Setup
1. Create a `.env` file in the root directory with the following variables:
```env
MONGODB_CLOUD_URL_DEV=your_dev_mongodb_url
MONGODB_CLOUD_URL_STAGING=your_staging_mongodb_url
MONGODB_CLOUD_URL_PROD=your_production_mongodb_url
PROD_JWT_SECRET=your_production_jwt_secret
```

## Project Structure
```
.
├── docker-compose.yml          # Docker Compose configuration for all environments
├── README.md                   # Project documentation
├── health-records-service/     # Health Records microservice
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── patient-service/           # Patient management microservice
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
└── HealthCareApp-main/       # Frontend Next.js application
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── app/              # Next.js 13+ app directory
        │   ├── _components/  # Shared components
        │   └── (pages)/     # Route groups
        ├── components/       # Reusable UI components
        └── lib/             # Utility functions and shared logic

## Network Architecture
The application uses three separate Docker networks for isolation between environments:
- `healthcare-dev`: Development environment network
- `healthcare-staging`: Staging environment network
- `healthcare-prod`: Production environment network

Each environment consists of:
1. Frontend Service (Next.js)
2. Patient Service (Node.js/Express)
3. Health Records Service (Node.js/Express)

The services communicate with each other through their respective Docker networks, while being exposed to the host machine through mapped ports.

## Running with Docker Compose

### Development Environment
```bash
docker compose up patient-service-dev health-records-service-dev frontend-dev
```
- Frontend Application will be available at: http://localhost:3000
- Patient Service will be available at: http://localhost:3001
- Health Records Service will be available at: http://localhost:3002

### Staging Environment
```bash
docker compose up patient-service-staging health-records-service-staging frontend-staging
```
- Frontend Application will be available at: http://localhost:4000
- Patient Service will be available at: http://localhost:4001
- Health Records Service will be available at: http://localhost:3003

### Production Environment
```bash
docker compose up patient-service-prod health-records-service-prod frontend-prod
```
- Frontend Application will be available at: http://localhost:5000
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

### Frontend Application
- Development: Port 3000
- Staging: Port 4000
- Production: Port 5000

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

3. Install dependencies for all services:
   ```bash
   cd patient-service
   npm install
   cd ../health-records-service
   npm install
   cd ../HealthCareApp-main
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

3. Start the frontend application in another terminal:
   ```bash
   cd HealthCareApp-main
   npm run dev
   ```

The frontend application will be available at http://localhost:3000
   ```

## API Documentation
Access the API documentation using the following link:
[Postman Documentation](https://documenter.getpostman.com/view/24694319/2sB2ixjZbe)
