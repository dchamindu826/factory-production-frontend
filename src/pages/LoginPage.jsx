// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService'; // Assuming this path is correct
import './LoginPage.css'; // Make sure this CSS file exists and is imported

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    console.log('LoginPage: handleSubmit initiated.'); // For debugging

    try {
      const data = await login(username, password);
      console.log('LoginPage: Data received from login service:', data); // For debugging

      if (data && data.token && data.user) {
        console.log('LoginPage: Login successful (data.token and data.user exist):', data.user);

        console.log('LoginPage: --- ATTEMPTING TO SET TOKEN AND USER IN LOCALSTORAGE ---');
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUser', JSON.stringify(data.user));
        console.log('LoginPage: --- TOKEN AND USER SHOULD BE SET IN LOCALSTORAGE NOW ---');
        console.log('LoginPage: Auth Token from LS after set:', localStorage.getItem('authToken'));

        // Role-based redirection
        if (data.user.role === 'ADMIN') {
          console.log("LoginPage: Navigating ADMIN to '/'");
          navigate('/'); // Redirect Admin to the main dashboard
        } else if (data.user.role === 'DATA_ENTRY') {
          console.log("LoginPage: Navigating DATA_ENTRY to '/mobile-entry'");
          navigate('/mobile-entry'); // Redirect Data Entry Operator to mobile-entry dashboard
        } else {
          console.warn("LoginPage: Logged in user has an unrecognized role:", data.user.role);
          navigate('/'); // Default redirect for other roles (if any)
        }

      } else {
        console.log('LoginPage: --- LOGIN ATTEMPT: API call might be ok, but no token/user in response data ---', data);
        setError('Login failed. Invalid response from server or missing token/user data.');
      }
    } catch (err) {
      console.log("LoginPage: --- LOGIN ERROR: CATCH BLOCK EXECUTED ---");
      setError(err.message || 'Login failed. Please check your credentials or server connection.');
      console.error('LoginPage: Login page error object:', err);
    } finally {
      setIsLoading(false);
      console.log('LoginPage: handleSubmit finished.'); // For debugging
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-card">
        <h2>Jeans Factory System Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
