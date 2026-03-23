import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Users, Target, CheckCircle } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resp = await axios.get('http://localhost:5001/api/leads/stats');
        setStats(resp.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading Analytics...</div>;
  if (!stats) return <div style={{ color: 'white', padding: '20px' }}>Failed to load analytics data.</div>;

  const funnelData = [
    { name: 'Total Leads', value: stats.funnel?.total || 0, percentage: '100%', fill: '#3b82f6' },
    { name: 'Contacted', value: stats.funnel?.contacted || 0, percentage: `${Math.round(((stats.funnel?.contacted || 0) / (stats.funnel?.total || 1)) * 100)}%`, fill: '#f6bb42' },
    { name: 'Converted', value: stats.funnel?.converted || 0, percentage: `${Math.round(((stats.funnel?.converted || 0) / (stats.funnel?.total || 1)) * 100)}%`, fill: '#37bc9b' }
  ];

  const sourceData = (stats.sourceCounts || []).map(s => ({ name: s.source || 'Unknown', value: s.count }));
  const COLORS = ['#3b82f6', '#f6bb42', '#37bc9b', '#9d7efd', '#ef4444', '#f97316'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Analytics Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Deep dive into your lead performance and conversion metrics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Conversion Funnel */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '24px', fontSize: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Conversion Funnel</h3>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer>
              <BarChart 
                layout="vertical" 
                data={funnelData} 
                margin={{ left: 100, right: 40 }}
                onMouseMove={(state) => {
                  if (state.activeTooltipIndex !== undefined) {
                    setActiveIndex(state.activeTooltipIndex);
                  }
                }}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} stroke="white" />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ background: '#1a1e2e', border: 'none', borderRadius: '8px', color: 'white' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {funnelData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill} 
                      style={{ 
                        filter: activeIndex === index ? 'brightness(1.2) drop-shadow(0 0 8px ' + entry.fill + ')' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
             {funnelData.map((f, i) => (
               <div key={i} style={{ 
                 textAlign: 'center', 
                 transition: 'all 0.3s ease',
                 transform: activeIndex === i ? 'scale(1.1)' : 'scale(1)',
                 opacity: activeIndex === null || activeIndex === i ? 1 : 0.5
               }}>
                 <p style={{ 
                   fontSize: '24px', 
                   fontWeight: '800', 
                   color: f.fill, 
                   fontFamily: 'Orbitron',
                   textShadow: activeIndex === i ? `0 0 15px ${f.fill}` : 'none'
                 }}>{f.percentage}</p>
                 <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{f.name}</p>
               </div>
             ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          {/* Top Sources */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '24px', fontSize: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Top Sources</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {(stats.sourceCounts || []).slice(0, 6).map((s, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{s.source || 'Unknown'}</span>
                    <span style={{ fontSize: '14px', fontWeight: '700' }}>{s.count}</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${(s.count / (stats.total || 1)) * 100}%`, 
                      background: 'var(--primary)',
                      boxShadow: '0 0 10px var(--primary)'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Source Distribution */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '24px', fontSize: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Lead Sources</h3>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1e2e', border: 'none', borderRadius: '8px', color: 'white' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
