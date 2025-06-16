/**
 * Script to test the login functionality
 * This script:
 * 1. Makes a request to the test-login endpoint
 * 2. Makes a request to the direct-login endpoint
 * 3. Logs the results
 */
const axios = require('axios');

// Admin credentials
const adminCredentials = {
  email: 'zp@coffeelab.gr',
  password: 'Zoespeppas2025!'
};

// API URL
const apiUrl = 'http://localhost:5000/api';

// Test the test-login endpoint
async function testTestLogin() {
  console.log('=== TESTING TEST-LOGIN ENDPOINT ===');
  try {
    const response = await axios.post(`${apiUrl}/test-login`, adminCredentials);
    console.log('Test login successful!');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('Test login failed!');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Test the direct-login endpoint
async function testDirectLogin() {
  console.log('\n=== TESTING DIRECT-LOGIN ENDPOINT ===');
  try {
    const response = await axios.post(`${apiUrl}/auth/direct-login`, adminCredentials);
    console.log('Direct login successful!');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('Direct login failed!');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Main function
async function main() {
  console.log('=================================================');
  console.log('COFFEE LAB - TEST LOGIN');
  console.log('=================================================');
  console.log('Testing login with admin credentials:');
  console.log('Email:', adminCredentials.email);
  console.log('Password:', adminCredentials.password);
  console.log('API URL:', apiUrl);
  console.log('=================================================');
  
  // Test the test-login endpoint
  const testLoginResult = await testTestLogin();
  
  // Test the direct-login endpoint
  const directLoginResult = await testDirectLogin();
  
  // Summary
  console.log('\n=================================================');
  console.log('SUMMARY');
  console.log('=================================================');
  console.log(`Test Login: ${testLoginResult ? '✅ Successful' : '❌ Failed'}`);
  console.log(`Direct Login: ${directLoginResult ? '✅ Successful' : '❌ Failed'}`);
  
  if (testLoginResult && directLoginResult) {
    console.log('\n✅ All login tests passed!');
  } else {
    console.log('\n❌ Some login tests failed. Please check the logs above.');
  }
}

// Run the main function
main().catch(err => {
  console.error('Error:', err);
});
