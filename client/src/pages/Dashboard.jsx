import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';
import { 
  Users, UserPlus, UserCheck, UserX, Download, 
  Diamond, Sparkles, Target, Hexagon 
} from 'lucide-react';
import { API_BASE_URL } from '../api/config';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resp = await axios.get(`${API_BASE_URL}/api/leads/stats`);
        setStats(resp.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const STATUS_COLORS = {
    'New': '#3b82f6',       // Blue
    'Contacted': '#f6bb42', // Yellow
    'Converted': '#37bc9b'  // Green
  };

  if (loading) return <div style={{ color: 'white' }}>Loading Dashboard...</div>;

  const statusData = stats?.statusCounts.map(s => ({ name: s.status, value: s.count })) || [];
  const loginActivityData = stats?.loginActivity?.map(a => ({ date: a.date, count: a.count })) || [];
  const leadActivityData = stats?.activity?.map(a => ({ date: a.date, count: a.count })) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Business Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back! Here's an overview of your leads.</p>
        </div>
        <button onClick={() => window.location.href = `${API_BASE_URL}/api/export`} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <StatCard 
          title="TOTAL LEADS" 
          value={stats?.total || 0} 
          subtitle="All time"
          icon={<Diamond size={18} />} 
          color="#ef4444" 
          showDot={true}
        />
        <StatCard 
          title="NEW LEADS" 
          value={stats?.statusCounts.find(s => s.status === 'New')?.count || 0} 
          subtitle="Awaiting contact"
          icon={<Sparkles size={18} />} 
          color="#3b82f6" 
        />
        <StatCard 
          title="CONTACTED" 
          value={stats?.statusCounts.find(s => s.status === 'Contacted')?.count || 0} 
          subtitle="In progress"
          icon={<Target size={18} />} 
          color="#f6bb42" 
        />
        <StatCard 
          title="CONVERTED" 
          value={stats?.statusCounts.find(s => s.status === 'Converted')?.count || 0} 
          subtitle="25% conv. rate"
          icon={<Hexagon size={18} />} 
          color="#37bc9b" 
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', minHeight: '400px' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '24px', fontSize: '16px', color: 'var(--text-muted)' }}>Lead Status Distribution</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1e2e', border: 'none', borderRadius: '8px', color: 'white' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '24px', fontSize: '16px', color: 'var(--text-muted)' }}>Daily Login Activity</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart data={loginActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--text-muted)" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                  }}
                />
                <YAxis 
                  stroke="var(--text-muted)" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  allowDecimals={false}
                  dx={-5}
                />
                <Tooltip 
                  contentStyle={{ background: '#1a1e2e', border: 'none', borderRadius: '8px', color: 'white' }} 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px' }}>Recent Leads</h3>
          <button 
            onClick={() => navigate('/leads')}
            style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
          >
            View All Leads
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '14px' }}>NAME</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '14px' }}>EMAIL</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '14px' }}>STATUS</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '14px' }}>JOINED</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recentLeads.map(lead => (
              <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600' }}>{lead.name}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>{lead.email}</td>
                <td style={{ padding: '16px' }}>
                  <span className={`status-badge status-${lead.status.toLowerCase()}`}>{lead.status}</span>
                </td>
                <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>{new Date(lead.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Login Details */}
      <div className="glass-card">
        <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Recent Login Details</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '14px' }}>USERNAME</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '14px' }}>EMAIL</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '14px' }}>TIME</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recentLogins?.map((login, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600' }}>{login.username}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>{login.email}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>{new Date(login.login_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon, color, showDot }) => (
    <div className="glass-card stat-card-glow" style={{ '--card-color': color, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>{title}</p>
        <div style={{ color: color, opacity: 0.8 }}>{icon}</div>
      </div>
      <h2 className="stat-value" style={{ color: color }}>{value}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{subtitle}</p>
      {showDot && <div className="stat-dot" style={{ '--card-color': color }}></div>}
    </div>
  );

export default Dashboard;
