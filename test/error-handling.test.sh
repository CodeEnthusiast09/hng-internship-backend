#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

BASE_URL="http://localhost:3000"

echo "================================"
echo "Error Handling Tests"
echo "================================"
echo ""

# Test 1: 404 - Country Not Found
echo -e "${YELLOW}Test 1: 404 - Country Not Found${NC}"
response=$(curl -s "$BASE_URL/countries/FakeCountryXYZ")
echo "Response: $response"

if echo "$response" | grep -q '"error":"Country not found"'; then
    echo -e "${GREEN}✓ PASSED${NC} - Correct 404 error format"
else
    echo -e "${RED}✗ FAILED${NC} - Incorrect error format"
fi
echo ""

# Test 2: 404 - Image Not Found (before refresh)
echo -e "${YELLOW}Test 2: 404 - Image Not Found${NC}"
# First delete the image
rm -f cache/summary.png
response=$(curl -s "$BASE_URL/countries/image")
echo "Response: $response"

if echo "$response" | grep -q '"error":"Summary image not found"'; then
    echo -e "${GREEN}✓ PASSED${NC} - Correct 404 error for missing image"
else
    echo -e "${RED}✗ FAILED${NC} - Incorrect error format"
fi
echo ""

# Test 3: 400 - Invalid Sort Parameter
echo -e "${YELLOW}Test 3: 400 - Invalid Sort Parameter${NC}"
response=$(curl -s "$BASE_URL/countries?sort=totally_invalid")
echo "Response: $response"

if echo "$response" | grep -q '"error":"Validation failed"' || echo "$response" | grep -q "Bad Request"; then
    echo -e "${GREEN}✓ PASSED${NC} - Correct 400 validation error"
else
    echo -e "${RED}✗ FAILED${NC} - Incorrect validation error"
fi
echo ""

# Test 4: Check Error Response Structure
echo -e "${YELLOW}Test 4: Error Response Structure${NC}"
response=$(curl -s "$BASE_URL/countries/NonExistent")
echo "Response: $response"

# Check if response is valid JSON with "error" field
if echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); sys.exit(0 if 'error' in data else 1)" 2>/dev/null; then
    echo -e "${GREEN}✓ PASSED${NC} - Error response has correct JSON structure"
else
    echo -e "${RED}✗ FAILED${NC} - Error response missing 'error' field"
fi
echo ""

# Test 5: Case-Insensitive Country Name
echo -e "${YELLOW}Test 5: Case-Insensitive Country Search${NC}"
response1=$(curl -s "$BASE_URL/countries/nigeria")
response2=$(curl -s "$BASE_URL/countries/NIGERIA")
response3=$(curl -s "$BASE_URL/countries/Nigeria")

if [ "$response1" == "$response2" ] && [ "$response2" == "$response3" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Case-insensitive search works"
else
    echo -e "${RED}✗ FAILED${NC} - Case-insensitive search not working"
fi
echo ""

echo "================================"
echo "Error Handling Tests Complete"
echo "================================"
