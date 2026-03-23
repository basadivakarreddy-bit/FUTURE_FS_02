import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, LogOut, User, BarChart2 } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '260px', 
        background: 'var(--bg-main)', 
        borderRight: 'var(--glass-border)', 
        display: 'flex', 
        flexDirection: 'column',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>

          <h2 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '1px' }}>LEAD<span style={{ color: 'var(--primary)' }}>STACK</span></h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <NavLink to="/" end style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px',
            textDecoration: 'none', color: isActive ? 'white' : 'var(--text-muted)',
            background: isActive ? 'rgba(124, 131, 253, 0.1)' : 'transparent',
            transition: 'all 0.2s'
          })}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/leads" style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px',
            textDecoration: 'none', color: isActive ? 'white' : 'var(--text-muted)',
            background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            transition: 'all 0.2s'
          })}>
            <Users size={20} /> Leads Management
          </NavLink>
          <NavLink to="/analytics" style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px',
            textDecoration: 'none', color: isActive ? 'white' : 'var(--text-muted)',
            background: isActive ? 'rgba(55, 188, 155, 0.1)' : 'transparent',
            transition: 'all 0.2s'
          })}>
            <BarChart2 size={20} /> Analytics
          </NavLink>
        </nav>

        <div style={{ borderTop: 'var(--glass-border)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <div style={{ width: '36px', height: '36px', background: '#4a5568', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} />
             </div>
             <div>
                <p style={{ fontSize: '14px', fontWeight: '600' }}>{user?.username || 'Admin'}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Administrator</p>
             </div>
          </div>
          <button onClick={handleLogout} style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', 
            background: 'rgba(255, 107, 107, 0.1)', color: '#ff6b6b', border: '1px solid rgba(255, 107, 107, 0.2)',
            fontSize: '14px', fontWeight: '500'
          }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px', background: 'linear-gradient(135deg, #0b0c14 0%, #151829 100%)' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
