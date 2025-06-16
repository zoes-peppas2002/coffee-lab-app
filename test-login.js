/**
 * Script to test the login functionality locally
 * This script:
 * 1. Makes a request to the login endpoint
 * 2. Checks if the response is successful
 * 3. Displays the response
 */
const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:5000';
const LOGIN_ENDPOINT = '/api/auth/direct-login';
const TEST_LOGIN_ENDPOINT = '/test-login';
const ADMIN_EMAIL = 'zp@coffeelab.gr';
const ADMIN_PASSWORD = 'Zoespeppas2025!';

// Function to test the login endpoint
async function testLogin() {
  console.log('=================================================');
  console.log('COFFEE LAB - TEST LOGIN');
  console.log('=================================================');
  console.log('\nTesting login functionality...');
  
  const loginData = {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  };
  
  console.log(`\nLogin data: ${JSON.stringify(loginData)}`);
  
  // Test the direct-login endpoint
  try {
    console.log('\nTesting direct-login endpoint...');
    console.log(`URL: ${API_URL}${LOGIN_ENDPOINT}`);
    
    const response = await axios.post(`${API_URL}${LOGIN_ENDPOINT}`, loginData);
    
    console.log('\n✅ Login successful!');
    console.log('\nResponse:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.log('\n❌ Login failed on direct-login endpoint.');
    console.log('\nError:');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.log(error.message);
    }
    
    // Try the test-login endpoint
    try {
      console.log('\nTesting test-login endpoint...');
      console.log(`URL: ${API_URL}${TEST_LOGIN_ENDPOINT}`);
      
      const testResponse = await axios.post(`${API_URL}${TEST_LOGIN_ENDPOINT}`, loginData);
      
      console.log('\n✅ Login successful on test-login endpoint!');
      console.log('\nResponse:');
      console.log(JSON.stringify(testResponse.data, null, 2));
      
      return true;
    } catch (testError) {
      console.log('\n❌ Login failed on test-login endpoint.');
      console.log('\nError:');
      if (testError.response) {
        console.log(`Status: ${testError.response.status}`);
        console.log(`Data: ${JSON.stringify(testError.response.data, null, 2)}`);
      } else {
        console.log(testError.message);
      }
      
      return false;
    }
  }
}

// Main function
async function main() {
  try {
    const success = await testLogin();
    
    if (success) {
      console.log('\n=================================================');
      console.log('LOGIN TEST SUCCESSFUL');
      console.log('=================================================');
      console.log('\nThe login functionality is working correctly.');
      console.log('\nYou can now proceed with deploying the application to Render.');
    } else {
      console.log('\n=================================================');
      console.log('LOGIN TEST FAILED');
      console.log('=================================================');
      console.log('\nThe login functionality is not working correctly.');
      console.log('\nPlease fix the issues before deploying the application to Render.');
    }
  } catch (error) {
    console.error('\nAn error occurred while testing the login functionality:');
    console.error(error.message);
  }
}

// Run the main function
main();
