import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Edit2, Trash2, Filter } from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', source: 'Manual Entry', status: 'New', notes: ''
  });

  useEffect(() => {
    fetchLeads();
  }, [search, statusFilter]);

  const fetchLeads = async () => {
    try {
      const resp = await axios.get(`http://localhost:5001/api/leads?search=${search}&status=${statusFilter}`);
      setLeads(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (lead = null) => {
    if (lead) {
      setEditingLead(lead);
      setFormData({ ...lead });
    } else {
      setEditingLead(null);
      setFormData({ name: '', email: '', phone: '', source: 'Manual Entry', status: 'New', notes: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLead) {
        await axios.put(`http://localhost:5001/api/leads/${editingLead.id}`, formData);
      } else {
        await axios.post('http://localhost:5001/api/leads', formData);
      }
      setShowModal(false);
      fetchLeads();
    } catch (err) {
      alert(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await axios.delete(`http://localhost:5001/api/leads/${id}`);
        if (showModal) setShowModal(false);
        fetchLeads();
      } catch (err) {
        alert(err.response?.data?.error || 'Deletion failed');
        console.error('Frontend: Deletion error:', err);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Lead Management</h1>
            <p style={{ color: 'var(--text-muted)' }}>View and manage your business pipeline.</p>
          </div>
          <button onClick={() => handleOpenModal()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Add Lead
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by name, status, source..." 
              style={{ width: '100%', paddingLeft: '40px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} color="var(--text-muted)" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '12px 16px' }}>
              <option value="">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th style={{ padding: '12px 24px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '13px' }}>NAME</th>
                <th style={{ padding: '12px 24px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '13px' }}>CONTACT INFO</th>
                <th style={{ padding: '12px 24px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '13px' }}>SOURCE</th>
                <th style={{ padding: '12px 24px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '13px' }}>STATUS</th>
                <th style={{ padding: '12px 24px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '13px' }}>NOTES</th>
                <th style={{ padding: '12px 24px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '13px' }}>CREATED</th>
                <th style={{ padding: '12px 24px', color: 'var(--text-muted)', fontWeight: '500', fontSize: '14px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600' }}>{lead.name}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <p style={{ fontSize: '13px' }}>{lead.email}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{lead.phone}</p>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>{lead.source}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={`status-badge status-${lead.status.toLowerCase()}`}>{lead.status}</span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.notes || 'No notes'}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => handleOpenModal(lead)} style={{ background: 'transparent', border: '1px solid var(--border)', padding: '6px', borderRadius: '6px', color: 'white' }}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(lead.id)} style={{ background: 'transparent', border: '1px solid rgba(255,107,107,0.3)', padding: '6px', borderRadius: '6px', color: '#ff6b6b' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 0 && !loading && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No leads found</div>}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '480px', position: 'relative', padding: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '32px' }}>{editingLead ? 'Edit Lead' : 'Add New Lead'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Full Name</label>
                <input type="text" placeholder="Enter lead name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Email Address</label>
                <input type="email" placeholder="lead@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Phone Number</label>
                <input type="text" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Source</label>
                <select value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })}>
                  <option>Manual Entry</option>
                  <option>Website Form</option>
                  <option>Google Search</option>
                  <option>LinkedIn</option>
                  <option>Social Media</option>
                  <option>Referral</option>
                  <option>Email Campaign</option>
                  <option>Cold Outreach</option>
                </select>
              </div>

              {editingLead && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Initial Notes</label>
                <textarea placeholder="" rows="4" value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} style={{ resize: 'none' }}></textarea>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 2, padding: '14px' }}>
                  {editingLead ? 'Update Lead' : 'Create Lead'}
                </button>
                {editingLead && (
                  <button type="button" onClick={() => handleDelete(editingLead.id)} style={{ 
                      flex: 1, 
                      padding: '14px', 
                      borderRadius: '8px', 
                      border: '1px solid rgba(255,107,107,0.5)', 
                      background: 'rgba(255,107,107,0.1)', 
                      color: '#ff6b6b',
                      fontWeight: '600'
                  }}>Delete</button>
                )}
                <button type="button" onClick={() => setShowModal(false)} style={{ 
                    flex: 1, 
                    padding: '14px', 
                    borderRadius: '8px', 
                    border: 'none', 
                    background: 'rgba(255,255,255,0.1)', 
                    color: 'white',
                    fontWeight: '600'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
