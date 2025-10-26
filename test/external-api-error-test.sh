#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

BASE_URL="http://localhost:3000"

echo "================================"
echo "External API Error Test"
echo "================================"
echo ""

echo -e "${YELLOW}Manual Test: External API Failure${NC}"
echo "To test this:"
echo "1. Stop your NestJS app (Ctrl+C)"
echo "2. Edit .env and change COUNTRIES_API_URL to an invalid URL:"
echo "   COUNTRIES_API_URL=https://invalid-url-xyz.com/api"
echo "3. Restart your app: npm run start:dev"
echo "4. Run: curl -X POST http://localhost:3000/countries/refresh"
echo ""
echo "Expected Response:"
echo '{"error":"External data source unavailable","details":"Could not fetch data from [API name]"}'
echo ""
echo "Expected Status Code: 503"
echo ""
echo "After testing, restore the correct URL in .env"
