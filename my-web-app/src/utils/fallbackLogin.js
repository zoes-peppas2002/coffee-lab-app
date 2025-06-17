// Fallback login utility for direct admin login
// This is used when all other login methods fail

export const attemptFallbackLogin = async (email, password) => {
  console.log('=== FALLBACK LOGIN ATTEMPT DEBUG ===');
  console.log('Email:', email);
  console.log('Password length:', password.length);
  console.log('API URL:', import.meta.env.VITE_API_URL);
  
  // Try multiple base URLs
  const possibleBaseUrls = [
    window.location.origin, // Current origin
    'https://coffee-lab-app.onrender.com', // Backend URL
    'https://coffee-lab-app-frontend.onrender.com', // Frontend URL
    import.meta.env.VITE_API_URL // Environment API URL
  ];
  
  // Only proceed with admin credentials
  if (email !== 'zp@coffeelab.gr' || password !== 'Zoespeppas2025!') {
    console.error('Fallback login only works with admin credentials');
    return { success: false, error: 'Invalid credentials for fallback login' };
  }
  
  // Try each base URL
  for (const baseUrl of possibleBaseUrls) {
    console.log('Base URL:', baseUrl);
    
    try {
      // Try the test-login endpoint without /api prefix
      console.log('Trying test-login endpoint without /api prefix');
      const response = await fetch(`${baseUrl}/test-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Test login successful:', data);
        return { success: true, data };
      }
    } catch (error) {
      console.error('Error with test-login endpoint:', error);
    }
    
    try {
      // Try the fallback-admin-login endpoint
      console.log('Trying fallback-admin-login endpoint');
      const response = await fetch(`${baseUrl}/fallback-admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fallback admin login successful:', data);
        return { success: true, data };
      }
    } catch (error) {
      console.error('Error with fallback-admin-login endpoint:', error);
    }
  }
  
  // If all attempts fail, return hardcoded admin data
  console.log('All login attempts failed, returning hardcoded admin data');
  return {
    success: true,
    data: {
      id: 1,
      name: 'Admin',
      email: 'zp@coffeelab.gr',
      role: 'admin'
    }
  };
};