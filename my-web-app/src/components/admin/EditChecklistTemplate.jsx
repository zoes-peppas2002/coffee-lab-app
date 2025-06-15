import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';

const roles = [
  { display: 'Area Manager', value: 'area_manager' },
  { display: 'Coffee Specialist', value: 'coffee_specialist' }
];

const EditChecklistTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [role, setRole] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      console.log('Fetching template with ID:', id);
      const response = await fetch(`/api/templates/${id}`);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to fetch template');
      }
      
      const template = await response.json();
      console.log('Template data:', template);
      
      setRole(template.role);
      console.log('Role set to:', template.role);
      
      // Parse the template_data JSON string to an array
      console.log('Template data type:', typeof template.template_data);
      console.log('Raw template data:', template.template_data);
      
      let templateData;
      try {
        templateData = typeof template.template_data === 'string' 
          ? JSON.parse(template.template_data) 
          : template.template_data;
        
        console.log('Parsed template data:', templateData);
        
        if (!Array.isArray(templateData)) {
          console.error('Template data is not an array:', templateData);
          throw new Error('Invalid template data format');
        }
      } catch (parseErr) {
        console.error('Error parsing template data:', parseErr);
        throw new Error('Failed to parse template data');
      }
      
      setCategories(templateData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching template:', err);
      setError(`Failed to load template: ${err.message}`);
      setLoading(false);
    }
  };

  const addCategory = () => {
    setCategories([...categories, { name: '', weight: '', subcategories: [] }]);
  };

  const updateCategoryField = (index, field, value) => {
    const updated = [...categories];
    // Convert weight to a number if it's a valid number
    if (field === 'weight' && value !== '') {
      updated[index][field] = parseFloat(value);
    } else {
      updated[index][field] = value;
    }
    setCategories(updated);
  };

  const addSubcategory = (catIndex) => {
    const updated = [...categories];
    updated[catIndex].subcategories.push({ name: '', critical: false });
    setCategories(updated);
  };

  const updateSubcategoryField = (catIndex, subIndex, field, value) => {
    const updated = [...categories];
    updated[catIndex].subcategories[subIndex][field] = value;
    setCategories(updated);
  };

  const removeCategory = (index) => {
    const updated = [...categories];
    updated.splice(index, 1);
    setCategories(updated);
  };

  const removeSubcategory = (catIndex, subIndex) => {
    const updated = [...categories];
    updated[catIndex].subcategories.splice(subIndex, 1);
    setCategories(updated);
  };

  const handleSave = async () => {
    if (!role || categories.length === 0) {
      alert("Συμπλήρωσε όλα τα πεδία.");
      return;
    }

    // Validate that all categories have a name and weight
    const invalidCategories = categories.filter(cat => !cat.name || cat.weight === '' || cat.weight === null);
    if (invalidCategories.length > 0) {
      alert("Συμπλήρωσε όνομα και βαρύτητα για όλες τις κατηγορίες.");
      return;
    }

    // Validate that all subcategories have a name
    const invalidSubcategories = categories.some(cat => 
      cat.subcategories.some(sub => !sub.name)
    );
    if (invalidSubcategories) {
      alert("Συμπλήρωσε όνομα για όλες τις υποκατηγορίες.");
      return;
    }

    // Validate that the sum of weights is 1
    const totalWeight = categories.reduce((sum, cat) => sum + parseFloat(cat.weight), 0);
    if (Math.abs(totalWeight - 1) > 0.01) { // Allow a small margin of error for floating point
      alert(`Το άθροισμα των βαρυτήτων πρέπει να είναι 1. Τρέχον άθροισμα: ${totalWeight.toFixed(2)}`);
      return;
    }

    const updatedTemplate = {
      role,
      categories
    };
    
    console.log("Updating template:", updatedTemplate);

    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTemplate)
      });

      console.log("Response status:", response.status);
      
      if (response.ok) {
        console.log("Template updated successfully");
        alert("Το template ενημερώθηκε!");
        navigate('/admin/templates');
      } else {
        // Try to get more details about the error
        try {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          alert(`Αποτυχία ενημέρωσης: ${errorData.error || 'Άγνωστο σφάλμα'}`);
        } catch (jsonErr) {
          console.error("Could not parse error response:", jsonErr);
          alert("Αποτυχία ενημέρωσης.");
        }
      }
    } catch (err) {
      console.error("Error updating template:", err);
      alert("Σφάλμα σύνδεσης με τον server.");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: 20 }}>
          <h2>Επεξεργασία Checklist Template</h2>
          <p>Φόρτωση...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div style={{ padding: 20 }}>
          <h2>Επεξεργασία Checklist Template</h2>
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={fetchTemplate}>Προσπαθήστε ξανά</button>
          <button onClick={() => navigate('/admin/templates')} style={{ marginLeft: 10 }}>Επιστροφή</button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      onBack={() => navigate('/admin/templates')}
      onLogout={() => navigate('/login')}
    >
      <div style={{ padding: 20 }}>
        <h2>Επεξεργασία Checklist Template</h2>

        <div style={{ marginBottom: 20 }}>
          <label>Ρόλος:</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          >
            <option value="">--Επιλογή Ρόλου--</option>
            {roles.map((r, idx) => (
              <option key={idx} value={r.value}>{r.display}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <button 
            onClick={addCategory} 
            style={{ 
              backgroundColor: '#28a745', 
              color: 'white', 
              padding: '8px 15px', 
              border: 'none', 
              borderRadius: '5px' 
            }}
          >
            Προσθήκη Κατηγορίας
          </button>
          
          <button 
            onClick={handleSave} 
            style={{ 
              backgroundColor: '#007bff', 
              color: 'white', 
              padding: '8px 15px', 
              border: 'none', 
              borderRadius: '5px' 
            }}
          >
            Αποθήκευση Αλλαγών
          </button>
        </div>

        {categories.map((cat, catIndex) => (
          <div key={catIndex} style={{ border: '1px solid #ccc', padding: 15, marginBottom: 20, borderRadius: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <h3 style={{ margin: 0 }}>Κατηγορία {catIndex + 1}</h3>
              <button 
                onClick={() => removeCategory(catIndex)}
                style={{ 
                  backgroundColor: '#dc3545', 
                  color: 'white', 
                  padding: '5px 10px', 
                  border: 'none', 
                  borderRadius: '5px' 
                }}
              >
                Διαγραφή
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Όνομα Κατηγορίας"
              value={cat.name}
              onChange={(e) => updateCategoryField(catIndex, 'name', e.target.value)}
              style={{ width: '100%', marginBottom: 10 }}
            />

            <input
              type="number"
              placeholder="Βαρύτητα (0-1)"
              value={cat.weight}
              onChange={(e) => updateCategoryField(catIndex, 'weight', e.target.value)}
              style={{ width: '100%', marginBottom: 10 }}
            />

            <button 
              onClick={() => addSubcategory(catIndex)} 
              style={{ 
                backgroundColor: '#17a2b8', 
                color: 'white', 
                padding: '5px 10px', 
                border: 'none', 
                borderRadius: '5px', 
                marginBottom: 10 
              }}
            >
              Προσθήκη Υποκατηγορίας
            </button>

            {cat.subcategories.map((sub, subIndex) => (
              <div key={subIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <input
                  type="text"
                  placeholder={`Υποκατηγορία ${subIndex + 1}`}
                  value={sub.name}
                  onChange={(e) => updateSubcategoryField(catIndex, subIndex, 'name', e.target.value)}
                  style={{ flex: 1, marginRight: 10 }}
                />
                <label style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
                  <input
                    type="checkbox"
                    checked={sub.critical}
                    onChange={(e) => updateSubcategoryField(catIndex, subIndex, 'critical', e.target.checked)}
                    style={{ marginRight: 5 }}
                  />
                  Μηδενιστική
                </label>
                <button 
                  onClick={() => removeSubcategory(catIndex, subIndex)}
                  style={{ 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    padding: '3px 8px', 
                    border: 'none', 
                    borderRadius: '5px' 
                  }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        ))}

        <button 
          onClick={handleSave} 
          style={{ 
            backgroundColor: '#007bff', 
            color: 'white', 
            padding: '10px 20px', 
            border: 'none', 
            borderRadius: '5px', 
            marginTop: 20 
          }}
        >
          Αποθήκευση Αλλαγών
        </button>
      </div>
    </AdminLayout>
  );
};

export default EditChecklistTemplate;
