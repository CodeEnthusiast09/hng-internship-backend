# String Analyzer Service

A RESTful API service that analyzes strings and stores their computed properties.

## Features

- Analyze strings and compute properties (length, palindrome check, character frequency, etc.)
- Store analyzed strings in-memory
- Filter strings by various criteria
- Natural language query support
- SHA-256 hash-based unique identification

## Tech Stack

- **Framework:** NestJS
- **Storage:** In-Memory Array
- **Language:** TypeScript
- **Validation:** class-validator, class-transformer

## Storage Method

This application uses **in-memory storage** for simplicity and ease of deployment. 

### Key Points:
- ✅ No database setup required
- ✅ Fast and simple deployment
- ✅ Comes pre-loaded with sample data for testing
- ⚠️ **Data is reset when the application restarts**
- ⚠️ Not suitable for long-term production use

**Note:** For a production-ready version with persistent storage, PostgreSQL or MongoDB can be easily integrated by swapping the storage service.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd string-analyzer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
```

### 4. Run the application

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Endpoints

### 1. Create/Analyze String

**POST** `/strings`

**Request Body:**
```json
{
  "value": "string to analyze"
}
```

**Response (201 Created):**
```json
{
  "id": "sha256_hash_value",
  "value": "string to analyze",
  "properties": {
    "length": 16,
    "is_palindrome": false,
    "unique_characters": 12,
    "word_count": 3,
    "sha256_hash": "abc123...",
    "character_frequency_map": {
      "s": 2,
      "t": 3,
      "r": 2
    }
  },
  "created_at": "2025-10-20T10:00:00Z"
}
```

**Error Responses:**
- `409 Conflict`: String already exists
- `400 Bad Request`: Invalid request body or missing "value" field
- `422 Unprocessable Entity`: Invalid data type for "value" (must be string)

### 2. Get Specific String

**GET** `/strings/{string_value}`

**Example:**
```bash
GET /strings/hello%20world
```

**Response (200 OK):**
```json
{
  "id": "sha256_hash_value",
  "value": "hello world",
  "properties": { /* ... */ },
  "created_at": "2025-10-20T10:00:00Z"
}
```

**Error Response:**
- `404 Not Found`: String does not exist

### 3. Get All Strings (with filtering)

**GET** `/strings?is_palindrome=true&min_length=5&max_length=20&word_count=2&contains_character=a`

**Query Parameters:**
- `is_palindrome`: boolean (true/false)
- `min_length`: integer (minimum string length)
- `max_length`: integer (maximum string length)
- `word_count`: integer (exact word count)
- `contains_character`: string (single character)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "hash1",
      "value": "string1",
      "properties": { /* ... */ },
      "created_at": "2025-10-20T10:00:00Z"
    }
  ],
  "count": 15,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5,
    "max_length": 20,
    "word_count": 2,
    "contains_character": "a"
  }
}
```

**Error Response:**
- `400 Bad Request`: Invalid query parameter values or types

### 4. Natural Language Filtering

**GET** `/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings`

**Supported Query Patterns:**
- "all single word palindromic strings" → word_count=1, is_palindrome=true
- "strings longer than 10 characters" → min_length=11
- "palindromic strings that contain the first vowel" → is_palindrome=true, contains_character=a
- "strings containing the letter z" → contains_character=z

**Response (200 OK):**
```json
{
  "data": [ /* array of matching strings */ ],
  "count": 3,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Unable to parse natural language query
- `422 Unprocessable Entity`: Query parsed but resulted in conflicting filters

### 5. Delete String

**DELETE** `/strings/{string_value}`

**Response:** `204 No Content`

**Error Response:**
- `404 Not Found`: String does not exist

## Testing Examples

### Using cURL

```bash
# 1. Get all pre-loaded strings
curl http://localhost:3000/strings

# 2. Create a new string
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "hello world"}'

# 3. Get specific string
curl http://localhost:3000/strings/hello%20world

# 4. Filter palindromes
curl "http://localhost:3000/strings?is_palindrome=true"

# 5. Filter by word count
curl "http://localhost:3000/strings?word_count=2"

# 6. Natural language query
curl "http://localhost:3000/strings/filter-by-natural-language?query=single%20word%20palindromic%20strings"

# 7. Delete string
curl -X DELETE http://localhost:3000/strings/hello%20world
```

## Project Structure

```
string-analyzer/
├── src/
│   ├── strings/
│   │   ├── dto/                          # Data Transfer Objects
│   │   │   ├── create-string.dto.ts
│   │   │   ├── filter-strings.dto.ts
│   │   │   └── natural-language-query.dto.ts
│   │   ├── utils/                        # Utility functions
│   │   │   ├── string-analyzer.util.ts   # String analysis logic
│   │   │   └── nl-parser.util.ts         # Natural language parser
│   │   ├── strings-storage.service.ts    # In-memory storage
│   │   ├── strings.controller.ts         # API endpoints
│   │   ├── strings.service.ts            # Business logic
│   │   └── strings.module.ts             # Module definition
│   ├── app.module.ts
│   └── main.ts
├── .env                                  # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Deployment (Railway)

### Quick Deployment Steps

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - String Analyzer API"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects NestJS and deploys

3. **No additional configuration needed!**
   - No database to set up
   - No environment variables required (optional PORT only)
   - App starts with sample data automatically

4. **Your API is live!**
   - Access at: `https://your-app.up.railway.app`

### Railway Benefits with In-Memory Storage
- ⚡ Faster deployment (no database provisioning)
- 🎯 Zero configuration
- 💰 Free tier friendly (no database costs)
- 🚀 Instant restarts

## Dependencies

### Production
- `@nestjs/common`: ^10.0.0
- `@nestjs/core`: ^10.0.0
- `@nestjs/config`: ^3.0.0
- `class-validator`: ^0.14.0
- `class-transformer`: ^0.5.1
- `crypto-js`: ^4.2.0

### Development
- `@nestjs/cli`: ^10.0.0
- `@types/node`: ^20.0.0
- `@types/crypto-js`: ^4.2.0
- `typescript`: ^5.0.0

## API Design Notes

### Palindrome Detection
The palindrome checker ignores all non-alphanumeric characters (spaces, punctuation, etc.) and is case-insensitive. 

Examples that return `true`:
- "racecar"
- "A man, a plan, a canal, Panama!"
- "Was it a car or a cat I saw?"

### Character Frequency Map
Counts ALL characters including spaces and punctuation, maintaining case sensitivity.

### Word Count
Words are defined as sequences of characters separated by whitespace.

## License

MIT

---

**Built with NestJS** | **For Backend Wizards Bootcamp - Stage 1**
