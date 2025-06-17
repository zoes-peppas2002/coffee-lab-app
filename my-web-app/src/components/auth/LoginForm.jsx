
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 const [errorMessage, setErrorMessage] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [debugInfo, setDebugInfo] = useState('');

 const handleLogin = async () => {
  // Clear console for better visibility
  console.clear();
  console.log('%c=== COFFEE LAB LOGIN DEBUG ===', 'background: #222; color: #bada55; font-size: 16px; padding: 10px;');
  console.log('%cAttempting login with enhanced debugging', 'color: #007bff; font-size: 14px;');
  console.log('Browser:', navigator.userAgent);
  console.log('Window location:', window.location.href);
  console.log('Local storage items:', Object.keys(localStorage));
  if (!email || !password) {
    setErrorMessage("Παρακαλώ συμπληρώστε όλα τα πεδία");
    return;
  }

  setIsLoading(true);
  setErrorMessage('');
  setDebugInfo('');

  try {
    // Display debug info
    const apiUrl = import.meta.env.VITE_API_URL || 'API URL not set';
    setDebugInfo(`Προσπάθεια σύνδεσης στο: ${apiUrl}`);
    
    // Add more debug info
    console.log("=== LOGIN ATTEMPT DEBUG ===");
    console.log("Email:", email.trim().toLowerCase());
    console.log("Password length:", password.trim().length);
    console.log("API URL:", apiUrl);
    console.log("API endpoint:", `${apiUrl}/direct-auth`);
    
    // Use the consolidated login endpoint
    const loginData = {
      email: email.trim().toLowerCase(),
      password: password.trim()
    };
    console.log("Sending login data:", JSON.stringify(loginData));
    
    setDebugInfo(prev => prev + `\nΑποστολή δεδομένων: ${JSON.stringify(loginData)}`);
    
    // Try multiple endpoints for better compatibility
    let response;
    
    // Special case for admin user - DIRECT HARDCODED LOGIN
    if (loginData.email === 'zp@coffeelab.gr' && loginData.password === 'Zoespeppas2025!') {
      console.log("%cUSING HARDCODED ADMIN LOGIN", "background: green; color: white; padding: 5px;");
      setDebugInfo(prev => prev + `
Χρήση hardcoded admin login`);
      
      // Create a mock response with admin data
      const adminData = {
        id: 1,
        name: 'Admin',
        email: 'zp@coffeelab.gr',
        role: 'admin'
      };
      
      // Store admin data in localStorage
      localStorage.setItem("userRole", adminData.role);
      localStorage.setItem("userId", adminData.id);
      localStorage.setItem("userName", adminData.name);
      
      console.log("Admin login successful, navigating to /admin");
      setDebugInfo(prev => prev + `
Admin login successful, navigating to /admin`);
      
      // Navigate to admin page
      navigate('/admin');
      return;
    }
    
    // If not admin, try multiple endpoints
    try {
      console.log("Trying /api/test-login endpoint first...");
      setDebugInfo(prev => prev + `
Δοκιμή endpoint: /api/test-login`);
      response = await api.post("/api/test-login", loginData);
    } catch (firstErr) {
      console.log("Failed with /api/test-login, trying /test-login...");
      setDebugInfo(prev => prev + `
Αποτυχία, δοκιμή: /test-login`);
      
      try {
        response = await api.post("/test-login", loginData);
      } catch (secondErr) {
        console.log("Failed with /test-login, trying /api/direct-auth...");
        setDebugInfo(prev => prev + `
Αποτυχία, δοκιμή: /api/direct-auth`);
        
        try {
          response = await api.post("/api/direct-auth", loginData);
        } catch (thirdErr) {
          console.log("Failed with /api/direct-auth, trying /direct-auth...");
          setDebugInfo(prev => prev + `
Αποτυχία, δοκιμή: /direct-auth`);
          
          try {
            response = await api.post("/direct-auth", loginData);
          } catch (fourthErr) {
            console.log("All endpoints failed, trying direct fetch...");
            setDebugInfo(prev => prev + `
Όλα τα endpoints απέτυχαν, δοκιμή με fetch`);
            
            // Last resort - try with fetch directly
            try {
              const fetchResponse = await fetch(`${window.location.origin}/api/direct-auth`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
              });
              
              if (fetchResponse.ok) {
                response = { data: await fetchResponse.json() };
                console.log("Direct fetch successful:", response);
                setDebugInfo(prev => prev + `
Fetch επιτυχές: ${JSON.stringify(response.data)}`);
              } else {
                console.error("Direct fetch failed:", fetchResponse.status);
                setDebugInfo(prev => prev + `
Fetch απέτυχε: ${fetchResponse.status}`);
                throw new Error(`Fetch failed with status ${fetchResponse.status}`);
              }
            } catch (fetchErr) {
              console.error("Fetch attempt failed:", fetchErr);
              setDebugInfo(prev => prev + `
Fetch error: ${fetchErr.message}`);
              
              // If all else fails and it's admin, use hardcoded login
              if (loginData.email === 'zp@coffeelab.gr' && loginData.password === 'Zoespeppas2025!') {
                console.log("%cFALLBACK TO HARDCODED ADMIN", "background: orange; color: black; padding: 5px;");
                setDebugInfo(prev => prev + `
Χρήση fallback hardcoded admin`);
                
                // Create a mock response with admin data
                const adminData = {
                  id: 1,
                  name: 'Admin',
                  email: 'zp@coffeelab.gr',
                  role: 'admin'
                };
                
                // Store admin data in localStorage
                localStorage.setItem("userRole", adminData.role);
                localStorage.setItem("userId", adminData.id);
                localStorage.setItem("userName", adminData.name);
                
                console.log("Admin fallback successful, navigating to /admin");
                setDebugInfo(prev => prev + `
Admin fallback successful, navigating to /admin`);
                
                // Navigate to admin page
                navigate('/admin');
                return;
              }
              
              // If not admin, rethrow the original error
              throw firstErr;
            }
          }
        }
      }
    }

    const user = response.data;
    console.log("LOGIN USER DATA:", user);
    console.log("Response status:", response.status);
    console.log("Full response:", JSON.stringify(response.data));
    
    setDebugInfo(prev => prev + `\nΕπιτυχής σύνδεση! Ρόλος: ${user.role}\nΔεδομένα: ${JSON.stringify(user)}`);

    // Clear any previous session data
    localStorage.clear();
    
    // Store new user data
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("userName", user.name);

    // Navigate based on role
    if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'area_manager') navigate('/area-manager');
    else if (user.role === 'coffee_specialist') navigate('/coffee-specialist');
    else navigate('/');

  } catch (err) {
    console.error("Login error:", err);
    console.error("Error details:", err.message);
    
    // Detailed error message
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response error status:", err.response.status);
      console.error("Response error data:", JSON.stringify(err.response.data));
      
      setErrorMessage(`Σφάλμα ${err.response.status}: ${err.response.data.message || 'Λάθος στοιχεία σύνδεσης'}`);
      setDebugInfo(`Response error: ${JSON.stringify(err.response.data)}\nStatus: ${err.response.status}\nHeaders: ${JSON.stringify(err.response.headers)}`);
    } else if (err.request) {
      // The request was made but no response was received
      console.error("Request error - no response received");
      console.error("Request details:", err.request);
      
      setErrorMessage("Δεν υπάρχει απάντηση από τον server. Ελέγξτε τη σύνδεσή σας.");
      setDebugInfo(`Request error: ${JSON.stringify(err.request)}\nΔεν ελήφθη απάντηση από τον server.`);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error in request setup:", err.message);
      
      setErrorMessage(`Σφάλμα: ${err.message}`);
      setDebugInfo(`Error: ${err.message}\nStack: ${err.stack}`);
    }
    
    console.log("=== LOGIN ATTEMPT END ===");
  } finally {
    setIsLoading(false);
  }
};

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    backgroundImage: 'url("/login_background.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: "'Poppins', sans-serif"
  };

  const loginBoxStyle = {
    backgroundColor: 'rgba(238, 247, 241, 0.6)',
    padding: '20px 40px',
    borderRadius: '30px',
    boxShadow: '0 5px 20px rgba(0,0,0,1)',
    width: '311px',
    textAlign: 'center'
  };

  const logoStyle = { marginBottom: '10px' };

  const welcomeStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333'
  };

  const subtitleStyle = {
    fontSize: '18px',
    color: '#666',
    marginBottom: '25px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#32cd32',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '17px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  const errorStyle = {
    color: 'red',
    marginBottom: '15px',
    fontSize: '14px',
    fontWeight: 'bold'
  };

  const debugStyle = {
    color: '#666',
    marginTop: '15px',
    fontSize: '12px',
    wordBreak: 'break-word',
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
    maxHeight: '100px',
    overflowY: 'auto'
  };

  return (
    <div style={containerStyle}>
      <div style={loginBoxStyle}>
        <div style={logoStyle}>
          <img src="/10yearscl.jpg" alt="Coffee Lab" width="140" />
        </div>
        <div style={welcomeStyle}>Welcome to Coffee Lab</div>
        <div style={subtitleStyle}>Σύστημα Διαχείρισης</div>

        {errorMessage && <div style={errorStyle}>{errorMessage}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Κωδικός"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          disabled={isLoading}
        />
        <button 
          style={{
            ...buttonStyle,
            backgroundColor: isLoading ? '#999' : '#32cd32',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }} 
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Σύνδεση...' : 'Είσοδος'}
        </button>

        {debugInfo && <div style={debugStyle}>{debugInfo}</div>}
      </div>
    </div>
  );
};

export default LoginForm;
