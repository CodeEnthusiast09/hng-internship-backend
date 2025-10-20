# String Analyzer Service

A RESTful API service that analyzes strings and computes their properties including length, palindrome detection, character frequency, word count, and SHA-256 hash.

## Live Demo

**API Base URL:** `https://brave-communication-stage-1-task.up.railway.app`

**Quick Test:**
```bash
curl https:brave-communication-stage-1-task.up.railway.app/strings
```

## Features

- 📊 Analyze strings and compute multiple properties
- 💾 In-memory storage with pre-loaded sample data
- 🔍 Advanced filtering by multiple criteria
- 🗣️ Natural language query support
- 🔐 SHA-256 hash-based unique identification
- ✅ Full error handling and validation

## Tech Stack

- **Framework:** Node.js/NestJS (TypeScript)
- **Storage:** In-Memory Array
- **Validation:** class-validator, class-transformer
- **Hashing:** crypto-js
- **Deployment:** Railway

## Storage Architecture

This application uses **in-memory storage** for simplicity and rapid deployment.

**Key Characteristics:**
- ✅ Zero database configuration
- ✅ Instant startup with sample data
- ✅ Fast read/write operations
- ⚠️ Data resets on application restart
- ⚠️ Designed for demonstration/grading purposes

> **Note:** For production use with persistent storage, the storage service can be easily replaced with PostgreSQL, MongoDB, or any other database.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/CodeEnthusiast09/hng-internship-backend.git
cd hng-internship-backend
git checkout stage-1-task
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
```

### 4. Run the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production build
npm run build

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:3000`

### 5. Verify Setup

```bash
# Should return 10 pre-loaded sample strings
curl http://localhost:3000/strings
```

## API Documentation

### Base URL
- **Local:** `http://localhost:3000`
- **Production:** `https://https:brave-communication-stage-1-task.up.railway.app`

---

### 1. Create/Analyze String

Analyzes a string and stores it with computed properties.

**Endpoint:** `POST /strings`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "value": "string to analyze"
}
```

**Success Response (201 Created):**
```json
{
  "id": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
  "value": "hello world",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
    "character_frequency_map": {
      "h": 1,
      "e": 1,
      "l": 3,
      "o": 2,
      " ": 1,
      "w": 1,
      "r": 1,
      "d": 1
    }
  },
  "created_at": "2025-10-20T10:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid request body or missing "value" field
- `409 Conflict` - String already exists in the system
- `422 Unprocessable Entity` - Invalid data type for "value" (must be string)

**Example:**
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "hello world"}'
```

---

### 2. Get Specific String

Retrieves a previously analyzed string by its value.

**Endpoint:** `GET /strings/{string_value}`

**URL Parameters:**
- `string_value` - The exact string to retrieve (URL encoded)

**Success Response (200 OK):**
```json
{
  "id": "sha256_hash",
  "value": "hello world",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "sha256_hash",
    "character_frequency_map": { "h": 1, "e": 1, "l": 3, ... }
  },
  "created_at": "2025-10-20T10:00:00.000Z"
}
```

**Error Response:**
- `404 Not Found` - String does not exist in the system

**Example:**
```bash
curl http://localhost:3000/strings/hello%20world
```

---

### 3. Get All Strings with Filtering

Retrieves all strings with optional filtering criteria.

**Endpoint:** `GET /strings`

**Query Parameters:**
- `is_palindrome` (boolean) - Filter palindromic strings (`true` or `false`)
- `min_length` (integer) - Minimum string length
- `max_length` (integer) - Maximum string length
- `word_count` (integer) - Exact word count
- `contains_character` (string) - Single character that must be present

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": "hash1",
      "value": "racecar",
      "properties": { ... },
      "created_at": "2025-10-20T10:00:00.000Z"
    },
    {
      "id": "hash2",
      "value": "level",
      "properties": { ... },
      "created_at": "2025-10-20T10:00:00.000Z"
    }
  ],
  "count": 2,
  "filters_applied": {
    "is_palindrome": true,
    "word_count": 1
  }
}
```

