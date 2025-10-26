#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"
PASSED=0
FAILED=0

echo "================================"
echo "Starting API Tests"
echo "================================"
echo ""

# Function to test endpoint
test_endpoint() {
  local test_name=$1
  local method=$2
  local endpoint=$3
  local expected_status=$4
  local description=$5

  echo -e "${YELLOW}Testing: $test_name${NC}"
  echo "Description: $description"

  if [ "$method" == "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
  elif [ "$method" == "POST" ]; then
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint")
  elif [ "$method" == "DELETE" ]; then
    response=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL$endpoint")
  fi

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" == "$expected_status" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $http_code"
    echo "Response: $body"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAILED${NC} - Expected: $expected_status, Got: $http_code"
    echo "Response: $body"
    ((FAILED++))
  fi
  echo ""
}

# Test 1: Refresh Countries
test_endpoint \
  "POST /countries/refresh" \
  "POST" \
  "/countries/refresh" \
  "201" \
  "Should fetch and cache all countries"

# Wait a bit for refresh to complete
sleep 2

# Test 2: Get All Countries
test_endpoint \
  "GET /countries" \
  "GET" \
  "/countries" \
  "200" \
  "Should return all countries"

# Test 3: Get Status
test_endpoint \
  "GET /status" \
  "GET" \
  "/status" \
  "200" \
  "Should return total countries and last refresh time"

# Test 4: Filter by Region
test_endpoint \
  "GET /countries?region=Africa" \
  "GET" \
  "/countries?region=Africa" \
  "200" \
  "Should return only African countries"

# Test 5: Filter by Currency
test_endpoint \
  "GET /countries?currency=NGN" \
  "GET" \
  "/countries?currency=NGN" \
  "200" \
  "Should return countries with NGN currency"

# Test 6: Sort by GDP
test_endpoint \
  "GET /countries?sort=gdp_desc" \
  "GET" \
  "/countries?sort=gdp_desc" \
  "200" \
  "Should return countries sorted by GDP descending"

# Test 7: Get Single Country
test_endpoint \
  "GET /countries/Nigeria" \
  "GET" \
  "/countries/Nigeria" \
  "200" \
  "Should return Nigeria details"

# Test 9: Country Not Found (404)
test_endpoint \
  "GET /countries/NonExistentCountry123" \
  "GET" \
  "/countries/NonExistentCountry123" \
  "404" \
  "Should return 404 for non-existent country"

# Test 10: Delete Country
test_endpoint \
  "DELETE /countries/Tuvalu" \
  "DELETE" \
  "/countries/Tuvalu" \
  "200" \
  "Should delete Tuvalu"

# Test 11: Verify Deletion (404)
test_endpoint \
  "GET /countries/Tuvalu (after deletion)" \
  "GET" \
  "/countries/Tuvalu" \
  "404" \
  "Should return 404 after deletion"

# Test 12: Invalid Sort Parameter (400)
test_endpoint \
  "GET /countries?sort=invalid_sort" \
  "GET" \
  "/countries?sort=invalid_sort" \
  "400" \
  "Should return 400 for invalid sort parameter"

echo "================================"
echo "Test Summary"
echo "================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}All tests passed! ✓${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed! ✗${NC}"
  exit 1
fi
