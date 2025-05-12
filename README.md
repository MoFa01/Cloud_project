# Patient and Health Records Management System 🏥

A comprehensive healthcare management system built with modern technologies, featuring microservices architecture and multi-environment support.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Environment Setup](#-environment-setup)
- [Project Structure](#-project-structure)
- [Docker Deployment](#-docker-deployment)
- [Local Development](#-local-development)
- [API Documentation](#-api-documentation)

## ✨ Features
- Patient Management System
- Health Records Management
- Multi-environment Support (Development, Staging, Production)
- Containerized Microservices
- Modern Frontend with Next.js

## 🛠 Tech Stack
- **Frontend:** Next.js with TypeScript
- **Backend Services:** Node.js/Express
- **Database:** MongoDB
- **Containerization:** Docker

## 📝 Prerequisites
- Docker and Docker Compose
- Git (for cloning the repository)
- Node.js (for local development)

## ⚙️ Environment Setup
Create a `.env` file in the root directory with the following variables:
```env
MONGODB_CLOUD_URL_DEV=your_dev_mongodb_url
MONGODB_CLOUD_URL_STAGING=your_staging_mongodb_url
MONGODB_CLOUD_URL_PROD=your_production_mongodb_url
PROD_JWT_SECRET=your_production_jwt_secret
```

## 📁 Project Structure
```
.
├── docker-compose.yml          # Docker Compose configuration
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
        └── lib/             # Utils and shared logic
```

## 🌐 Network Architecture
The application uses three isolated Docker networks:
- `healthcare-dev` (Development)
- `healthcare-staging` (Staging)
- `healthcare-prod` (Production)

Each environment includes:
- Frontend Service (Next.js)
- Patient Service (Node.js/Express)
- Health Records Service (Node.js/Express)

## 🐳 Docker Deployment

### Development Environment
```bash
docker compose up patient-service-dev health-records-service-dev frontend-dev
```
- Frontend: http://localhost:3000
- Patient Service: http://localhost:3001
- Health Records: http://localhost:3002

### Staging Environment
```bash
docker compose up patient-service-staging health-records-service-staging frontend-staging
```
- Frontend: http://localhost:4000
- Patient Service: http://localhost:4001
- Health Records: http://localhost:3003

### Production Environment
```bash
docker compose up patient-service-prod health-records-service-prod frontend-prod
```
- Frontend: http://localhost:5000
- Patient Service: http://localhost:4002
- Health Records: http://localhost:3004

### Quick Commands
```bash
# Run all environments
docker compose up

# Stop all services
docker compose down

# Rebuild and start services
docker compose build
docker compose up
```

## 💻 Local Development

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MoFa01/Cloud_project.git
cd Cloud_project
```

2. Install dependencies:
```bash
# Install Patient Service dependencies
cd patient-service && npm install

# Install Health Records Service dependencies
cd ../health-records-service && npm install

# Install Frontend dependencies
cd ../HealthCareApp-main && npm install
```

### Running Services Locally

Start each service in a separate terminal:

```bash
# Terminal 1 - Patient Service
cd patient-service && npm run start:dev

# Terminal 2 - Health Records Service
cd health-records-service && npm run start:dev

# Terminal 3 - Frontend Application
cd HealthCareApp-main && npm run dev
```

The frontend application will be available at http://localhost:3000

## 📚 API Documentation
For detailed API documentation, visit our [Postman Documentation](https://documenter.getpostman.com/view/24694319/2sB2ixjZbe).

---

Made with ❤️ by Mohamed Fahd