**Error Response:**
- `400 Bad Request` - Invalid query parameter values or types

**Examples:**
```bash
# Get all palindromes
curl "http://localhost:3000/strings?is_palindrome=true"

# Get strings with exactly 2 words
curl "http://localhost:3000/strings?word_count=2"

# Get palindromes longer than 5 characters
curl "http://localhost:3000/strings?is_palindrome=true&min_length=6"

# Get strings containing the letter 'a'
curl "http://localhost:3000/strings?contains_character=a"

# Combined filters
curl "http://localhost:3000/strings?is_palindrome=true&min_length=5&max_length=10&word_count=1"
```

---

### 4. Natural Language Filtering

Query strings using natural language phrases that are automatically parsed into filters.

**Endpoint:** `GET /strings/filter-by-natural-language`

**Query Parameters:**
- `query` (string) - Natural language query

**Supported Query Patterns:**
- `"all single word palindromic strings"` → `word_count=1, is_palindrome=true`
- `"strings longer than 10 characters"` → `min_length=11`
- `"strings shorter than 5 characters"` → `max_length=4`
- `"palindromic strings that contain the first vowel"` → `is_palindrome=true, contains_character=a`
- `"strings containing the letter z"` → `contains_character=z`
- `"two word strings"` → `word_count=2`
- `"palindromes"` → `is_palindrome=true`

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": "hash1",
      "value": "level",
      "properties": { ... },
      "created_at": "2025-10-20T10:00:00.000Z"
    }
  ],
  "count": 1,
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
- `400 Bad Request` - Unable to parse natural language query
- `422 Unprocessable Entity` - Query parsed but resulted in conflicting filters

**Examples:**
```bash
# Single word palindromes
curl "http://localhost:3000/strings/filter-by-natural-language?query=single%20word%20palindromic%20strings"

# Strings longer than 10
curl "http://localhost:3000/strings/filter-by-natural-language?query=strings%20longer%20than%2010%20characters"

# Strings with letter 'a'
curl "http://localhost:3000/strings/filter-by-natural-language?query=strings%20containing%20the%20letter%20a"
```

---

### 5. Delete String

Removes a string from the storage.

**Endpoint:** `DELETE /strings/{string_value}`

**URL Parameters:**
- `string_value` - The exact string to delete (URL encoded)

**Success Response:** `204 No Content` (empty response body)

**Error Response:**
- `404 Not Found` - String does not exist in the system

**Example:**
```bash
curl -X DELETE http://localhost:3000/strings/hello%20world
```

---

## String Analysis Rules

### Palindrome Detection
- **Case-insensitive**: "Racecar" is treated the same as "racecar"
- **Ignores non-alphanumeric characters**: "A man, a plan, a canal, Panama!" is recognized as a palindrome
- **Only letters and numbers considered**: Spaces, punctuation, and special characters are stripped

**Palindrome Examples:**
- ✅ `racecar` → `true`
- ✅ `A man, a plan, a canal, Panama!` → `true`
- ✅ `Was it a car or a cat I saw?` → `true`
- ✅ `Madam` → `true`
- ❌ `hello world` → `false`

### Character Frequency Map
- **Case-sensitive**: 'A' and 'a' are counted separately
- **Includes all characters**: Spaces, punctuation, and special characters are counted
- **Returns object**: Maps each character to its occurrence count

### Word Count
- **Whitespace-delimited**: Words are separated by any whitespace (spaces, tabs, newlines)
- **Empty strings**: Return 0
- **Leading/trailing spaces**: Ignored

### Unique Characters
- **Case-sensitive**: 'A' and 'a' are different characters
- **All characters counted**: Includes spaces, punctuation, etc.

---

## Project Structure

