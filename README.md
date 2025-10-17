# HNG Stage 0 - Dynamic Profile Endpoint

A RESTful API built with NestJS that returns profile information along with dynamically fetched cat facts.

## 🚀 Live Demo

**API Endpoint**: `https://hng-internship-backend-production.up.railway.app/me`

## 📋 Features

- ✅ Dynamic profile information endpoint
- ✅ Real-time cat facts from external API
- ✅ ISO 8601 timestamp generation
- ✅ Graceful error handling
- ✅ Environment-based configuration
- ✅ CORS enabled
- ✅ Comprehensive logging

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **HTTP Client**: Axios
- **External API**: Cat Facts Ninja API

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm (v8 or higher)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/CodeEnthusiast09/hng-internship-backend.git
   cd hng-internship-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your information:

   ```env
   PORT=3000
   CAT_FACT_API_URL=https://catfact.ninja/fact
   USER_EMAIL=your.email@example.com
   USER_NAME=Your Full Name
   USER_STACK=Node.js/NestJS
   HTTP_TIMEOUT=10000
   ```

## 🚀 Running the Application

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## 📡 API Documentation

### Endpoint: GET `/me`

Returns profile information with a dynamic cat fact.

**Request:**

```http
GET /me HTTP/1.1
Host: https://hng-internship-backend-production.up.railway.app/
```

**Response:**

```json
{
  "status": "success",
  "user": {
    "email": "your.email@example.com",
    "name": "Your Full Name",
    "stack": "Node.js/NestJS"
  },
  "timestamp": "2025-10-17T15:30:45.123Z",
  "fact": "Cats sleep 70% of their lives."
}
```

**HNG Internship** - Backend Track Stage 0
