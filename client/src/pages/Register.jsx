import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', phone: '', source: 'Google Search'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '450px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>Create Account</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '24px' }}>Join LeadStack to manage your business</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Username</label>
            <input type="text" name="username" placeholder="Choose a username" value={formData.username} onChange={handleChange} required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Email Address</label>
            <input type="email" name="email" placeholder="email@example.com" value={formData.email} onChange={handleChange} required />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Password</label>
            <input type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Phone Number</label>
            <input type="text" name="phone" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>How did you hear about us?</label>
            <select name="source" value={formData.source} onChange={handleChange}>
              <option>Google Search</option>
              <option>Social Media</option>
              <option>Referral</option>
              <option>Other</option>
            </select>
          </div>

          {error && <p style={{ color: '#ff6b6b', fontSize: '14px' }}>{error}</p>}
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
