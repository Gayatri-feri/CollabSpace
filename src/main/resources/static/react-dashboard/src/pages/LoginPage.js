import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/chat');
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          {/* Logo */}
          <div className="auth-logo">
            <div className="logo-icon">
              <i className="fas fa-comments"></i>
            </div>
            <h1>CollabChat</h1>
            <p>Real-Time Team Collaboration</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Sign in to continue</p>

            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="auth-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* Social Login */}
          <div className="social-login">
            <button className="social-btn google">
              <i className="fab fa-google"></i>
              Continue with Google
            </button>
            <button className="social-btn github">
              <i className="fab fa-github"></i>
              Continue with GitHub
            </button>
          </div>

          {/* Footer */}
          <div className="auth-footer">
            <p>Don't have an account?</p>
            <Link to="/register" className="auth-link">
              Create Account
            </Link>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="auth-illustration">
          <div className="illustration-content">
            <h2>Connect with your team</h2>
            <p>Real-time messaging, video calls, and collaboration tools all in one place.</p>
            
            <div className="feature-list">
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>Instant messaging</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>Video & voice calls</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>File sharing</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>Team channels</span>
              </div>
            </div>

            <div className="testimonial">
              <p>"CollabChat has transformed how our team communicates. Highly recommended!"</p>
              <div className="testimonial-author">
                <img 
                  src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff" 
                  alt="Sarah"
                />
                <div>
                  <span className="name">Sarah Johnson</span>
                  <span className="role">Product Manager at TechCorp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
