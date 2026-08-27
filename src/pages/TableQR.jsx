import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, AlertCircle, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function TableQR() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Verifying table QR code...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const urlToken = queryParams.get('token');

        if (!urlToken) {
          throw new Error('Invalid QR Code. Please scan the actual QR code on your table.');
        }

        const tokenRef = doc(db, 'metadata', 'qr_token');
        const tokenSnap = await getDoc(tokenRef);

        if (tokenSnap.exists() && tokenSnap.data().token === urlToken) {
          // Token is valid!
          setStatus('Verified! Redirecting to menu...');
          sessionStorage.setItem('ems_table', id);
          setTimeout(() => navigate('/menu'), 1500);
        } else {
          // Token mismatch (probably admin reset it)
          throw new Error('This QR code has expired or is invalid. Please ask the staff for a new one.');
        }
      } catch (err) {
        console.error('QR Verification error:', err);
        setError(err.message || 'Failed to verify QR code.');
        sessionStorage.removeItem('ems_table');
        setTimeout(() => navigate('/menu'), 3000);
      }
    };

    verifyToken();
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
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-heading font-black text-2xl text-dark">Table {id}</h2>
            <p className="text-dark/70 text-sm font-medium flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {status}
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <ShieldAlert className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="font-heading font-black text-2xl text-dark">Access Denied</h2>
            <p className="text-dark/70 text-sm font-medium">
              {error}
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
