
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateChecklistForm = () => {
  const [template, setTemplate] = useState(null);
  const [responses, setResponses] = useState({});
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const role = localStorage.getItem('userRole');

  const today = new Date();
  const date = today.toLocaleDateString('el-GR');
  const time = today.toLocaleTimeString('el-GR');

  useEffect(() => {
    fetchTemplate();
    fetchStores();
  }, []);

  const fetchTemplate = async () => {
    try {
      const res = await fetch(`/api/checklists/template/${role}`);
      const data = await res.json();
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      setTemplate(parsed);
      setLoading(false);
    } catch (err) {
      console.error('Error loading template:', err);
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await fetch(`/api/stores/by-user/${userId}`);
      const data = await res.json();
      setStores(data);
    } catch (err) {
      console.error('Error loading stores:', err);
    }
  };

  const handleResponse = (catIdx, subIdx, value) => {
    setResponses((prev) => {
      const updated = { ...prev };
      if (!updated[catIdx]) updated[catIdx] = {};
      updated[catIdx][subIdx] = value;
      return updated;
    });
  };

  const calculateScore = () => {
    let totalScore = 0;
    let hasZeroCutoff = false;

    template.forEach((category, cIdx) => {
      const answers = responses[cIdx] || {};
      const items = category.subcategories || [];
      const weight = parseFloat(category.weight) || 0;
      let scoreSum = 0;
      let count = 0;

      items.forEach((item, sIdx) => {
        const value = answers[sIdx];
        if (value !== undefined) {
          const numeric = parseInt(value);
          scoreSum += numeric;
          count++;
          if (item.has_cutoff && numeric < 2) {
            hasZeroCutoff = true;
          }
        }
      });

      const categoryAvg = count ? (scoreSum / (count * 4)) * 100 : 0;
      if (!hasZeroCutoff) {
        totalScore += categoryAvg * weight;
      }
    });

    return {
      totalScore: hasZeroCutoff ? 0 : totalScore,
      hasZeroCutoff
    };
  };

  const handleSubmit = async () => {
    if (!selectedStore) {
      alert('Παρακαλώ επιλέξτε κατάστημα');
      return;
    }

    const selectedStoreData = stores.find(s => s.id === parseInt(selectedStore));
    const { totalScore, hasZeroCutoff } = calculateScore();

    const checklistData = {
      date,
      time,
      user_id: userId,
      user_name: userName,
      store_id: selectedStore,
      store_name: selectedStoreData?.name || '',
      responses,
      comments,
      has_images: images.length > 0
    };

    try {
      // Create a FormData object to send both JSON data and files
      const formData = new FormData();
      
      // Add the checklist data as JSON
      formData.append('checklist_data', JSON.stringify(checklistData));
      formData.append('user_id', userId);
      formData.append('store_id', selectedStore);
      formData.append('total_score', totalScore);
      formData.append('has_zero_cutoff', hasZeroCutoff ? '1' : '0');
      
      // Add each image to the form data
      images.forEach((image, index) => {
        formData.append('images', image);
      });

      // Send the form data to the server
      await axios.post("/api/checklists", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('✅ Υποβλήθηκε επιτυχώς!');
      
      // Redirect based on user role
      if (role === 'area_manager') {
        navigate('/area-manager');
      } else if (role === 'coffee_specialist') {
        navigate('/coffee-specialist');
      } else if (role === 'omada_krousis') {
        navigate('/omada-krousis');
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error submitting checklist:', err);
      alert('Αποτυχία υποβολής');
    }
  };

  if (loading || !template) return <div style={{ padding: 20 }}>Φόρτωση...</div>;

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Poppins, sans-serif',
      width: '100%',
      maxWidth: '800px',
      margin: 'auto',
      background: '#f9f9f9',
      borderRadius: '16px',
      boxShadow: '0 0 16px rgba(0,0,0,0.1)',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: 30, color: '#222c36' }}>📝 Νέο Checklist</h2>

      <div style={{ marginBottom: 10 }}><strong>Ημερομηνία:</strong> {date}</div>
      <div style={{ marginBottom: 10 }}><strong>Ώρα:</strong> {time}</div>
      <div style={{ marginBottom: 20 }}><strong>Όνομα:</strong> {userName}</div>

      <label><strong>Επιλέξτε κατάστημα:</strong></label>
      <select value={selectedStore} onChange={e => setSelectedStore(e.target.value)} style={{
        marginBottom: 30,
        padding: '10px',
        width: '100%',
        borderRadius: '8px'
      }}>
        <option value="">-- Επιλογή --</option>
        {stores.map(store => (
          <option key={store.id} value={store.id}>{store.name}</option>
        ))}
      </select>

      {template.map((category, cIdx) => (
        <div key={cIdx} style={{ marginBottom: 40, backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
          <h3 style={{ color: '#007BFF' }}>{category.name} ({category.weight * 100}%)</h3>
          {(category.subcategories || []).map((item, sIdx) => (
            <div key={sIdx} style={{ marginLeft: 10, marginBottom: 15 }}>
              <label>
                <strong>{item.name}</strong> {item.has_cutoff && <span style={{ color: 'red' }}>(cutoff)</span>}
              </label><br />
              {[0, 1, 2, 3, 4].map(score => (
                <label key={score} style={{ marginRight: 12 }}>
                  <input
                    type="radio"
                    name={`cat-${cIdx}-sub-${sIdx}`}
                    value={score}
                    onChange={() => handleResponse(cIdx, sIdx, score)}
                  /> {score}
                </label>
              ))}
            </div>
          ))}
        </div>
      ))}

      <div style={{ marginBottom: 20 }}>
        <label><strong>Σχόλια:</strong></label><br />
        <textarea
          value={comments}
          onChange={e => setComments(e.target.value)}
          rows="4"
          cols="50"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label><strong>Προσθήκη Φωτογραφιών:</strong></label><br />
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={(e) => {
            const files = Array.from(e.target.files);
            setImages([...images, ...files]);
            
            // Create preview URLs
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviewImages([...previewImages, ...newPreviews]);
          }}
          style={{ marginBottom: '10px' }}
        />
        
        {previewImages.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Προεπισκόπηση Φωτογραφιών:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {previewImages.map((preview, index) => (
                <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <img 
                    src={preview} 
                    alt={`Preview ${index}`} 
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      objectFit: 'cover',
                      borderRadius: '5px'
                    }} 
                  />
                  <button 
                    onClick={() => {
                      // Remove image and preview
                      const newImages = [...images];
                      newImages.splice(index, 1);
                      setImages(newImages);
                      
                      const newPreviews = [...previewImages];
                      URL.revokeObjectURL(newPreviews[index]); // Free memory
                      newPreviews.splice(index, 1);
                      setPreviewImages(newPreviews);
                    }}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      background: 'rgba(255, 0, 0, 0.7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={handleSubmit} style={{
          padding: '12px 24px',
          backgroundColor: '#28a745',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          ✅ Υποβολή
        </button>
      </div>
    </div>
  );
};

export default CreateChecklistForm;
