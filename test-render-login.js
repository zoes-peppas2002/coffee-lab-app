/**
 * Script to test the login functionality on Render
 * This script:
 * 1. Makes a request to the login endpoint on Render
 * 2. Checks if the response is successful
 * 3. Displays the response
 */
const axios = require('axios');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Configuration
const LOGIN_ENDPOINT = '/api/auth/direct-login';
const TEST_LOGIN_ENDPOINT = '/test-login';
const ADMIN_EMAIL = 'zp@coffeelab.gr';
const ADMIN_PASSWORD = 'Zoespeppas2025!';

// Function to test the login endpoint
async function testLogin(renderUrl) {
  console.log('=================================================');
  console.log('COFFEE LAB - TEST RENDER LOGIN');
  console.log('=================================================');
  console.log('\nTesting login functionality on Render...');
  
  // Remove trailing slash if present
  if (renderUrl.endsWith('/')) {
    renderUrl = renderUrl.slice(0, -1);
  }
  
  // Add https:// if not present
  if (!renderUrl.startsWith('http')) {
    renderUrl = `https://${renderUrl}`;
  }
  
  console.log(`\nRender URL: ${renderUrl}`);
  
  const loginData = {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  };
  
  console.log(`\nLogin data: ${JSON.stringify(loginData)}`);
  
  // Test the direct-login endpoint
  try {
    console.log('\nTesting direct-login endpoint...');
    console.log(`URL: ${renderUrl}${LOGIN_ENDPOINT}`);
    
    const response = await axios.post(`${renderUrl}${LOGIN_ENDPOINT}`, loginData);
    
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
      console.log(`URL: ${renderUrl}${TEST_LOGIN_ENDPOINT}`);
      
      const testResponse = await axios.post(`${renderUrl}${TEST_LOGIN_ENDPOINT}`, loginData);
      
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
    const renderUrl = await prompt('\nEnter the Render URL (e.g., coffee-lab-app.onrender.com): ');
    
    if (!renderUrl) {
      console.log('\nNo URL provided. Exiting...');
      rl.close();
      return;
    }
    
    const success = await testLogin(renderUrl);
    
    if (success) {
      console.log('\n=================================================');
      console.log('LOGIN TEST SUCCESSFUL');
      console.log('=================================================');
      console.log('\nThe login functionality is working correctly on Render.');
      console.log('\nYou can now use the application on Render.');
    } else {
      console.log('\n=================================================');
      console.log('LOGIN TEST FAILED');
      console.log('=================================================');
      console.log('\nThe login functionality is not working correctly on Render.');
      console.log('\nPlease check the following:');
      console.log('1. Make sure the application is deployed correctly');
      console.log('2. Make sure the database is configured correctly');
      console.log('3. Check the logs in the Render dashboard for any errors');
    }
    
    rl.close();
  } catch (error) {
    console.error('\nAn error occurred while testing the login functionality:');
    console.error(error.message);
    rl.close();
  }
}

// Run the main function
main();
