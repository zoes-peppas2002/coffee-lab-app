import React, { useEffect, useState } from 'react';
import { pdf, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register το font σου (υποθέτω έχεις το αρχείο στη public/fonts)
Font.register({
  family: 'NotoSans',
  src: '/fonts/NotoSans-VariableFont_wdth,wght.ttf'
});

// Στυλ του PDF
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 14, fontFamily: 'NotoSans', lineHeight: 1.6 },
  header: { fontSize: 22, marginBottom: 25, textAlign: 'left', paddingLeft: 0 },
  section: { marginBottom: 25 },
  role: { fontSize: 16, marginBottom: 20 },
  category: { marginBottom: 12, fontSize: 16, fontWeight: 'bold', textDecoration: 'underline' },
  subcategory: { marginLeft: 25, fontSize: 14 },
  critical: { color: 'red', fontSize: 12 }
});

// Το περιεχόμενο του PDF
const PDFContent = ({ template }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Checklist Template</Text>
      <Text style={styles.role}>Ρόλος: {template.role}</Text>

      {template.categories.map((cat, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.category}>Κατηγορία: {cat.name} (Βαρύτητα: {cat.weight})</Text>

          {cat.subcategories.map((sub, subIndex) => (
            <Text key={subIndex} style={styles.subcategory}>
              - {sub.name} {sub.critical && <Text style={styles.critical}>(Μηδενιστική)</Text>}
            </Text>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);

const ChecklistTemplatePDF = ({ template, onBack }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);

  useEffect(() => {
    const generatePdf = async () => {
      const blob = await pdf(<PDFContent template={template} />).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfBlob(blob);
    };
    if (template) generatePdf();
  }, [template]);

  const handleDownload = () => {
    if (pdfBlob) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = 'checklist_template.pdf';
      link.click();
    }
  };

  if (!template) return <div>Δεν υπάρχουν δεδομένα Template.</div>;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, backgroundColor: '#fff' }}>
      
      {/* Πάνω Μπάρα Κουμπιών */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%',
        height: 60,
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px',
        zIndex: 10
      }}>
        <button onClick={onBack} style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #ccc',
          padding: '10px 20px',
          borderRadius: '5px',
          marginRight:'-10px'
        }}>Επιστροφή</button>

        <button onClick={handleDownload} style={{
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px'
        }}>Λήψη PDF</button>

        <button onClick={() => window.location.href='/login'} style={{
          backgroundColor: '#dc3545',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          marginRight: '10px'
        }}>Logout</button>
      </div>

      {/* PDF Rendering */}
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          title="Checklist PDF"
          style={{
            position: 'absolute',
            top: 60, // κάτω από τη μπάρα
            left: 0,
            width: '100%',
            height: 'calc(100% - 60px)',
            border: 'none'
          }}
        />
      ) : (
        <div style={{ marginTop: 80, textAlign: 'center' }}>Φόρτωση PDF...</div>
      )}
    </div>
  );
};

export default ChecklistTemplatePDF;