import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FallbackLoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Παρακαλώ συμπληρώστε όλα τα πεδία");
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setDebugInfo('');

    try {
      // Display debug info
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      setDebugInfo(`Προσπάθεια σύνδεσης στο: ${apiUrl}`);
      
      // Add more debug info
      console.log("=== FALLBACK LOGIN ATTEMPT DEBUG ===");
      console.log("Email:", email.trim().toLowerCase());
      console.log("Password length:", password.trim().length);
      console.log("API URL:", apiUrl);
      
      // Try multiple endpoints
      const loginData = {
        email: email.trim().toLowerCase(),
        password: password.trim()
      };
      
      setDebugInfo(prev => prev + `\nΑποστολή δεδομένων: ${JSON.stringify(loginData)}`);
      
      // Try the test-login endpoint first
      try {
        console.log("Trying test-login endpoint");
        const testResponse = await axios.post("/test-login", loginData);
        console.log("Test login successful:", testResponse.data);
        
        const user = testResponse.data;
        setDebugInfo(prev => prev + `\nΕπιτυχής σύνδεση με test-login! Ρόλος: ${user.role}`);
        
        // Store user data
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name);
        
        // Navigate based on role
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'area_manager') navigate('/area-manager');
        else if (user.role === 'coffee_specialist') navigate('/coffee-specialist');
        else navigate('/');
        
        return;
      } catch (testErr) {
        console.log("Test login failed:", testErr.message);
        setDebugInfo(prev => prev + `\nΑποτυχία σύνδεσης με test-login: ${testErr.message}`);
      }
      
      // Try the direct-login endpoint
      try {
        console.log("Trying direct-login endpoint");
        const directResponse = await axios.post(`${apiUrl}/auth/direct-login`, loginData);
        console.log("Direct login successful:", directResponse.data);
        
        const user = directResponse.data;
        setDebugInfo(prev => prev + `\nΕπιτυχής σύνδεση με direct-login! Ρόλος: ${user.role}`);
        
        // Store user data
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name);
        
        // Navigate based on role
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'area_manager') navigate('/area-manager');
        else if (user.role === 'coffee_specialist') navigate('/coffee-specialist');
        else navigate('/');
        
        return;
      } catch (directErr) {
        console.log("Direct login failed:", directErr.message);
        setDebugInfo(prev => prev + `\nΑποτυχία σύνδεσης με direct-login: ${directErr.message}`);
      }
      
      // If we get here, all login attempts failed
      throw new Error("All login attempts failed");
      
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage(`Σφάλμα σύνδεσης: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Hardcoded admin login
  const handleAdminLogin = () => {
    setEmail('zp@coffeelab.gr');
    setPassword('Zoespeppas2025!');
    setTimeout(() => {
      handleLogin();
    }, 100);
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
    fontWeight: 'bold',
    marginBottom: '10px'
  };

  const adminButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    marginBottom: '15px'
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
        <div style={subtitleStyle}>Σύστημα Διαχείρισης (Fallback)</div>

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
        
        <button 
          style={adminButtonStyle} 
          onClick={handleAdminLogin}
          disabled={isLoading}
        >
          Admin Login
        </button>

        {debugInfo && <div style={debugStyle}>{debugInfo}</div>}
      </div>
    </div>
  );
};

export default FallbackLoginForm;
