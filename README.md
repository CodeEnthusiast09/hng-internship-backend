# HNG Stage 0 - Dynamic Profile Endpoint

A RESTful API built with NestJS that returns profile information along with dynamically fetched cat facts.

## 🚀 Live Demo

**API Endpoint**: `http://your-deployed-url/me`

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
   git clone https://github.com/yourusername/hng-task-1.git
   cd hng-task-1
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
   HTTP_TIMEOUT=5000
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

### Watch Mode

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## 🧪 Testing

### Run all tests

```bash
npm run test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run test coverage

```bash
npm run test:cov
```

### Run e2e tests

```bash
npm run test:e2e
```

## 📡 API Documentation

### Endpoint: GET `/me`

Returns profile information with a dynamic cat fact.

**Request:**

```http
GET /me HTTP/1.1
Host: your-api-url
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

**Response Fields:**

| Field        | Type   | Description                         |
| ------------ | ------ | ----------------------------------- |
| `status`     | string | Always returns "success"            |
| `user.email` | string | User's email address                |
| `user.name`  | string | User's full name                    |
| `user.stack` | string | Backend technology stack            |
| `timestamp`  | string | Current UTC time in ISO 8601 format |
| `fact`       | string | Random cat fact from Cat Facts API  |

**Status Codes:**

- `200 OK`: Successful request
- `500 Internal Server Error`: Server error

## 🏗️ Project Structure

```
hng-task-1/
├── src/
│   ├── profile/
│   │   ├── profile.controller.ts    # HTTP request handlers
│   │   ├── profile.service.ts       # Business logic
│   │   ├── profile.module.ts        # Module configuration
│   │   ├── profile.controller.spec.ts
│   │   └── profile.service.spec.ts
│   ├── app.module.ts                # Root module
│   └── main.ts                      # Application entry point
├── test/
│   └── app.e2e-spec.ts             # End-to-end tests
├── .env                             # Environment variables (not in git)
├── .env.example                     # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🔒 Environment Variables

| Variable           | Description               | Default                      |
| ------------------ | ------------------------- | ---------------------------- |
| `PORT`             | Server port               | 3000                         |
| `CAT_FACT_API_URL` | Cat Facts API endpoint    | <https://catfact.ninja/fact> |
| `USER_EMAIL`       | Your email address        | -                            |
| `USER_NAME`        | Your full name            | -                            |
| `USER_STACK`       | Your backend stack        | -                            |
| `HTTP_TIMEOUT`     | HTTP request timeout (ms) | 5000                         |

## 🐛 Error Handling

The API implements comprehensive error handling:

- **External API Timeout**: Returns fallback message if Cat Facts API times out
- **External API Failure**: Returns error message if Cat Facts API is unavailable
- **Network Errors**: Gracefully handles network connectivity issues

## 🔍 Testing the API

### Using cURL

```bash
curl http://localhost:3000/me
```

### Using HTTPie

```bash
http GET http://localhost:3000/me
```

### Using Browser

Simply navigate to: `http://localhost:3000/me`

## 📝 Development Notes

### Key Implementation Details

1. **Dynamic Timestamp**: Generated on each request using `new Date().toISOString()`
2. **Cat Fact Fetching**: New fact fetched on every request (not cached)
3. **Observable to Promise**: Uses `firstValueFrom` to convert RxJS Observables
4. **CORS**: Enabled for cross-origin requests
5. **Logging**: Built-in NestJS logger for debugging

### Best Practices Implemented

- ✅ Separation of concerns (Controller → Service pattern)
- ✅ Environment-based configuration
- ✅ Proper error handling and fallbacks
- ✅ TypeScript for type safety
- ✅ Modular architecture
- ✅ Comprehensive logging
- ✅ API timeout configuration

## 🚀 Deployment

This application can be deployed to various platforms:

- Railway (Recommended)
- Heroku
- AWS (EC2, Elastic Beanstalk)
- Digital Ocean

See the deployment section in the documentation for detailed instructions.

## 📚 Dependencies

### Production Dependencies

- `@nestjs/common`: ^10.0.0
- `@nestjs/core`: ^10.0.0
- `@nestjs/platform-express`: ^10.0.0
- `@nestjs/axios`: ^3.0.0
- `@nestjs/config`: ^3.0.0
- `axios`: ^1.6.0
- `rxjs`: ^7.8.1

### Development Dependencies

- `@nestjs/cli`: ^10.0.0
- `@nestjs/schematics`: ^10.0.0
- `@nestjs/testing`: ^10.0.0
- TypeScript: ^5.1.3
- Jest: ^29.5.0

## 🤝 Contributing

This is a bootcamp task submission. However, suggestions and feedback are welcome!

## 👨‍💻 Author

**Your Name**

- Email: <your.email@example.com>
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

**HNG Internship** - Backend Track Stage 0