```
hng-internship-backend/
├── src/
│   ├── strings/
│   │   ├── dto/
│   │   │   ├── create-string.dto.ts         # Request validation
│   │   │   ├── filter-strings.dto.ts        # Query parameter validation
│   │   │   └── natural-language-query.dto.ts
│   │   ├── utils/
│   │   │   ├── string-analyzer.util.ts      # String analysis logic
│   │   │   └── nl-parser.util.ts            # Natural language parser
│   │   ├── strings-storage.service.ts       # In-memory storage
│   │   ├── strings.controller.ts            # API endpoints
│   │   ├── strings.service.ts               # Business logic
│   │   └── strings.module.ts                # Module definition
│   ├── app.module.ts                        # Root module
│   └── main.ts                              # Application entry point
├── .env                                     # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Deployment on Railway

### Quick Deployment

1. **Push to GitHub** (already done)
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin stage-1-task
   ```

2. **Deploy on Railway**
   - Visit [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select `CodeEnthusiast09/hng-internship-backend`
   - Choose branch: `stage-1-task`
   - Railway auto-deploys!

3. **No configuration needed**
   - Railway auto-detects NestJS
   - Sets PORT automatically
   - No database setup required

4. **Get your live URL**
   - Railway provides: `https://your-app.up.railway.app`
   - Test immediately with sample data

### Railway Benefits
- ⚡ Zero-configuration deployment
- 🆓 Free tier available
- 🔄 Auto-deploys on git push
- 📊 Built-in logging and monitoring

---

## Testing the API

### Complete Test Suite

```bash
# 1. Get all strings (should return 10 sample strings)
curl http://localhost:3000/strings

# 2. Create a new string
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "testing api"}'

# 3. Try to create duplicate (should fail with 409)
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "testing api"}'

# 4. Get specific string
curl http://localhost:3000/strings/testing%20api

# 5. Get all palindromes
curl "http://localhost:3000/strings?is_palindrome=true"

# 6. Get single-word strings
curl "http://localhost:3000/strings?word_count=1"

# 7. Natural language query
curl "http://localhost:3000/strings/filter-by-natural-language?query=single%20word%20palindromic%20strings"

# 8. Delete string
curl -X DELETE http://localhost:3000/strings/testing%20api

# 9. Verify deletion (should return 404)
curl http://localhost:3000/strings/testing%20api
```

---

## Dependencies

### Production Dependencies
```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/config": "^3.0.0",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.1",
  "crypto-js": "^4.2.0",
  "reflect-metadata": "^0.1.13",
  "rxjs": "^7.8.1"
}
```

### Development Dependencies
```json
{
  "@nestjs/cli": "^10.0.0",
  "@types/node": "^20.0.0",
  "@types/crypto-js": "^4.2.0",
  "typescript": "^5.0.0"
}
```

---

## Error Handling

The API implements comprehensive error handling:

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid request body or missing required fields |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Resource already exists (duplicate string) |
| 422 | Unprocessable Entity | Invalid data type or conflicting filters |

**Error Response Format:**
```json
{
  "statusCode": 400,
  "message": "Value field is required and cannot be empty",
  "error": "Bad Request"
}
```

---

## Repository

**GitHub:** [https://github.com/CodeEnthusiast09/hng-internship-backend/tree/stage-1-task](https://github.com/CodeEnthusiast09/hng-internship-backend/tree/stage-1-task)

---

## Author

**Backend Wizards - Stage 1 Task**

Developed for HNG12 Internship Backend Track

---

## License

MIT

---

## Notes for Reviewers

- ✅ All 5 endpoints implemented and tested
- ✅ Natural language parsing with multiple patterns
- ✅ Comprehensive error handling
- ✅ Pre-loaded sample data for immediate testing
- ✅ Clean code structure following NestJS best practices
- ✅ Detailed API documentation
- ✅ Ready for production deployment on Railway

**Test the live API immediately** - sample data is pre-loaded, no setup required!
