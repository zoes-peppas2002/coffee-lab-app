import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useNavigate } from 'react-router-dom';

const ChecklistTemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/admin');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/templates/all');
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      const parsedTemplates = data.map(t => {
        let parsedData;
        try {
          parsedData = typeof t.template_data === 'string' ? JSON.parse(t.template_data) : t.template_data;
        } catch (err) {
          console.error("Failed to parse template_data for template ID:", t.id, t.template_data);
          parsedData = [];
        }
        return {
          ...t,
          template_data: parsedData
        };
      });
      setTemplates(parsedTemplates);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Failed to load templates. Please try again later.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το template;')) return;
    try {
      const response = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete template');
      alert('Το template διαγράφηκε επιτυχώς!');
      fetchTemplates();
    } catch (err) {
      console.error('Error deleting template:', err);
      alert(`Αποτυχία διαγραφής template: ${err.message}`);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/templates/edit/${id}`);
  };

  // Removed PDF view functionality as requested

  const handleCreateNew = () => {
    navigate('/admin/templates/create');
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'area_manager': return 'Area Manager';
      case 'coffee_specialist': return 'Coffee Specialist';
      default: return role;
    }
  };

  return (
    <AdminLayout onBack={handleBack} onLogout={handleLogout}>
      <div style={{ padding: 20, width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
        <h2>Διαχείριση Checklist Templates</h2>

        <button
          onClick={handleCreateNew}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            marginBottom: '20px',
            cursor: 'pointer'
          }}
        >
          Δημιουργία Νέου Template
        </button>

        {loading ? (
          <p>Φόρτωση...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : templates.length === 0 ? (
          <p>Δεν υπάρχουν αποθηκευμένα templates.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
            {templates.map(template => (
              <div
                key={template.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  width: '100%',
                  maxWidth: '400px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <h3>Ρόλος: {getRoleDisplayName(template.role)}</h3>
                <p>Κατηγορίες: {template.template_data?.length || 0}</p>
                <p>Δημιουργήθηκε: {new Date(template.created_at).toLocaleDateString()}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px' }}>
                  <button
                    onClick={() => handleEdit(template.id)}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      padding: '8px 15px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Επεξεργασία
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      padding: '8px 15px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Διαγραφή
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ChecklistTemplateManagement;
