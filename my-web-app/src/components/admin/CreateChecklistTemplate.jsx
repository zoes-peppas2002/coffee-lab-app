import React, { useState } from 'react';
import AdminLayout from './AdminLayout';

const roles = [
  { display: 'Area Manager', value: 'area_manager' },
  { display: 'Coffee Specialist', value: 'coffee_specialist' }
];

const CreateChecklistTemplate = () => {
  const [role, setRole] = useState('');
  const [categories, setCategories] = useState([]);

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

  const newTemplate = {
    role,
    categories
  };
  
  console.log("Τι στέλνω:", newTemplate);

  try {
    console.log("Sending request to /api/templates");
    const response = await fetch("/api/templates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTemplate)
    });

    console.log("Response status:", response.status);
    
    if (response.ok) {
      console.log("Template saved successfully");
      alert("Το template αποθηκεύτηκε!");
      // Clear form after successful save
      setRole('');
      setCategories([]);
    } else {
      // Try to get more details about the error
      try {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        alert(`Αποτυχία αποθήκευσης: ${errorData.error || 'Άγνωστο σφάλμα'}`);
      } catch (jsonErr) {
        console.error("Could not parse error response:", jsonErr);
        alert("Αποτυχία αποθήκευσης.");
      }
    }
  } catch (err) {
    console.error("Error saving template:", err);
    alert("Σφάλμα σύνδεσης με τον server.");
  }
};


  return (
    <AdminLayout
      onBack={() => window.location.href = '/admin'}
      onLogout={() => window.location.href = '/login'}
    >
      <div style={{ padding: 20 }}>
        <h2>Δημιουργία Checklist Template</h2>

        <div style={{ marginBottom: 20 }}>
          <label>Ρόλος:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
            <option value="">--Επιλογή Ρόλου--</option>
            {roles.map((r, idx) => (
              <option key={idx} value={r.value}>{r.display}</option>
            ))}
          </select>
        </div>

        <button onClick={addCategory} style={{ marginBottom: 20 }}>Προσθήκη Κατηγορίας</button>

        {categories.map((cat, catIndex) => (
          <div key={catIndex} style={{ border: '1px solid #ccc', padding: 15, marginBottom: 20, borderRadius: 10 }}>
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

            <button onClick={() => addSubcategory(catIndex)} style={{ marginBottom: 10 }}>
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
                <label>
                  <input
                    type="checkbox"
                    checked={sub.critical}
                    onChange={(e) => updateSubcategoryField(catIndex, subIndex, 'critical', e.target.checked)}
                  />
                  Μηδενιστική
                </label>
              </div>
            ))}
          </div>
        ))}

        <button onClick={handleSave} style={{ backgroundColor: 'green', color: 'white', padding: '10px 20px' }}>
          Αποθήκευση Template
        </button>
      </div>
    </AdminLayout>
  );
};

export default CreateChecklistTemplate;
