import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );
    
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

          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Account</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Security</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {step === 1 ? (
              <>
                <h2>Create Account</h2>
                <p className="auth-subtitle">Step 1: Basic Information</p>

                {error && <div className="auth-error">{error}</div>}

                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <i className="fas fa-user"></i>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <i className="fas fa-envelope"></i>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <div className="input-wrapper">
                    <i className="fas fa-user-tag"></i>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="USER">Team Member</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="auth-btn"
                  onClick={handleNext}
                >
                  Continue
                  <i className="fas fa-arrow-right"></i>
                </button>
              </>
            ) : (
              <>
                <h2>Set Password</h2>
                <p className="auth-subtitle">Step 2: Secure your account</p>

                {error && <div className="auth-error">{error}</div>}

                <div className="form-group">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <i className="fas fa-lock"></i>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <span className="input-hint">Must be at least 6 characters</span>
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="input-wrapper">
                    <i className="fas fa-lock"></i>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                <div className="form-options">
                  <label className="terms-checkbox">
                    <input type="checkbox" required />
                    <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
                  </label>
                </div>

                <div className="form-buttons">
                  <button 
                    type="button" 
                    className="auth-btn secondary"
                    onClick={handleBack}
                  >
                    <i className="fas fa-arrow-left"></i>
                    Back
                  </button>
                  
                  <button 
                    type="submit" 
                    className="auth-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <>
                        <i className="fas fa-user-plus"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <p>Already have an account?</p>
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="auth-illustration">
          <div className="illustration-content">
            <h2>Join thousands of teams</h2>
            <p>Start collaborating with your team in real-time today.</p>
            
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Active Teams</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1M+</span>
                <span className="stat-label">Messages/Day</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
            </div>

            <div className="feature-list">
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>Free for small teams</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>No credit card required</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
