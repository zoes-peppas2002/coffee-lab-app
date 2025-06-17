/**
 * Test Login Endpoints Script
 * 
 * This script tests all possible login endpoints to verify they're working correctly.
 */

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Admin credentials for testing
const adminCredentials = {
  email: 'zp@coffeelab.gr',
  password: 'Zoespeppas2025!'
};

// Function to test a login endpoint
async function testEndpoint(url, credentials) {
  try {
    console.log(`Testing endpoint: ${url}`);
    const response = await axios.post(url, credentials, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log(`✅ Success! Status: ${response.status}`);
    console.log(`Response data: ${JSON.stringify(response.data)}`);
    return true;
  } catch (error) {
    console.log(`❌ Failed! ${error.message}`);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// Main function to test all endpoints
async function testAllEndpoints() {
  console.log('='.repeat(60));
  console.log('COFFEE LAB - TEST LOGIN ENDPOINTS');
  console.log('='.repeat(60));
  
  // Determine base URL
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://coffee-lab-app.onrender.com'
    : 'http://localhost:5000';
  
  console.log(`Using base URL: ${baseUrl}`);
  console.log(`Testing with credentials: ${adminCredentials.email}`);
  
  // Test all possible endpoints
  const endpoints = [
    `${baseUrl}/api/direct-auth`,
    `${baseUrl}/direct-auth`,
    `${baseUrl}/api/test-login`,
    `${baseUrl}/test-login`
  ];
  
  let successCount = 0;
  
  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint, adminCredentials);
    if (success) successCount++;
    console.log('-'.repeat(60));
  }
  
  console.log(`${successCount} out of ${endpoints.length} endpoints working correctly.`);
  
  if (successCount === 0) {
    console.log('❌ All endpoints failed! Please check your server configuration.');
  } else if (successCount < endpoints.length) {
    console.log('⚠️ Some endpoints are working, but not all. This might cause issues in some environments.');
  } else {
    console.log('✅ All endpoints are working correctly!');
  }
}

// Run the tests
testAllEndpoints().catch(err => {
  console.error('Error running tests:', err);
});
