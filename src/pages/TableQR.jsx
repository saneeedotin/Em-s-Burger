import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, Utensils } from 'lucide-react';
import { db, isFirebaseConfigured } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function TableQR() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Connecting to your table...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const processTableScan = async () => {
      const tableNumber = parseInt(id, 10);
      if (isNaN(tableNumber) || tableNumber <= 0 || tableNumber > 100) {
        setError('Invalid Table Number. Please scan a valid table QR code.');
        return;
      }

      try {
        const queryParams = new URLSearchParams(location.search);
        const urlToken = queryParams.get('token');

        // If Firestore is configured and token is in query, verify token
        if (isFirebaseConfigured && urlToken) {
          try {
            const tokenRef = doc(db, 'metadata', 'qr_token');
            const tokenSnap = await getDoc(tokenRef);

            if (tokenSnap.exists() && tokenSnap.data().token) {
              if (tokenSnap.data().token !== urlToken) {
                console.warn('QR token mismatch with latest security token.');
              }
            }
          } catch (e) {
            console.warn('Could not verify QR token from Firestore:', e);
          }
        }

        // Save table number across storage engines for reliable persistence
        localStorage.setItem('ems_table', String(tableNumber));
        sessionStorage.setItem('ems_table', String(tableNumber));

        setStatus(`Table ${tableNumber} verified! Loading menu...`);

        // Smooth redirect to menu
        const timer = setTimeout(() => {
          navigate('/menu');
        }, 800);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error('Table QR processing error:', err);
        // Fallback: save table and proceed
        localStorage.setItem('ems_table', String(tableNumber));
        sessionStorage.setItem('ems_table', String(tableNumber));
        navigate('/menu');
      }
    };

    processTableScan();
  }, [id, navigate, location]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm w-full bg-cream-light p-8 rounded-4xl border-4 border-primary/20 shadow-2xl text-center space-y-4"
      >
        {!error ? (
          <>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
              <Utensils className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-heading font-black text-3xl text-dark">Table {id}</h2>
            <p className="text-dark/70 text-sm font-medium flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>{status}</span>
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="font-heading font-black text-2xl text-dark">Invalid Table QR</h2>
            <p className="text-dark/70 text-sm font-medium">
              {error}
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="mt-4 px-6 py-2.5 rounded-full bg-primary text-cream font-heading font-bold text-sm"
            >
              Browse Full Menu
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
