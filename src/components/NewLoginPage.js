import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NewLoginPage.css';

const NewLoginPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    confirmPassword: '',
    resetEmail: '',
    resetPhone: '',
  });
  const [showPassword, setShowPassword] = useState({
    login: false,
    signup: false,
    confirm: false
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [resetMethod, setResetMethod] = useState('email');
  const [error, setError] = useState('');

  // Simulated user database
  const DEMO_USERS = {
    'admin@example.com': {
      password: 'admin123',
      fullName: 'Admin User',
      phone: '1234567890'
    },
    'demo@example.com': {
      password: 'demo123',
      fullName: 'Demo User',
      phone: '0987654321'
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      navigate('/');
    }

    // Check if user has saved credentials
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    const rememberMe = localStorage.getItem('rememberMe');
    
    if (rememberMe === 'true' && savedUsername && savedPassword) {
      setFormData(prev => ({
        ...prev,
        username: savedUsername,
        password: savedPassword
      }));
      setRememberMe(true);
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const validateCredentials = (username, password) => {
    // Check if user exists in demo database
    const user = DEMO_USERS[username];
    if (!user) {
      return false;
    }
    return user.password === password;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    // Store credentials if remember me is checked
    if (rememberMe) {
      localStorage.setItem('username', formData.username);
      localStorage.setItem('password', formData.password);
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify({
        email: formData.username,
        fullName: 'User',
        phone: ''
      }));
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      localStorage.removeItem('rememberMe');
      sessionStorage.setItem('token', 'demo-token');
      sessionStorage.setItem('user', JSON.stringify({
        email: formData.username,
        fullName: 'User',
        phone: ''
      }));
    }
    
    // Navigate to home page immediately
    navigate('/');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check if user already exists
    if (DEMO_USERS[formData.email]) {
      setError('User already exists with this email');
      return;
    }

    // Add new user to demo database
    DEMO_USERS[formData.email] = {
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone
    };

    // Auto login after signup
    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('user', JSON.stringify(DEMO_USERS[formData.email]));
    
    alert('Account created successfully!');
    navigate('/');
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');

    const contact = resetMethod === 'email' ? formData.resetEmail : formData.resetPhone;
    
    if (!contact.trim()) {
      setError(`Please enter your ${resetMethod}`);
      return;
    }

    // Simulate password reset
    alert(`Password reset link sent to your ${resetMethod}!`);
    setCurrentPage('login');
  };

  const handleGoogleSignIn = () => {
    // Simulate Google Sign-In
    const googleUser = {
      email: 'google@example.com',
      fullName: 'Google User',
      phone: '1111111111'
    };

    localStorage.setItem('token', 'google-token');
    localStorage.setItem('user', JSON.stringify(googleUser));
    
    navigate('/');
  };

  const renderLoginPage = () => (
    <div id="loginPage" className={`page ${currentPage === 'login' ? 'active-page' : ''}`}>
      <h1>Sign In</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="username">Email</label>
          <input
            type="email"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              type={showPassword.login ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
            <button 
              type="button"
              className={`eye-icon ${showPassword.login ? 'visible' : ''}`}
              onClick={() => setShowPassword(prev => ({ ...prev, login: !prev.login }))}
            >
              👁️
            </button>
          </div>
        </div>
        
        <div className="remember-forgot">
          <div className="remember-me">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember">Remember me</label>
          </div>
          
          <div className="forgot-password">
            <button 
              type="button" 
              className="link-button"
              onClick={() => setCurrentPage('reset')}
            >
              Forgot Password?
            </button>
          </div>
        </div>
        
        <button type="submit" className="login-btn">Sign In</button>
      </form>
      
      <div className="divider">OR</div>
      
      <button className="google-btn" onClick={handleGoogleSignIn}>
        <img src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" alt="Google logo" />
        Sign in with Google
      </button>
      
      <div className="signup-text">
        Don't have an account? 
        <button 
          type="button" 
          className="link-button"
          onClick={() => setCurrentPage('signup')}
        >
          Sign Up
        </button>
      </div>
      
      <div className="terms">
        For sign-up, Payment details or card information are not required.
      </div>
      
      <div className="terms">
        <Link to="/terms">Terms of Service</Link> &nbsp; <Link to="/privacy">Privacy Policy</Link>
      </div>
    </div>
  );

  const renderSignupPage = () => (
    <div id="signupPage" className={`page ${currentPage === 'signup' ? 'active-page' : ''}`}>
      <h1>Create Account</h1>
      
      <form onSubmit={handleSignup}>
        <div className="input-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Full Name"
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="signupPassword">Password</label>
          <div className="password-field">
            <input
              type={showPassword.signup ? "text" : "password"}
              id="signupPassword"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
            />
            <span 
              className="eye-icon"
              onClick={() => setShowPassword(prev => ({ ...prev, signup: !prev.signup }))}
            >
              👁️
            </span>
          </div>
        </div>
        
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-field">
            <input
              type={showPassword.confirm ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              required
            />
            <span 
              className="eye-icon"
              onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
            >
              👁️
            </span>
          </div>
        </div>
        
        <button type="submit" className="signup-btn">Create Account</button>
      </form>
      
      <div className="divider">OR</div>
      
      <button className="google-btn" onClick={handleGoogleSignIn}>
        <img src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" alt="Google logo" />
        Sign up with Google
      </button>
      
      <div className="signup-text">
        Already have an account? <a href="#" onClick={() => setCurrentPage('login')}>Login</a>
      </div>
      
      <div className="terms">
        By signing up, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
      </div>
    </div>
  );

  const renderResetPage = () => (
    <div id="forgotPasswordPage" className={`page ${currentPage === 'reset' ? 'active-page' : ''}`}>
      <h1>Reset Password</h1>
      
      <div className="reset-options">
        <div 
          className={`reset-option ${resetMethod === 'email' ? 'active' : ''}`}
          onClick={() => setResetMethod('email')}
        >
          Email
        </div>
        <div 
          className={`reset-option ${resetMethod === 'phone' ? 'active' : ''}`}
          onClick={() => setResetMethod('phone')}
        >
          Phone
        </div>
      </div>
      
      {resetMethod === 'email' ? (
        <form onSubmit={handleResetPassword}>
          <div className="input-group">
            <label htmlFor="resetEmail">Enter your email address</label>
            <input
              type="email"
              id="resetEmail"
              name="resetEmail"
              value={formData.resetEmail}
              onChange={handleInputChange}
              placeholder="Email address"
              required
            />
          </div>
          
          <button type="submit" className="reset-btn">Send Reset Link</button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <div className="input-group">
            <label htmlFor="resetPhone">Enter your phone number</label>
            <input
              type="tel"
              id="resetPhone"
              name="resetPhone"
              value={formData.resetPhone}
              onChange={handleInputChange}
              placeholder="Phone number"
              required
            />
          </div>
          
          <button type="submit" className="reset-btn">Send Verification Code</button>
        </form>
      )}
      
      <button className="back-btn" onClick={() => setCurrentPage('login')}>Back to Login</button>
    </div>
  );

  return (
    <div className="page-container">
      <div className="background-circle top-left"></div>
      <div className="background-circle bottom-right"></div>
      <div className="blur-overlay"></div>
      
      <div className="login-container">
        {renderLoginPage()}
        {renderSignupPage()}
        {renderResetPage()}
      </div>
    </div>
  );
};

export default NewLoginPage;