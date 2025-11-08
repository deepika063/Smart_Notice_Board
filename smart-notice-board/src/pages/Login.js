import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: 'Computer Science',
    studentId: '',
    phone: ''
  });
  const { login, loading, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const result = await register(registerData);
    if (result.success) {
      if (result.requiresApproval) {
        alert('Registration submitted! Waiting for admin approval.');
        setIsRegistering(false);
      } else {
        alert('Registration successful! You can now login.');
        setIsRegistering(false);
      }
    }
  };

  const departments = [
    'Computer Science',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Information Technology'
  ];

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Toggle between Login and Register */}
        <div className="auth-tabs">
          <button 
            className={`tab ${!isRegistering ? 'active' : ''}`}
            onClick={() => setIsRegistering(false)}
          >
            Login
          </button>
          <button 
            className={`tab ${isRegistering ? 'active' : ''}`}
            onClick={() => setIsRegistering(true)}
          >
            Register
          </button>
        </div>

        {!isRegistering ? (
          // LOGIN FORM
          <>
            <div className="auth-header">
              <h1>Welcome Back! 👋</h1>
              <p>Sign in to your CampusConnect account</p>
            </div>
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your college email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" /> Remember me
                </label>
                
              </div>
              
              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="small" text="" /> : 'Sign In'}
              </button>
            </form>
          </>
        ) : (
          // REGISTRATION FORM
          <>
            <div className="auth-header">
              <h1>Join CampusConnect! 🎓</h1>
              <p>Create your account to get started</p>
            </div>

            <form onSubmit={handleRegister}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    placeholder="email@college.edu"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={registerData.role}
                    onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Department</label>
                  <select
                    value={registerData.department}
                    onChange={(e) => setRegisterData({...registerData, department: e.target.value})}
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {registerData.role === 'student' && (
                <div className="form-group">
                  <label>Student ID</label>
                  <input
                    type="text"
                    value={registerData.studentId}
                    onChange={(e) => setRegisterData({...registerData, studentId: e.target.value})}
                    placeholder="Enter your student ID"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    placeholder="Create password"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              {registerData.role === 'faculty' && (
                <div className="approval-notice">
                  <div className="notice-icon">⏳</div>
                  <div>
                    <strong>Admin Approval Required</strong>
                    <p>Faculty accounts require admin approval. You'll be notified once your account is activated.</p>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="register-button"
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="small" text="" /> : 
                 registerData.role === 'faculty' ? 'Submit for Approval' : 'Create Account'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;